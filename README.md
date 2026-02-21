# Social.ly

Social.ly is a chat app, where users can search for and chat with other users registered on the app

## Features

- OAuth for authentication (Google, GitHub, local signup)
- Real time message sending and receiving
- Indication of time stamps of each message
- Profile pictures
- Mobile responsive
- Dark and light themes

[Live demo](https://chat-app-1-5mmu.onrender.com/)

## Installation
Clone the repo:

`git clone https://github.com/abbas-13/chat-app-1`

Navigate to the directory and install dependencies:

`npm i`

Install dependencies of the client side:

`cd client`
</br>
`npm i`

Run the app from the root folder:

`npm run dev`

Setup environment variables:

.env.development

`MONGO_URI="mongodb+srv://..."`
</br>
`NODE_ENV=development`
</br>
... google, github, cloudinary api keys and secrets, cookie key

Open your web browser and go to (http://localhost:3000) to view the app.

## Usage

- Login using Google, GitHub, or sign up using any email address
- Search for a user using email or name in the search bar
- Select a user and start sending messages
- Change theme from the bottom left (in case of large screens and in the bottom in the conversations page in case of mobile screens) menu option
- From the menu option, you can also edit your profile (display picture, display name, status), and logout
- View the recipients profile from the info icon on the right of the navbar

## Tech used:

- Client side powered by Vite
- Created with React.js + TypeScript
- ShadCN for components
- TailwindCSS for styling
- React Router for routing
- Luicide React for icons
- Node.js - Express.js for APIs
- Socket for real time connection
- Passport.js for OAuth
- Cloudinary for picture storage and API
- Express session for cookie management
- MongoDB for data storage and mongoose
