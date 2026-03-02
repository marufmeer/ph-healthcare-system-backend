import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../shared/prisma";
import { AuthProviderType, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt"
passport.use(
  new LocalStrategy({
    usernameField:"email",
    passwordField:"password"
  },async(email:string,password:string,done)=>{
   try {
        const user = await prisma.user.findUnique({ where: { email },include:{
          authProvider:true
        } });
        if (!user) return done(null, false, { message: "Incorrect email." });
            if(!user.isVerified){
return done(null, false, { message: "Your email is not verified." })
            }
            if(user.status===UserStatus.BLOCKED||user.status===UserStatus.DELETED){
   return done(null, false, { message: `Your account is not ${user.status}.` })
            }
 const isGoogleAuthenticated=user.authProvider.some(auth=>auth.provider===AuthProviderType.GOOGLE)
 if(isGoogleAuthenticated && !user.password){
return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." })
 }
        const isValid = await bcrypt.compare(password, user.password as string);
        if (!isValid) return done(null, false, { message: "Incorrect password." });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
  })
)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
               const photo = profile.photos?.[0]?.value;
const name = profile.displayName;

        if (!email) {
          return done(null, false);
        }

        let user = await prisma.user.findUnique({
          where: { email }
        });
const userWithProviders = user
  ? await prisma.user.findUnique({
      where: { userId: user.userId },
      include: { authProvider: true },
    })
  : null;
        if (!user) {
          user =await prisma.$transaction(async(tnx)=>{
            const createUser=await tnx.user.create({
              data:{
                name:name,
                email:email,
                isVerified:true,
                profilePhoto:photo
            }})
            await tnx.role.create({
              data:{
                userId:createUser.userId,
                name:UserRole.USER
              }
            })
            await tnx.authProvider.create({
                data:{
            provider:AuthProviderType.GOOGLE,
                  userId:createUser.userId
                }
               })
           
        
            return createUser
          })
        }
      const isGoogleExists=userWithProviders?.authProvider.some(auth=>auth.provider===AuthProviderType.GOOGLE)
      if(!isGoogleExists){
        await prisma.authProvider.create({
          data:{
            userId:user.userId,
            provider:AuthProviderType.GOOGLE,
}
        })
      }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);



export default passport;
