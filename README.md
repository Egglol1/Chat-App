# Project Description

This is an application meant to provide users with a chat interface and allow them to share images and locations.
Built with React Native, this is a cross platform app for Android and iOS with one codebase.

## Key Features

- **Personalized UI** - Choose your background image and color for a custom experience

- **Real-time Chat** - Exchange messages in an instant

- **Image Sharing** - Send photos from your camera or library

- **Location Sharing** - Let others know where you are with a tap

- **Offline Access** - Read through conversations even when there's no internet

- **Accessiblity** - Fully compatible with screen readers

## Technologies Used

- **Frontend**
  - React Native - Core framework
  - Expo - Development platform
  - React Navigation - Navigation between screens
  - Expo Image Picker - Camera and image library access
  - Expo Location - Location services
  - React Native Maps - Map display for location sharing
- **Backend & Storage**
  - Google Firestore Database - Real-time message storage
  - Google Firebase Authentication - Anonymous user authentication
  - Firebase Cloud Storage - Storage for images
  - AsyncStorage - Offline data persistence

# Setup

Before starting, ensure you have these installed,

- Node.js (https://nodejs.org)
- npm (Node Package Manager, comes with installation of Node.js)
- Expo CLI (Optional, but recommended)

## Installation

1. Clone this repository

```bash
git clone <this-repo-name>
```

2. Navigate to project repository

```bash
cd chat-local
```

3. Install Dependencies

```bash
npm install
```

4. Start the app

```bash
npm start
```

4. Alt: through expo, you can use

```bash
npx expo start
```

## Firebase Setup

To use Firebase with this app, you'll need to set up a Firebase project and replace the Firebase configuration in the App.js file.

Go to the Firebase Console.
Create a new Firebase project. (Ensure that the read and write rules are set to `true`)
Add Firebase Authentication, Firestore, and Firebase Storage to your project.
Copy the Firebase configuration and paste it into the firebaseConfig object in App.js.

## Usage

Once the app is running, you'll be able to:

Sign up and log in anonymously to the app using Firebase Authentication.
Send messages, images, and locations in real-time.
View a list of past messages.
See other users' locations on a map when they share it.

## Development Process

This application was developed as part of the Full-Stack Web Development Program at Career Foundry. The app was created through a series of exercises that gradually added functionality to meet the project requirements.
