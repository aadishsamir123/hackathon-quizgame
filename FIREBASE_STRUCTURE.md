# Firebase Data Structure

This document explains the expected Firebase Firestore structure for the quiz game.

## Collections Structure

# Firebase Data Structure

This document explains the expected Firebase Firestore structure for the quiz game.

## Collections Structure

### `/lessons` (Collection)

Each document in this collection represents a lesson. Example document:

```json
{
  "id": "lesson1",
  "title": "JavaScript Basics",
  "description": "Learn the fundamentals of JavaScript programming",
  "category": "Programming",
  "difficulty": "Beginner",
  "questions": [
    {
      "question": "What is the correct way to declare a variable in JavaScript?",
      "answers": [
        "var myVar = 5;",
        "variable myVar = 5;",
        "v myVar = 5;",
        "declare myVar = 5;"
      ],
      "correctAnswer": 0
    },
    {
      "question": "Which of the following is NOT a JavaScript data type?",
      "answers": ["string", "boolean", "integer", "undefined"],
      "correctAnswer": 2
    }
  ]
}
```

### `/users/{userUID}` (Document)

Each user document stores progress, stats, and permissions:

```json
{
  "name": "John Doe",
  "admin": false,
  "progress": {
    "lesson1": 85,
    "lesson2": 60,
    "lesson3": 100
  },
  "totalScore": 245,
  "lessonsCompleted": 3,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Important fields:**

- `name`: User's display name (shown in the header)
- `admin`: Boolean flag - set to `true` for users who should have access to the admin panel
- `progress`: Map of lesson IDs to completion percentages
- Users without valid documents are blocked from accessing the app

## Sample Data for Testing

You can add these sample lessons to your Firebase:

### Lesson 1: JavaScript Basics

```json
{
  "title": "JavaScript Basics",
  "description": "Master the fundamentals of JavaScript programming",
  "category": "Programming",
  "difficulty": "Beginner",
  "questions": [
    {
      "question": "What is the correct way to declare a variable in JavaScript?",
      "answers": [
        "var myVar = 5;",
        "variable myVar = 5;",
        "v myVar = 5;",
        "declare myVar = 5;"
      ],
      "correctAnswer": 0
    },
    {
      "question": "Which method is used to add an element to the end of an array?",
      "answers": ["append()", "push()", "add()", "insert()"],
      "correctAnswer": 1
    },
    {
      "question": "What does 'DOM' stand for?",
      "answers": [
        "Document Object Model",
        "Data Object Management",
        "Dynamic Object Method",
        "Document Oriented Model"
      ],
      "correctAnswer": 0
    }
  ]
}
```

### Lesson 2: HTML & CSS

```json
{
  "title": "HTML & CSS Fundamentals",
  "description": "Learn the building blocks of web development",
  "category": "Web Development",
  "difficulty": "Beginner",
  "questions": [
    {
      "question": "Which HTML tag is used for the largest heading?",
      "answers": ["<h6>", "<h1>", "<head>", "<header>"],
      "correctAnswer": 1
    },
    {
      "question": "Which CSS property is used to change text color?",
      "answers": ["font-color", "text-color", "color", "foreground-color"],
      "correctAnswer": 2
    },
    {
      "question": "What does CSS stand for?",
      "answers": [
        "Computer Style Sheets",
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      "correctAnswer": 2
    }
  ]
}
```

### Lesson 3: React Basics

```json
{
  "title": "React Fundamentals",
  "description": "Introduction to React.js library",
  "category": "Frontend Frameworks",
  "difficulty": "Intermediate",
  "questions": [
    {
      "question": "What is JSX?",
      "answers": [
        "A JavaScript library",
        "A syntax extension for JavaScript",
        "A database query language",
        "A CSS framework"
      ],
      "correctAnswer": 1
    },
    {
      "question": "Which hook is used to manage state in functional components?",
      "answers": ["useEffect", "useContext", "useState", "useReducer"],
      "correctAnswer": 2
    },
    {
      "question": "What is a React component?",
      "answers": [
        "A CSS class",
        "A JavaScript function or class that returns JSX",
        "An HTML element",
        "A database table"
      ],
      "correctAnswer": 1
    }
  ]
}
```

## URL Structure

Access the app with: `http://localhost:5173/?uid=USER_ID_HERE`

Replace `USER_ID_HERE` with the actual user's UID from your authentication system.
