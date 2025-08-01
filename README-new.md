# Interactive Learning Platform

A beautiful, Duolingo-inspired quiz game built with React and Firebase. Features a blue theme and is designed to be embedded as an iframe in other websites.

## Features

- 🧠 Interactive quiz system with multiple choice questions
- 🎨 Beautiful blue-themed UI inspired by Duolingo
- 📊 Progress tracking and score management
- ❤️ Heart-based lives system
- 🔥 Firebase integration for real-time data
- 📱 Responsive design for all devices
- 🔗 URL-based user identification (perfect for embedding)
- 👤 User authentication and admin panel access
- ⚙️ Content management system for admins

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Get your Firebase configuration from Project Settings
4. Replace the placeholder config in `src/firebase.js` with your actual Firebase config

### 2. Firebase Data Structure

Set up your Firestore database with the following structure:

```
/lessons (collection)
├── lesson1 (document)
├── lesson2 (document)
└── lesson3 (document)

/users/{userUID} (documents)
├── name (string)
├── admin (boolean)
├── progress (map)
├── totalScore (number)
├── lessonsCompleted (number)
└── createdAt (timestamp)
```

See `FIREBASE_STRUCTURE.md` for detailed examples and sample data.

### 3. Installation

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Usage

### Admin Mode (Content Management)

Users with `admin: true` in their user document will see a mode selection screen when they access the app. They can choose between:

- **Start Learning**: Regular quiz mode
- **Admin Panel**: Content management interface to add/edit lessons

### Regular Users

Access the app at: `http://localhost:5173/?uid=USER_ID_HERE`

### Embedded in iframe

```html
<iframe
  src="http://your-domain.com/?uid=USER_ID_HERE"
  width="100%"
  height="600px"
  frameborder="0"
>
</iframe>
```

### User Document Structure

Each user document in `/users/{userUID}` should have:

```json
{
  "name": "User Name",
  "admin": false,
  "progress": {
    "lesson1": 85,
    "lesson2": 60
  },
  "totalScore": 145,
  "lessonsCompleted": 2,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

Set `admin: true` for users who should have access to the content management panel.

## Firebase Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to lessons for authenticated users
    match /lessons/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }

    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Project Structure

```
src/
├── components/
│   ├── Quiz.jsx           # Main quiz component
│   ├── LessonCard.jsx     # Individual lesson cards
│   ├── QuizComplete.jsx   # Quiz completion screen
│   └── DebugPage.jsx      # Admin panel for content management
├── firebase.js            # Firebase configuration
├── utils.js              # Utility functions
├── App.jsx               # Main app component
├── App.css               # Styles with blue theme
└── main.jsx              # App entry point
```

## Customization

### Theme Colors

Edit the CSS variables in `src/App.css`:

```css
:root {
  --primary-blue: #1976d2;
  --light-blue: #42a5f5;
  --dark-blue: #0d47a1;
  /* ... more colors */
}
```

### Adding New Lessons

Admins can add new lessons through the admin panel, or add new lesson documents to `/lessons` in Firebase with the structure shown in `FIREBASE_STRUCTURE.md`.

## Security Features

- **User Validation**: Only existing users in the Firebase `/users` collection can access the app
- **Admin Access Control**: Admin panel is only accessible to users with `admin: true`
- **UID-based Access**: Each user can only access their own progress data
- **Iframe-Safe**: Designed to work securely when embedded in other websites

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Firebase Firestore
- **Styling**: CSS with CSS Variables
- **Icons**: Unicode Emojis

## License

MIT License
