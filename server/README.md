# My Events - Events Application Backend

![NodeJS](https://img.shields.io/badge/NodeJS-green)
![express](https://img.shields.io/badge/express-lightblue)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)

## Repository Description

This repository contains the server for the event application contributed by Andrei, Viktoriia and Binh. It will offer core functionality concepts for a typical Event Application.

## Table of Contents

- [Getting Started](#getting-started)
- [Libraries](#libraries)
- [Third party API](#third-party-api)
- [Database Schema and ERD](#database-schema-and-erd)
- [Folder structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Containerization](#containerization)

## Getting Started

This section provides instructions on how to set up your environment and get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

**Node**: `version ^18`
**TypeScript**: `version ^5`

1. Open your terminal and clone the back-end repository with the following command:

```
git clone https://github.com/AndreiSorokin/myEvents.git
```

2. Navigate to the root folder of back-end directory.

```
  cd MyEvents
```

3. Set up your local environment by creating a file `.env` with these values, replace them with your own API info:

```
PORT=3003
MONGO_DB_URL=[YOUR_DB_CONNECTION_STRING]
JWT_SECRET=D0hf7Dv1XOOk2I9ElcG6ItellMzeNAQN
JWT_EXPIRATION=1h
CLOUDINARY_CLOUD_NAME=[YOUR_CLOUDINARY_NAME]
CLOUDINARY_API_KEY=[YOUR_CLOUDINARY_API_KEY]
CLOUDINARY_API_SECRET=[YOUR_CLOUDINARY_API_SECRET]
```

4. Install the necessary dependencies:

```
npm install
```

5. To start the project locally:

```
npm start
```

6. To start the project in development mode

```
npm run dev
```

## Libraries

| Library          | Purpose                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| **bcrypt**       | Library for hashing and comparing passwords securely.                                                      |
| **cloudinary**   | A service to manage images and videos in the cloud, used for uploading and manipulating media files.       |
| **cors**         | Enables Cross-Origin Resource Sharing (CORS) for handling requests from different origins.                 |
| **dotenv**       | Loads environment variables from a `.env` file into `process.env`.                                         |
| **express**      | Fast, unopinionated web framework for building RESTful APIs in Node.js.                                    |
| **jsonwebtoken** | Used to create and verify JSON Web Tokens (JWT) for authentication purposes.                               |
| **mongoose**     | ODM (Object Data Modeling) library for MongoDB and Node.js, helps in managing MongoDB schemas and queries. |
| **multer**       | Middleware for handling `multipart/form-data`, used primarily for file uploads.                            |
| **nodemailer**   | Library for sending emails from Node.js applications.                                                      |
| **nodemon**      | Tool that automatically restarts the Node.js application when file changes in the directory are detected.  |
| **passport**     | Authentication middleware for Node.js, supports various authentication methods (local, OAuth, etc.).       |
| **uuid**         | Generates universally unique identifiers (UUIDs).                                                          |
| **Sinon**        | For stubbing and mocking (test)                                                                            |
| **Jest**         | JavaScript Testing Framework                                                                               |
| **Supertest**    | Testing HTTP endpoints                                                                                     |
| **axios**        | Library for integrating with third party APIs                                                              |
|                  |                                                                                                            |

## Third party API

| API      | Purpose                                                                      | Info                                  |
| -------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| OpenCage | Converts geographic coordinates into human-readable addresses and vice versa | [OpenCage](https://opencagedata.com/) |
|          |                                                                              |                                       |

## Database Schema and ERD

![erd](erd/ERD.png)
_Entity–relationship model Diagram_

## Folder Structure

This project is organized into various folders and files for better modularity and maintainability. Below is an explanation of each directory and its purpose:

```
├── .github/               # GitHub configuration and workflows
├── erd/                   # Entity Relationship Diagrams (ERDs) for database modeling
├── https/                 # Contains .rest file for manual API testing
├── src/                   # Source code for the application
│   ├── __tests__          # Unit and integration tests
│   ├── config/            # For custom configuration
│   ├── controllers/       # For request handling and response logic.
│   ├── enums/             # For custom database schema enum units.
│   ├── errors/            # For custom error handling.
│   ├── interfaces/        # For object's interfaces.
│   ├── middleware/        # For custom middleware configuration.
│   ├── models/            # For Mongoose models or database schema definitions
│   ├── routes/            # Express route definitions for various endpoints
│   ├── services/          # Business logic and service layer for the app
│   ├── app.ts             # Main application configuration and Express setup
│   └── server.ts          # Entry point of the application (starting the server)
├── .env                   # Environment variables
├── .gitignore             # For excluding specific files/folders from Git
├── package.json           # Contains project metadata and dependency information
├── README.md              # Project documentation (this file)
├── tsconfig.json          # TypeScript configuration file
```

## API Endpoints

### 1. Allow Annonymous

- Sign In
- Sign Up
- Get All Events

### 2. Allow Admin (Included actions that organizer and user can access)

- Delete User

### 3. Allow Organizer (Included actions that user can access)

- Create an address -> `POST http://localhost:3003/api/v1/addresses` (Have not set the auth rule).
- Update the address by id -> `PUT http://localhost:3003/api/v1/addresses/[address_id]` (Have not set the auth rule - Must be the same address's creator).
- Delete the address by id -> `DELETE http://localhost:3003/api/v1/addresses/[address_id]` (Have not set the auth rule - Must be the same address's creator).
- Create a location -> `CREATE http://localhost:3003/api/v1/locations` (Have not set the auth rule).
- Update the location by id -> `PUT http://localhost:3003/api/v1/locations/[location_id]` (Have not set the auth rule - Must be the same location's creator).
- Delete the location by id -> `DELETE http://localhost:3003/v1/locations/[location_id]` (Have not set the auth rule - Must be the same location's creator).

### 4. Allow User

## Containerization

### 1. Navigate to server folder

```
cd .\server\
```

2. Set up your local environment by creating a file `.env` with these values, replace them with your own API info:

```
PORT=3003
MONGO_DB_URL=[YOUR_DB_CONNECTION_STRING]
JWT_SECRET=D0hf7Dv1XOOk2I9ElcG6ItellMzeNAQN
JWT_EXPIRATION=1h
CLOUDINARY_CLOUD_NAME=[YOUR_CLOUDINARY_NAME]
CLOUDINARY_API_KEY=[YOUR_CLOUDINARY_API_KEY]
CLOUDINARY_API_SECRET=[YOUR_CLOUDINARY_API_SECRET]
```

### 2. **Build the Docker Image:** Ensure Docker is installed and running on your machine. Then run the following command to build the image:

```
docker build -t my-events-backend-app .
```

### 3. Run the container:

```
docker run -p 3003:3003 --env-file .env --init my-events-backend-app
```

### 4. **Access the App:** Open your browser and navigate to http://localhost:3003. The backend should be up and running.

### 5. Clean your docker engine

### 6. Publish docker image to Docker Hub:

#### 6.1 - Tag your local Docker image:

```
docker tag my-events-backend-app:latest your-username/my-events-backend-app:1.0.0
```

#### 6.2 - Log in to Docker Hub: (If you don't already have Docker account, please sign yourself up first in Docker Hub platform)

```
docker login
```

#### 6.3. Push the Docker Image to Docker Hub

```
docker push your-username/my-events-backend-app:1.0.0
```

#### 6.4. [Publish URL](https://hub.docker.com/repository/docker/tripplen63/my-events-backend-app/general)
