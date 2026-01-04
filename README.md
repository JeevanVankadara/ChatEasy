# ChatEasy

> A modern, real-time chat application built with the MERN stack and Socket.IO, featuring instant messaging, online user presence, and media sharing capabilities.

---

## Tech Stack

### Frontend
- **React 18** - UI library for building interactive user interfaces
- **Vite** - Next-generation frontend tooling for faster development
- **Zustand** - Lightweight state management solution
- **Socket.IO Client** - Real-time bidirectional event-based communication
- **Axios** - Promise-based HTTP client
- **React Router DOM** - Declarative routing for React applications
- **React Hot Toast** - Beautiful notifications for React
- **@react-oauth/google** - Google OAuth 2.0 authentication for React
- **React Icons** - Icon library including Google icons

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **Socket.IO** - Real-time communication engine
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling tool
- **JWT (jsonwebtoken)** - Secure user authentication
- **bcryptjs** - Password hashing library
- **Cloudinary** - Cloud-based media storage and management
- **google-auth-library** - Official Google authentication library for Node.js

### Styling & UI Components
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **Lucide React** - Beautiful & consistent icon library
- **PostCSS** - CSS transformation tool

### Development Tools
- **Nodemon** - Automatic server restart during development
- **ESLint** - Code linting and quality assurance
- **dotenv** - Environment variable management

---

## Features

| Feature | Description |
|---------|-------------|
| **Google OAuth 2.0** | One-click login/signup with Google account |
| **User Authentication** | Secure signup, login, and logout functionality |
| **Real-time Messaging** | Instant message delivery using Socket.IO |
| **Online User Presence** | See who's currently online in real-time |
| **Media Sharing** | Upload and share images stored on Cloudinary |
| **Profile Management** | Update profile information and avatar |
| **Password Management** | Secure password update functionality |
| **Modern UI** | Beautiful, responsive design with Tailwind CSS and DaisyUI |
| **Production Ready** | Optimized build for deployment |

---

## 🔄 Workflow

### 1️⃣ User Authentication Flow
```
User Registration 
    ↓
Password Hashing (bcryptjs) 
    ↓
Store in MongoDB 
    ↓
Generate JWT Token 
    ↓
Set HTTP Cookie 
    ↓
Connect Socket 
    ↓
Redirect to Chat
```

### 2️⃣ Real-time Messaging Flow
```
User Types Message 
    ↓
Send via Axios POST 
    ↓
Store in MongoDB 
    ↓
Emit Socket Event 
    ↓
Broadcast to Recipient 
    ↓
Update UI Instantly
```

### 3️⃣ Online Status Flow
```
User Login 
    ↓
Socket Connection 
    ↓
Store Socket ID in usersMap 
    ↓
Emit "getOnlineUsers" 
    ↓
Update All Connected Clients 
    ↓
Display Online Status
```

### 4️⃣ Media Upload Flow
```
User Selects Image 
    ↓
Convert to Base64 
    ↓
Send to Backend 
    ↓
Upload to Cloudinary 
    ↓
Get Secure URL 
    ↓
Store in MongoDB 
    ↓
Display in Chat
```
### 5️⃣ Google OAuth Flow
```
User Clicks "Continue with Google"
    ↓
Google OAuth Popup Opens
    ↓
User Selects Google Account
    ↓
Google Returns Credential Token
    ↓
Frontend Sends Token to Backend
    ↓
Backend Verifies Token with Google
    ↓
Extract User Info (email, name, picture)
    ↓
Check if User Exists in Database
    ↓
Create/Update User Record
    ↓
Generate JWT Token
    ↓
Set HTTP Cookie
    ↓
Connect Socket
    ↓
Redirect to Chat
```

---

## 🔐 Google OAuth 2.0 Authentication

ChatEasy implements secure Google OAuth 2.0 authentication, allowing users to sign up and log in instantly with their Google accounts.

### Why Google OAuth?

| Benefit | Description |
|---------|-------------|
| **Enhanced Security** | No password storage for Google users |
| **Seamless UX** | One-click authentication without forms |
| **Trusted Authentication** | Leverages Google's secure infrastructure |
| **Auto Profile Data** | Gets user name and profile picture automatically |
| **Email Verification** | Google accounts are pre-verified |

---

### Backend Implementation

#### 1️⃣ Google Auth Library Setup
> Location: `backend/src/lib/googleAuth.js`

```javascript
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  try {
    // Verify the token with Google's servers
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    // Extract user payload from verified token
    return ticket.getPayload();
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw error;
  }
}
```

**What this does:**
- Creates OAuth2Client with Google Client ID
- Verifies the JWT token received from frontend
- Ensures token is legitimate and not tampered with
- Returns user information (email, name, picture, etc.)

---

#### 2️⃣ Google Login Controller
> Location: `backend/src/controllers/auth.controller.js`

```javascript
const googleLogin = async (req, res) => {
  try {
    const {token} = req.body;
    
    // Validate token presence
    if(!token){
      return res.status(400).json({message: "Token is required"});
    }
    
    // Verify token with Google
    const payload = await verifyGoogleToken(token);
    
    // Ensure email is verified
    if(!payload.email_verified){
      return res.status(400).json({message: "Email not verified"});
    }
    
    // Check if user exists with Google ID
    let user = await User.findOne({googleId: payload.sub});
    
    if(!user){
      // Check if user exists with same email (for account linking)
      user = await User.findOne({email: payload.email});
      
      if(user){
        // Link existing account with Google
        user.googleId = payload.sub;
        user.authProvider = "google";
        await user.save();
      } else {
        // Create new user from Google profile
        user = await User.create({
          fullName: payload.name || payload.given_name,
          email: payload.email,
          googleId: payload.sub,
          authProvider: "google",
          profilePic: payload.picture || ""
        });
      }
    }
    
    // Generate JWT and set cookie
    generateToken(user._id, res);
    
    // Return user data
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });
    
  } catch(error){
    console.log("Error in Google Login: " + error);
    res.status(500).json({message: "Internal Server Error"});
  }
}
```

**Key Features:**
- ✅ Token verification with Google
- ✅ Email verification check
- ✅ Account linking (existing email + Google)
- ✅ Auto profile picture from Google
- ✅ JWT generation for session management

---

#### 3️⃣ User Model with Google Support
> Location: `backend/src/models/user.model.js`

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,  // Optional for Google users
    minlength: 6
  },
  profilePic: {
    type: String,
    default: ""
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true  // Allows null values while maintaining uniqueness
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  }
}, {timestamps: true});
```

**Schema Features:**
- `password` is optional (not required for Google users)
- `googleId` uniquely identifies Google accounts
- `authProvider` tracks authentication method
- `sparse: true` allows users without Google ID

---

### Frontend Implementation

#### 1️⃣ Google OAuth Provider Setup
> Location: `frontend/src/main.jsx`

```javascript
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
```

**Purpose:**
- Wraps entire app with Google OAuth context
- Provides Google Client ID to all components
- Enables Google authentication across the app

---

#### 2️⃣ Login Page Integration
> Location: `frontend/src/pages/LoginPage.jsx`

```javascript
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const { googleLogin } = useAuthStore();
  
  return (
    <div>
      {/* Hidden Google Login Component */}
      <div style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            googleLogin(credentialResponse.credential);
          }}
          onError={() => {
            toast.error("Google login failed");
          }}
        />
      </div>
      
      {/* Custom Google Login Button */}
      <button
        onClick={() => document.querySelector('[aria-labelledby]').click()}
        className="btn btn-outline w-full"
        title="Continue with Google"
      >
        <FcGoogle className="size-6" />
        Continue with Google
      </button>
    </div>
  );
}
```

**Implementation Strategy:**
- Hidden `<GoogleLogin>` component handles OAuth flow
- Custom styled button triggers the hidden component
- Maintains consistent UI/UX with app design
- Shows loading states and error handling

---

#### 3️⃣ Zustand Google Login Action
> Location: `frontend/src/lib/useAuthStore.js`

```javascript
googleLogin: async (token) => {
  set({isLoggingIn: true});
  try {
    const res = await axiosInstance.post("/auth/googleLogin", {token});
    set({authUser: res.data});
    toast.success("Login Successful");
    get().connectSocket();
  } catch (error) {
    toast.error(error.response?.data?.message || "Google login failed");
  } finally {
    set({isLoggingIn: false});
  }
}
```

**Actions:**
1. Set loading state
2. Send Google token to backend
3. Store authenticated user data
4. Establish Socket.IO connection
5. Handle errors gracefully

---

### Google OAuth Configuration

#### Getting Google Client ID

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Enter project name: "ChatEasy"

3. **Enable Google+ API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - Your production domain
   - Add authorized redirect URIs:
     - `http://localhost:5173` (development)
     - Your production domain


GOOGLE_CLIENT_ID=your_google_client_id
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id

### Security Considerations

| Security Feature | Implementation |
|-----------------|----------------|
| **Token Verification** | Backend verifies token with Google servers |
| **Email Verification** | Only accepts verified Google emails |
| **JWT Tokens** | Session management with HTTP-only cookies |
| **No Password Storage** | Google users don't need passwords |
| **Account Linking** | Prevents duplicate accounts with same email |
| **Error Handling** | Graceful failures without exposing sensitive data |

---

### Google OAuth vs Traditional Auth

| Aspect | Traditional Auth | Google OAuth |
|--------|-----------------|--------------|
| **Signup Time** | ~30 seconds (form filling) | ~2 seconds (one click) |
| **Password** | User creates & remembers | Not needed |
| **Email Verification** | Required | Pre-verified by Google |
| **Profile Picture** | User uploads | Auto from Google |
| **Security** | User's password strength | Google's security |
| **User Experience** | Multiple steps | Single click |


---

## Zustand State Management Implementation

Zustand is implemented for efficient global state management across the application with two main stores:

### Store 1: **useAuthStore**
> Location: `frontend/src/lib/useAuthStore.js`

Manages authentication and socket connection state:

#### Global State Variables
- `authUser` - Current authenticated user data
- `isCheckingauth` - Auth verification loading state
- `isSigningUp` - Signup process loading state
- `isLoggingIn` - Login process loading state
- `isUpdatingProfile` - Profile update loading state
- `isPasswordUpdating` - Password update loading state
- `isPasswordChangeStatus` - Password change success indicator
- `onlineUsers` - Array of currently online user IDs
- `socket` - Socket.IO connection instance

#### Key Actions
```javascript
checkAuth()           // Verify user authentication on app load
signup()              // Register new user and establish socket connection
login()               // Authenticate user and connect to socket
logout()              // Clear user session and disconnect socket
profileUpdating()     // Update user profile information
passwordUpdate()      // Change user password securely
connectSocket()       // Initialize Socket.IO connection with userId
disconnectSocket()    // Cleanup socket connection on logout
```

#### Why Zustand for Auth?
- ✅ Centralized authentication state accessible across all components
- ✅ Persistent socket connection management
- ✅ Automatic UI updates when auth state changes
- ✅ No prop drilling required

---

### Store 2: **useMessagesStore**
> Location: `frontend/src/lib/useMessagesStore.js`

Manages messaging and user interactions:

#### Global State Variables
- `messages` - Array of chat messages for selected conversation
- `users` - List of all available users
- `selectedUser` - Currently active chat user
- `isUsersLoading` - Users list loading state
- `isMessagesLoading` - Messages loading state
- `isMessageSending` - Message send loading state

#### Key Actions
```javascript
setSelectedUser()         // Set active chat conversation
getUsers()                // Fetch all users from backend
getMessages()             // Retrieve message history for selected user
sendMessage()             // Send new message to selected user
subscribeToMessages()     // Listen for incoming messages via Socket.IO
unSubscribeFromMessages() // Remove message listeners
subscribeToNewUsers()     // Listen for new user registrations
unSubscribeFromNewUsers() // Remove new user listeners
```

#### Why Zustand for Messages?
- ✅ Real-time message state synchronization
- ✅ Efficient message updates without re-renders
- ✅ Easy integration with Socket.IO events
- ✅ Minimal boilerplate compared to Redux

---

### Zustand Advantages in This Project
googleLogin` | Login/Signup with Google OAuth |
| `POST` | `/api/auth/
| Advantage | Benefit |
|-----------|---------|
| **Simple API** | No providers, reducers, or actions boilerplate |
| **Performance** | Component-level subscriptions prevent unnecessary re-renders |
| **DevTools** | Built-in support for debugging state changes |
| **TypeScript Ready** | Easy to add type safety |
| **Small Bundle Size** | Only ~1KB vs Redux's larger footprint |

---

## Socket.IO Real-time Implementation

Socket.IO powers all real-time features in ChatEasy with a bidirectional event-based communication system.

### Backend Socket Setup

#### 1️⃣ Server Initialization
> Location: `backend/src/lib/socket.js`

```javascript
// Create Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: Development ? "http://localhost:5173" : true,
    credentials: true
  }
});

// usersMap stores userId → socketId mapping for routing messages
export const usersMap = {};

// Helper function to get socket ID for message delivery
export function getSocketId(receiverId) {
  return usersMap[receiverId];
}
```

#### 2️⃣ Connection Management
> Location: `backend/src/app.js`

```javascript
io.on("connection", (socket) => {
  // Extract userId from handshake query
  const userId = socket.handshake.query.userId;
  
  // Store user's socket ID for real-time message routing
  if(userId && userId !== "undefined") {
    usersMap[userId] = socket.id;
    
    // Broadcast updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(usersMap));
  }
  
  // Handle disconnection
  socket.on("disconnect", () => {
    delete usersMap[userId];
    io.emit("getOnlineUsers", Object.keys(usersMap));
  });
});
```

#### 3️⃣ Message Broadcasting
> Location: `backend/src/controllers/message.controller.js`

```javascript
// When user sends a message
const receiverSocketId = getSocketId(receiverId);

if(receiverSocketId) {
  // Emit message only to the specific recipient
  io.to(receiverSocketId).emit("newMessage", newMessage);
}
```

---

### Frontend Socket Setup

#### 1️⃣ Socket Connection
> Location: `frontend/src/lib/useAuthStore.js`

```javascript
connectSocket: () => {
  const {authUser} = get();
  
  // Prevent duplicate connections
  if(!authUser || get().socket?.connected) return;
  
  // Initialize socket with userId for backend identification
  const socket = io(BASE_URL, {
    query: {
      userId: authUser._id
    }
  });
  
  set({socket: socket});
  
  // Listen for online users updates
  socket.on("getOnlineUsers", (userIds) => {
    set({onlineUsers: userIds});
  });
  
  // Handle connection errors
  socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error);
  });
}
```

#### 2️⃣ Message Subscription
> Location: `frontend/src/lib/useMessagesStore.js`

```javascript
subscribeToMessages: () => {
  const {selectedUser} = get();
  const socket = useAuthStore.getState().socket;
  
  if(!selectedUser || !socket) return;
  
  // Listen for incoming messages
  socket.on("newMessage", (newMessage) => {
    // Only add message if it's from the current chat
    if(newMessage.senderId === selectedUser._id) {
      const {messages} = get();
      set({messages: [...messages, newMessage]});
    }
  });
}

// Cleanup listener when component unmounts or user changes
unSubscribeFromMessages: () => {
  const socket = useAuthStore.getState().socket;
  socket?.off("newMessage");
}
```

---

### Socket.IO Event Flow

#### User Comes Online
```
User Login 
    → Frontend connects socket with userId 
    → Backend stores in usersMap 
    → io.emit("getOnlineUsers") 
    → All clients update online status UI
```

#### Sending Messages
```
User sends message 
    → POST to /api/message/send/:id 
    → Message saved to MongoDB 
    → getSocketId(receiverId) 
    → io.to(socketId).emit("newMessage", message) 
    → Recipient's UI updates instantly
```

#### User Goes Offline
```
Browser closes/User logs out 
    → socket.disconnect() 
    → Backend detects disconnect event 
    → Remove from usersMap 
    → io.emit("getOnlineUsers") 
    → All clients update UI
```

---

### Key Socket.IO Features Used

| Feature | Purpose |
|---------|---------|
| **Query Parameters** | Pass userId during connection handshake |
| **Rooms** | Target specific users with `io.to(socketId).emit()` |
| **Broadcast** | Update all clients with `io.emit()` |
| **Event Listeners** | Handle custom events like "newMessage", "getOnlineUsers" |
| **Connection Lifecycle** | Manage connect/disconnect events |
| **CORS Configuration** | Secure cross-origin WebSocket connections |

### 💡 Why Socket.IO?

- **Reliability** - Automatic reconnection and fallback transports
- **Bi-directional** - Server can push updates to clients instantly
- **Room Support** - Easily implement private chat rooms
- **Browser Compatibility** - Works across all modern browsers
- **Scalability** - Can be scaled with Redis adapter for multiple servers

---

## ☁️ Cloudinary Media Storage

All user-uploaded media (profile pictures, chat images) are stored securely on **Cloudinary**, a cloud-based media management platform.

### Image Upload Flow

```
1. User selects image from device
2. Frontend converts image to Base64 format
3. Sent to backend via Axios POST request
4. Backend uploads to Cloudinary using SDK
5. Cloudinary returns secure HTTPS URL
6. URL stored in MongoDB with user/message data
7. Frontend displays image using Cloudinary URL
```

### Benefits

| Benefit | Description |
|---------|-------------|
| **Automatic Optimization** | Images are compressed and optimized |
| **CDN Delivery** | Fast global content delivery |
| **Secure Storage** | HTTPS URLs with optional signed URLs |
| **Scalability** | No server storage limitations |
| **Transformations** | On-the-fly image resizing and formatting |

---

## 🛠️ Installation & Setup

### Prerequisites

- ✅ Node.js (v14 or higher)
- ✅ MongoDB (local or Atlas)
- ✅ Cloudinary account
- ✅ npm or yarn

---

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories:

#### Backend `.env`
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

CLOUDINARY_CLOUDNAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001
```

---

### Installation Steps

#### 1. Clone the repository
```bash
git clone <repository-url>
cd ChatEasy
```

#### 2. Install backend dependencies
```bash
cd backend
npm install
```

#### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

#### 4. Start MongoDB
```bash
# If using local MongoDB
mongod
```

#### 5. Run the backend server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5001
```

#### 6. Run the frontend development server
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## Project Structure

```
ChatEasy/
│
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   ├── lib/             # Utilities (socket, db, cloudinary)
│   │   └── app.js           # Server entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Zustand stores & utilities
│   │   ├── assets/         # Static assets
│   │   ├── skeletons/      # Loading skeletons
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Deployment

### Backend Deployment
> Platforms: Render, Railway, Heroku

1. Set environment variables
2. Deploy from GitHub repository

### Frontend Deployment
> Platforms: Vercel, Netlify

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Update CORS settings in backend

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/check` | Verify authentication |
| `PUT` | `/api/auth/updateProfile` | Update user profile |
| `PUT` | `/api/auth/updatePassword` | Change password |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/message/users` | Get all users |
| `GET` | `/api/message/:userId` | Get messages with specific user |
| `POST` | `/api/message/send/:userId` | Send message to user |

---


</div>
