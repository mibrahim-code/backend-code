import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Upload Result:", uploadResult);

    // Clean up local file after successful upload
    fs.unlinkSync(localFilePath);

    // Generate optimized and cropped URLs based on the actual public_id
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    });

    const autoCropUrl = cloudinary.url(uploadResult.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    console.log("Optimized URL:", optimizeUrl);
    console.log("Auto-Cropped URL:", autoCropUrl);

    return uploadResult;
  } catch (error) {
    console.error("Upload Error:", error);
    fs.existsSync(localFilePath) && fs.unlinkSync(localFilePath);
    return null;
  }
};
