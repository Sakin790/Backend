# Backend with Hitesh sir
## Algorithm of registering a user 
1. Collect Fullname , username, avatar, email , password from  user.body 
2. Check empty validation 
3. Throw an error if user already exist
4. Multer and Cloudinary Configuration
5. Create a user
6. if user created then remove the password and refressh Token from Database
7. Sent a json response 
