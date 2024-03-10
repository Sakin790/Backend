# Youtube Backend In Nodejs 

ASSIGNMENT DONE FULLY WORKING  WITH ALL POSSIBLE EDGE CASES !!!!

We are building a complete video hosting website similar to youtube with all the features like login, signup, upload video, like, dislike, comment, reply, subscribe, unsubscribe, and many more.

# Summary of this project

This project is a complex backend project that is built with nodejs, expressjs, mongodb, mongoose, jwt, bcrypt, and many more. This project is a complete backend project that has all the features that a backend project should have.
Project uses all standard practices like JWT, bcrypt, access tokens, refresh Tokens and many more. We have spent a lot of time in building this project and we are sure that you will learn a lot from this project.

--- 
# Getting Started
Prerequisite
---
- [Node](https://nodejs.org/en/download/current)
- [NodeMon](https://www.npmjs.com/package/nodemon)
```
$npm install -g nodemon

# or using yarn:
$yarn global add nodemon
```
- dotenv
```
$npm i dotenv
```
Run Locally
---
- check npm
```
$npm -v
```
- check nodemon
```
$nodemon -v
```
- install all the node_modules
```
$npm install
```
- create a .env file 
```
chai-backend/
│
├──node_modules/
├── public/
│   ├── temp/
│        └── .gitkeep
│
├── src/
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   └── ...
│   ├── db/
|   |   └──index.js
|   |
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── playlist.routes.js
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── ApiError.js
│   │   └── ...
│   │
│   ├── app.js
│   ├── constant.js
│   └── index.js
├── .env      #add .env files to add environment variables 
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package.json
├── package-lock.json
└── README.md
