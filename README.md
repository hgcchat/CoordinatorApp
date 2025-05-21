# Coordinator App

A web application for annotating and coordinating markers on blueprints/floor plans.

## Features

- Load and display blueprint images
- Add markers with voice or text labels
- Edit and move markers
- Save markers per blueprint
- Auto-save functionality

## Project Structure

```
/CoordinatorApp
├── backend/
│   ├── routes/       - API route definitions
│   ├── controllers/  - Business logic
│   ├── models/       - Data models
│   └── server.js     - Express server setup
├── frontend/
│   ├── src/          - React source code
│   ├── public/       - Static assets
│   └── App.jsx       - Main React component
```

## Getting Started

### Prerequisites

- Node.js >= 14
- npm >= 6

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## License

This project is licensed under the ISC License.
