
import nodemailer from "nodemailer"
import { envVars } from "../config"
import path from "path";
import ejs from "ejs"
import { AppError } from "../app/errors/appError";
import httpStatus from "http-status-codes"

const transporter = nodemailer.createTransport({
    // port: envVars.EMAIL_SENDER.SMTP_PORT,
    secure: true,
    auth: {
        user: envVars.SMTP.USER,
        pass: envVars.SMTP.PASS
    },
    port: envVars.SMTP.PORT,
    host: envVars.SMTP.HOST
})
interface SendEmailOptions {
    to: string,
    subject: string;
    templateName: string;
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail=async({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: SendEmailOptions)=>{
    try{
 const templatePath=path.join(__dirname,`templates/${templateName}.ejs`)   
    const html=await ejs.renderFile(templatePath,templateData)
    const info=await transporter.sendMail({
      from:envVars.SMTP.FROM,
      to:to,
      subject:subject,
      html:html,
       attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
    })
       console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    }
  catch(error:any){
         console.log("email sending error", error.message);
        throw new AppError(httpStatus.BAD_REQUEST, "Email error")
  }
}