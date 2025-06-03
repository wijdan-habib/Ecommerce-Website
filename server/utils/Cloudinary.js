import { v2 as cloudinary } from "cloudinary";
import fs  from "fs";

const cloudinaryFileUploader = async (localFilePath) => {
  try {
    cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploaded successfully
     fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary files
    return null;
  }
};

export { cloudinaryFileUploader };
