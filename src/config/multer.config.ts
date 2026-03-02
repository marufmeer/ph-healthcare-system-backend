
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { cloudinaryUpload } from './cloudinary.config';

 
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) =>{
  const originalName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")            // replace spaces with dash
        .replace(/\.[^/.]+$/, "")        // remove last extension only
        .replace(/[^a-z0-9\-]/g, "");   // remove invalid chars

      const extension = file.originalname.split(".").pop(); // get the extension
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        originalName +
        "." +
        extension;

      return uniqueFileName;
    } 

  },
});
 
export const upload= multer({ storage: storage });