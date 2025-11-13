# Complete Project Flow Explanation

## 🎯 Overview
This is a **Creator Dashboard System** for building and managing metaverse/game projects. Users can sign up, build games by uploading assets, manage their projects, and deploy metaverses.

---

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Zustand (for project assets)

---

## 📁 Project Structure

```
website/
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── Builder.tsx
│   │   │   └── creator/   # Creator dashboard pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # API clients & utilities
│   │   └── store/         # Zustand state management
│   └── .env
│
├── server/                 # Backend Express API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── services/      # Business logic
│   │   └── db.ts          # Prisma client
│   └── .env
│
└── prisma/                # Database schema
    ├── schema.prisma
    └── dev.db             # SQLite database file
```

---

## 🔄 Complete User Flow

### **1. Landing Page → Authentication**

**Path**: `/` → `/creator/login` or `/creator/dashboard`

**Flow**:
1. User visits homepage
2. Clicks "Creator Dashboard" button
3. If not logged in → Redirected to `/creator/login`
4. If logged in → Redirected to `/creator/dashboard`

**Components**:
- `Landing.tsx` - Homepage with single "Creator Dashboard" button
- `CreatorLogin.tsx` - Login/Signup form

**Backend**:
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Authenticate user
- Returns JWT token stored in `localStorage`

---

### **2. Authentication Process**

**Frontend** (`client/src/lib/creatorApi.ts`):
```typescript
loginCreator() → Saves token to localStorage → Navigates to dashboard
```

**Backend** (`server/src/routes/authRoutes.ts`):
1. Validates email/password
2. Hashes password with bcrypt
3. Generates JWT token
4. Returns token + user info

**Protected Routes**:
- `CreatorProtectedRoute.tsx` checks for token
- If no token → Redirects to login
- If token exists → Allows access

---

### **3. Creator Dashboard**

**Path**: `/creator/dashboard`

**What Users See**:
1. **Navigation Bar**: Creator Studio, Dashboard, Billing links
2. **Subscription Bar**: Hours remaining, reset date, upgrade buttons
3. **My Projects Section**: All built games/projects
4. **Metaverses Section**: Deployed/running instances

**Data Loading**:
- `GET /api/project` - Fetches all user's projects
- `GET /api/metaverses` - Fetches all user's metaverses
- `GET /api/subscription` - Fetches subscription info

**Components**:
- `CreatorDashboard.tsx` - Main dashboard page
- `ProjectCard.tsx` - Individual project card with Edit/Delete
- `MetaverseCard.tsx` - Individual metaverse card with controls
- `SubscriptionBar.tsx` - Subscription info display

---

### **4. Building a Game**

**Path**: `/build` (Protected - requires login)

**Flow**:

#### **Step 1: Upload Assets**
- User uploads Character (.glb file)
- User uploads Model (.glb or .gltf file)
- User uploads World Map (image file) - Optional

**Frontend** (`Builder.tsx`):
```typescript
handleUpload() → POST /api/upload/:type → Saves to store
```

**Backend** (`server/src/routes/upload.ts`):
1. Validates file type and size
2. Saves file to `uploads/` directory
3. Creates Asset record in database
4. Returns asset info with URL

**State Management** (`useProjectStore`):
- Stores uploaded assets in Zustand store
- Updates form values automatically

#### **Step 2: Build Project**
- User clicks "Build Game" button
- Form validates (needs at least character OR model)

**Frontend**:
```typescript
handleBuild() → 
  saveProject() → POST /api/project (creates project)
  createBuild() → POST /api/build (starts build job)
  pollBuildStatus() → GET /api/build/:jobId (checks status)
```

**Backend**:
- `POST /api/project` - Creates project with asset IDs
- `POST /api/build` - Creates build job (QUEUED → PROCESSING → DONE)
- Simulates build process with timeouts

#### **Step 3: Build Complete**
- Status changes: QUEUED → PROCESSING → DONE
- Auto-navigates to dashboard after 2 seconds
- Project appears in "My Projects" section

---

### **5. Editing a Project**

**Path**: `/build?project={projectId}`

**Flow**:
1. User clicks "Edit" button on project card
2. Navigates to Builder with project ID in URL
3. Builder detects `?project=` parameter

**Frontend** (`Builder.tsx`):
```typescript
useEffect(() => {
  if (projectId) {
    fetchProject(projectId) → Loads project data
    setAsset() → Loads assets into store
    form.setValue() → Populates form
  }
})
```

**Backend**:
- `GET /api/project/:id` - Returns project with all assets
- Includes character, model, worldMap relationships

**Update Process**:
- User modifies assets (upload new or keep existing)
- Click "Build Game" → `updateProject()` instead of `saveProject()`
- `PUT /api/project/:id` - Updates existing project

---

### **6. Managing Projects**

**Actions Available**:

#### **Edit Project**
- Click Edit button (cyan icon) on project card
- Opens Builder with project data loaded
- Make changes and rebuild

#### **Delete Project**
- Click Delete button (red icon) on project card
- Shows confirmation modal
- `DELETE /api/project/:id` - Removes project from database

**Frontend** (`ProjectCard.tsx`):
- Edit/Delete buttons always visible
- Status badge shows build status (DONE, PROCESSING, etc.)

---

### **7. Managing Metaverses**

**Metaverse States**:
- `STOPPED` - Not running
- `STARTING` - Transitioning to running
- `RUNNING` - Active and tracking usage
- `STOPPING` - Transitioning to stopped
- `ERROR` - Failed state

**Actions**:

#### **Start Metaverse**
- `POST /api/metaverses/start/:id`
- Validates: Must be STOPPED or ERROR
- Transitions: STOPPED → STARTING (2s) → RUNNING
- Starts usage tracking

#### **Stop Metaverse**
- `POST /api/metaverses/stop/:id`
- Validates: Must be RUNNING or ERROR
- Transitions: RUNNING → STOPPING (2s) → STOPPED
- Stops usage tracking

#### **Restart Metaverse**
- `POST /api/metaverses/restart/:id`
- Validates: Must be RUNNING
- Transitions: RUNNING → STOPPING (1s) → STARTING (1s) → RUNNING

#### **Delete Metaverse**
- `DELETE /api/metaverses/delete/:id`
- Removes metaverse from database
- Stops tracking if running

**Usage Tracking** (`usageTracker.ts`):
- Tracks uptime (minutes) for RUNNING metaverses
- Calculates hours used based on players online
- Updates every minute via interval

---

## 🗄️ Database Schema

### **User Model**
```prisma
User {
  id          String
  email       String (unique)
  password    String (hashed)
  createdAt   DateTime
  updatedAt   DateTime
  
  metaverses  Metaverse[]
  subscription Subscription?
  projects    Project[]
}
```

### **Project Model**
```prisma
Project {
  id          String
  userId      String
  name        String
  characterId String? (Asset ID)
  modelId     String? (Asset ID)
  worldMapId  String? (Asset ID)
  
  character   Asset?
  model       Asset?
  worldMap    Asset?
  buildJobs   BuildJob[]
}
```

### **Metaverse Model**
```prisma
Metaverse {
  id            String
  userId        String
  name          String
  kind          String (TWO_D or THREE_D)
  region        String (ASIA, EU, US)
  status        String (RUNNING, STOPPED, etc.)
  playersOnline Int
  uptimeMinutes Int
  hoursUsed     Int
}
```

### **Subscription Model**
```prisma
Subscription {
  id           String
  userId       String
  plan         String (INDIE, PRO, STUDIO)
  monthlyHours Int
  usedHours    Int
  resetDate    DateTime
  nextBilling  DateTime
}
```

---

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### **Projects**
- `GET /api/project` - Get all user's projects (protected)
- `GET /api/project/:id` - Get single project (protected)
- `POST /api/project` - Create new project (protected)
- `PUT /api/project/:id` - Update project (protected)
- `DELETE /api/project/:id` - Delete project (protected)

### **Assets**
- `POST /api/upload/:type` - Upload asset file (character/model/worldMap)

### **Builds**
- `POST /api/build` - Start build job
- `GET /api/build/:jobId` - Get build status

### **Metaverses**
- `GET /api/metaverses` - Get all user's metaverses (protected)
- `GET /api/metaverses/:id` - Get single metaverse (protected)
- `POST /api/metaverses` - Create metaverse (protected)
- `POST /api/metaverses/start/:id` - Start metaverse (protected)
- `POST /api/metaverses/stop/:id` - Stop metaverse (protected)
- `POST /api/metaverses/restart/:id` - Restart metaverse (protected)
- `DELETE /api/metaverses/delete/:id` - Delete metaverse (protected)

### **Subscriptions**
- `GET /api/subscription` - Get subscription info (protected)
- `POST /api/subscription/buy-hours` - Purchase hours (protected)
- `POST /api/subscription/upgrade` - Upgrade plan (protected)

---

## 🔐 Security & Authentication

### **JWT Token Flow**
1. User logs in → Server generates JWT
2. Token stored in `localStorage` as `yl_creator_token`
3. All protected API calls include: `Authorization: Bearer <token>`
4. Middleware validates token on each request
5. Invalid/expired token → 401 → Redirects to login

### **Protected Routes**
- `/build` - Requires authentication
- `/creator/dashboard` - Requires authentication
- `/creator/billing` - Requires authentication
- `/creator/:id` - Requires authentication

### **Route Protection**
```typescript
<Route element={<CreatorProtectedRoute />}>
  <Route path="/build" element={<Builder />} />
  <Route path="/creator/dashboard" element={<CreatorDashboard />} />
  ...
</Route>
```

---

## 🎨 UI Components

### **Creator Dashboard Components**
- `CreatorNav.tsx` - Top navigation bar
- `SubscriptionBar.tsx` - Subscription info display
- `ProjectCard.tsx` - Project card with Edit/Delete
- `MetaverseCard.tsx` - Metaverse card with controls
- `StatusChip.tsx` - Status badge component
- `ConfirmModal.tsx` - Confirmation dialog

### **Builder Components**
- `UploadCard.tsx` - File upload component
- `ThreeViewer.tsx` - 3D model preview
- `AnimationSelector.tsx` - Animation selection

---

## 📊 State Management

### **Zustand Store** (`useProjectStore`)
Manages current project being built:
```typescript
{
  projectId: string | undefined
  character: Asset | undefined
  model: Asset | undefined
  worldMap: Asset | undefined
  setAsset(type, asset)
  setProjectId(id)
  reset()
}
```

### **React State**
- Component-level state for UI (loading, errors, etc.)
- Form state managed by `react-hook-form`

---

## 🔄 Data Flow Examples

### **Example 1: Building a New Game**

```
1. User uploads character
   → POST /api/upload/character
   → Asset saved to DB
   → Store updated with asset

2. User uploads model
   → POST /api/upload/model
   → Asset saved to DB
   → Store updated with asset

3. User clicks "Build Game"
   → POST /api/project { characterId, modelId }
   → Project created with userId
   → POST /api/build { projectId }
   → Build job created (QUEUED)

4. Polling build status
   → GET /api/build/:jobId (every 2s)
   → Status: QUEUED → PROCESSING → DONE

5. Build complete
   → Navigate to /creator/dashboard
   → GET /api/project
   → Project appears in "My Projects"
```

### **Example 2: Editing Existing Project**

```
1. User clicks Edit on project card
   → Navigate to /build?project={id}

2. Builder loads project
   → GET /api/project/:id
   → Project data with assets returned
   → Assets loaded into store
   → Form populated with existing data

3. User uploads new character
   → POST /api/upload/character
   → New asset created

4. User clicks "Build Game"
   → PUT /api/project/:id { newCharacterId, modelId }
   → Project updated (not new project created)
   → Build job created
   → Status updates
```

### **Example 3: Starting a Metaverse**

```
1. User clicks "Start" on metaverse card
   → POST /api/metaverses/start/:id

2. Backend validates
   → Check: status must be STOPPED or ERROR
   → Check: user owns metaverse

3. State transition
   → Update status to STARTING
   → Return response immediately

4. After 2 seconds (setTimeout)
   → Update status to RUNNING
   → Set playersOnline (random 5-25)
   → Start usage tracking

5. Frontend polls for updates
   → GET /api/metaverses (every 3s)
   → Shows STARTING → RUNNING transition
```

---

## 🚀 Key Features

### **1. Project Management**
- ✅ Create projects with assets
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ View all projects in dashboard
- ✅ See build status for each project

### **2. Metaverse Management**
- ✅ Start/Stop/Restart metaverses
- ✅ Real-time status updates
- ✅ Usage tracking (uptime, hours)
- ✅ Delete metaverses
- ✅ State transition animations

### **3. Authentication & Security**
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ User-specific data access
- ✅ Secure password hashing

### **4. User Experience**
- ✅ Auto-navigation after actions
- ✅ Loading states
- ✅ Error handling with clear messages
- ✅ Toast notifications
- ✅ Confirmation modals for destructive actions

---

## 🎯 Complete User Journey

```
1. Visit Homepage (/)
   ↓
2. Click "Creator Dashboard"
   ↓
3. Login/Signup (/creator/login)
   ↓
4. Dashboard (/creator/dashboard)
   - View projects
   - View metaverses
   ↓
5. Build Game (/build)
   - Upload assets
   - Build project
   ↓
6. Project Complete
   - Auto-navigate to dashboard
   - Project visible in "My Projects"
   ↓
7. Edit Project (/build?project={id})
   - Load existing data
   - Make changes
   - Rebuild
   ↓
8. Manage Metaverses
   - Start/Stop instances
   - Monitor usage
   - Delete if needed
```

---

## 🔧 Environment Variables

### **Frontend** (`client/.env`)
```
VITE_API_BASE=http://localhost:4000
```

### **Backend** (`server/.env` or root `.env`)
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=supersecret_ggplay
PORT=4000
```

---

## 📝 Summary

This is a **full-stack creator platform** where users can:
1. **Sign up/Login** as creators
2. **Build games** by uploading 3D assets
3. **Manage projects** (edit, delete, view)
4. **Deploy metaverses** and control their runtime
5. **Monitor usage** and manage subscriptions

The system uses **JWT authentication**, **protected routes**, and **real-time state management** to provide a seamless experience for creators to build and manage their metaverse projects.

