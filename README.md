# Node.js Express Blog App

![Node.js Version](https://img.shields.io/badge/node-v16.20.1-green.svg) ![ExpressVersion](https://img.shields.io/badge/express-v4.18.2-blue.svg) ![PostgreSQLVersion](https://img.shields.io/badge/postgresql-v15.3-orange.svg)

This repository hosts a blog application built using Node.js and Express. The application comes with an advanced rich text editor, powered by CKEditor, to create compelling content. For ensuring robust password security, it employs hashing techniques. The authentication and authorization aspects are handled seamlessly using Passport.js. Furthermore, the application utilizes PostgreSQL as its backend database.

## Features

- **Rich Text Editor (CKEditor):** The application incorporates CKEditor to provide users with a powerful and user-friendly rich text editing experience when creating their blog posts.
- **Password Hashing:** User passwords are securely hashed, enhancing the overall security of the application and safeguarding user information.
- **Authentication and Authorization (Passport.js):** Passport.js is employed to manage user authentication and authorization, ensuring that only authorized users can access certain features and actions within the app.
- **PostgreSQL Database:** The application uses PostgreSQL as its database system to efficiently store and manage various data related to the blogs, user information, categories, and more.

## Installation Guide

To get the application up and running on your local machine, follow these steps:

1. Clone the repository to your local machine:
   `git git clone https://github.com/anevski-stefan/<repository-name>.git `

2. Navigate to the project directory:
   `bash cd <repository-name> `

3. Install the required dependencies:
   `bash npm install `

4. Configure the Database:
   - In the database folder, navigate to **createTables.js**. Replace **<db-user>** and **<db-password>** with your PostgreSQL database **user** and **password**.
   - Run the script to create the necessary database tables:
     `bash node createTables.js`
5. Run the Application:
   `bash npm start`
6. Open your web browser and access the application at **http://localhost:9000**

## Dashboard (Work in Progress)

The repository also includes an ongoing development of a user dashboard. This dashboard will enable users to view and update their personal information.
