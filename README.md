# ShareTalk

# ShareTalk

Real-time chat application that allows users to communicate through chat rooms.

## Features

- User registration and login
- JWT authentication
- Password encryption with bcrypt
- Real-time messaging using Socket.IO
- Multiple chat rooms
- Delete personal messages
- Clear chat rooms
- Delete account
- Docker support

## Technologies

### Frontend
- React
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express
- Socket.IO
- JWT
- bcrypt

### Database
- MongoDB Atlas
- Mongoose

## Project Structure

ShareTalk
│
├── client
│ └── React frontend
│
├── server
│ └── Express backend
│
└── docker-compose.yml
└──.env


## Installation

### Requirements

- Docker Desktop installed

### Environment Variables

Create a `.env` file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key


## Running the project

Run:
docker compose up --build

Frontend:
http://localhost:3000


Backend:
http://localhost:5000


## Authentication

Users authenticate using JWT tokens.
Passwords are encrypted using bcrypt before being stored.

## Real-time Communication

Socket.IO is used for instant message delivery between connected users.
