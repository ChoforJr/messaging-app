# Messaging App

A messaging application that enables users to connect, chat with individual contacts, and participate in group conversations.

## 🎯 Features

- **User Authentication** - Secure sign-up and login
- **Direct Messaging** - One-on-one conversations with contacts
- **Group Chats** - Create and participate in group conversations
- **Contact Management** - Add and manage your contacts
- **People Discovery** - Explore and find other users
- **Group Discovery** - Browse available groups to join
- **User Profiles** - View and edit your account information

## 🛠️ Tech Stack

- **Frontend Framework** - React 19
- **Build Tool** - Vite 7
- **Routing** - React Router DOM 7
- **Styling** - CSS Modules
- **UI Icons** - Lucide React
- **Testing** - Vitest with React Testing Library
- **Linting** - ESLint
- **Deployment** - Vercel

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- API server running (see below)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd messaging-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Replace with your actual API server URL.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📚 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests with Vitest
- `npm run lint` - Lint code with ESLint

## 📁 Project Structure

```
src/
├── App Components/       # Main app layout and logic
├── HomePage Components/  # Home page view
├── Chats Components/     # People and group chat views
├── Explore Components/   # Discovery pages for people and groups
├── Account Components/   # User profile and settings
├── ItemContext.jsx       # Global context for state management
├── routes.jsx           # Route definitions
├── main.jsx             # App entry point
└── ErrorPage.jsx        # Error handling component
```

## 🔗 Backend API

This application requires the [Messaging App API](https://github.com/ChoforJr/messaging-app-api) to function. Refer to the API repository for setup and documentation.

## 🚢 Deployment

This project is configured for deployment on **Vercel**:

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

## 👨‍💻 Author

**FORSAKANG CHOFOR JUNIOR**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)
