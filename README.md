# profileBook

---

## Project Functionality

**Searching**

Someone who accesses this website will first see the entry page. On this page they may search a profile which has already been created. Profiles can be searched by first name, second name or first and second name. Searches must be an exact match.
Alternatively, a user can select Return All Profiles which will return every profile from the database.
If you click on View Profile, as you are not logged in, you will not be able to view the Profile.

**Creating A Profile**

Click on Green Sign-Up Button and it will bring you to the creating profile page. Once you fill in profile details and matching passwords and click create password it will redirect you to the Login Page.

**Viewing Profile**

Once logged in you can view your profile and others profiles. If the profile you are viewing, you will have the chance to Edit the Profile details as well as Creating a Blog Post.
If the profile is not yours then you will not have the option.

**Blogs**

Each profile owner can create whatever number of blogs that they wish to. When clicking the Create button of the Blog section this will bring up a page where they can Enter a blog title and main body of the blog. There is a selection where you have the option to make it public ie. viewable by other users.

This blog post can be edited if you are the owner or you can click to view the blog individually.

---

## Basic SetUp

### Basic Requirements

This Project Requires

- npm installed : [npm install docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Node installed : [node install docs](https://nodejs.org/en/download/)
- MongoDB and MongoDB Shell installed : [mongodb install docs](https://www.mongodb.com/docs/manual/installation/)
- Install Nodemon Globally : npm install -g nodemon
- -g will install nodemon globally and may require sudo access

### Getting Started

- Using CLI go to root directory and change directory to backend - enter: npm install
- Change Directory to front-end - enter: npm install
- Inside the FrontEnd Directory enter : npm start
- Open another CLI window and cd to root project and into the Backend directory
- Inside this directory enter : nodemon server.js

---

## Technologies Used

The Front End is made with React, with React-Router-Dom managing the navigation and routering of the front end app.

The backend uses Node. Express handles endpoints.
All data is sent to MongoDB using a light-weight model based system named Mongoose. For uploading files to local environment, fileUploader is used.

To connect front end to back-end, axios is used. All requests to the server from the front end are protected by and authenticated by Passport.js.
All requests are first authenticated through Passport.js. Express-Sessions allow for a user to remain logged in for as long as the session lasts.
