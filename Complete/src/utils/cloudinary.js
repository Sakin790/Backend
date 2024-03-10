import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: "dgrb2e2rh", 
  api_key: "514711175527823", 
  api_secret: "2orhRNjGzAQwUaBumwsFi6aNHL4" 
});

const deletefile = async(public_id)=>{
    await cloudinary.api.delete_resources(public_id, 
    { type: 'upload', resource_type: 'auto' })
  
}

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}