# Hold A Hand India — Mentorship Platform

A React-based mentorship platform connecting successful mentors with underprivileged students for guidance in studies, sports, and business. Built as an NGO-driven initiative focused on direction, motivation, and personal development.

---

## Quick Start

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project
cd hold-a-hand-india

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React 18 + TypeScript               |
| Build Tool   | Vite 5                              |
| Styling      | Tailwind CSS + shadcn/ui            |
| Routing      | React Router v6                     |
| Animation    | Framer Motion                       |
| Charts       | Recharts                            |
| State        | React Context API (useState/useContext) |
| Data         | Static TypeScript files (no backend) |

---

## Demo Credentials

| Role    | Username         | Password      |
| ------- | ---------------- | ------------- |
| Mentor  | `rajesh_mentor`  | `password123` |
| Student | `anita_student`  | `password123` |

---

## Application Flow

### Public Pages (Unauthenticated)

1. **Home Page (`/`)** — NGO-style landing with hero, impact stats, mission, and support options.
2. **Login (`/login`)** — Username + password, redirects based on role.
3. **Signup (`/signup`)** — Role selection (Mentor/Student) with role-specific fields.

### Mentor Flow (`/mentor/*`)

```
Login → Dashboard → Discover Students → Select Students → Chat / Video Sessions → Track Growth → Flag for Support
```

| Page                | Route                | Description                                    |
| ------------------- | -------------------- | ---------------------------------------------- |
| Dashboard           | `/mentor/dashboard`  | Stats overview, top students, support needs     |
| Student Discovery   | `/mentor/discover`   | Browse all student profiles, select for mentorship |
| Selected Students   | `/mentor/selected`   | Manage chosen students, quick actions           |
| Student Insights    | `/mentor/insights`   | Growth ratings, seriousness scores, support flags |
| Chat                | `/mentor/chat`       | Chat with selected students only                |
| Video Sessions      | `/mentor/sessions`   | Session history, mark as important              |

### Student Flow (`/student/*`)

```
Login → Dashboard → View Mentor → Chat (daily limit) → Video Sessions (weekly limit) → Track Growth → Request Support
```

| Page                | Route                  | Description                                  |
| ------------------- | ---------------------- | -------------------------------------------- |
| Dashboard           | `/student/dashboard`   | Mentor info, session history, quick stats     |
| My Mentor           | `/student/mentor`      | Assigned mentor profile and details           |
| My Growth           | `/student/growth`      | Skill progress bars (confidence, discipline, etc.) |
| My Performance      | `/student/performance` | Attendance %, consistency score, warnings     |
| Chat                | `/student/chat`        | Chat with assigned mentor (20 msgs/day limit) |
| Video Sessions      | `/student/sessions`    | Request sessions (2/week limit), view history |
| Saved Sessions      | `/student/saved`       | Bookmarked important sessions                 |
| Support Request     | `/student/support`     | Request books, fees, training sponsorship     |

---

## Key Features

### 1. Student Growth Tracking
- Mentors rate students on: **Confidence, Discipline, Communication, Learning Speed** (1–10 scale)
- Students see progress bars and mentor feedback notes
- Data file: `src/data/growthData.ts`

### 2. Seriousness & Consistency Filter
- Tracks: **Attendance Rate, Missed Sessions, Consistency Score, Last Active**
- Activity status badges: 🟢 Active · 🟡 Irregular · 🔴 Inactive
- Mentors can sort/filter students by seriousness
- Data file: `src/data/seriousnessData.ts`

### 3. NGO Support Layer
- Support types: Books, Training, Exam Fees, Sponsorship
- Students can submit support requests
- Status badges: Requested → Under Review → Sponsored
- Data file: `src/data/supportPrograms.ts`

### 4. Restriction System (Simulated)
- **Chat limit:** 20 messages per day (per student)
- **Video calls:** 2 requests per week (per student)
- Counters managed via React state in `AppDataContext`

### 5. Dark Mode
- Toggle in navbar (sun/moon icon)
- Persists via `localStorage`
- Full theme support with semantic CSS tokens

---

## Project Structure

```
src/
├── assets/              # Generated images (hero, mentor, celebration)
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui primitives (button, card, etc.)
│   ├── AppSidebar.tsx   # Role-based sidebar navigation
│   ├── DashboardLayout.tsx
│   ├── ChatWindow.tsx
│   ├── StudentCard.tsx
│   ├── SkillBar.tsx
│   ├── ConsistencyMeter.tsx
│   ├── SupportCard.tsx
│   ├── ThemeToggle.tsx
│   └── ...
├── contexts/
│   ├── AuthContext.tsx   # Auth state, login/logout, 401 middleware
│   └── AppDataContext.tsx # Global app state (selections, chats, limits)
├── data/                # Static data files (types, mentors, students, etc.)
├── pages/
│   ├── Home.tsx         # Public landing page
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── mentor/          # All mentor pages
│   └── student/         # All student pages
├── services/            # API-ready service layer
│   ├── apiConfig.ts     # Endpoint declarations + USE_STATIC_DATA toggle
│   ├── httpClient.ts    # Fetch wrapper with 401 auto-logout middleware
│   ├── authService.ts
│   ├── studentService.ts
│   ├── mentorService.ts
│   └── ...
└── hooks/               # Custom hooks (use-mobile, use-toast)
```

---

## Services Layer (Backend-Ready)

All data access goes through `src/services/`. Each service has two code paths:

```typescript
// src/services/apiConfig.ts
export const USE_STATIC_DATA = true; // flip to false when backend is ready
```

- **`USE_STATIC_DATA = true`** → returns data from `src/data/*.ts`
- **`USE_STATIC_DATA = false`** → calls REST endpoints via `httpClient.ts`

The `httpClient` includes a **401 middleware** that automatically logs the user out when the backend returns an unauthorized response.

### Declared API Endpoints

| Method | Endpoint                              | Service File            |
| ------ | ------------------------------------- | ----------------------- |
| POST   | `/api/auth/login`                     | authService.ts          |
| POST   | `/api/auth/signup`                    | authService.ts          |
| GET    | `/api/students`                       | studentService.ts       |
| GET    | `/api/students/:id`                   | studentService.ts       |
| GET    | `/api/mentors`                        | mentorService.ts        |
| GET    | `/api/mentors/:id`                    | mentorService.ts        |
| GET    | `/api/sessions`                       | sessionService.ts       |
| GET    | `/api/messages/:recipientId`          | messageService.ts       |
| POST   | `/api/messages`                       | messageService.ts       |
| GET    | `/api/growth/:studentId`              | growthService.ts        |
| PUT    | `/api/growth/:studentId`              | growthService.ts        |
| GET    | `/api/seriousness/:studentId`         | seriousnessService.ts   |
| GET    | `/api/support/programs`               | supportService.ts       |
| POST   | `/api/support/requests`               | supportService.ts       |

---

## State Management

| Context          | Manages                                             |
| ---------------- | --------------------------------------------------- |
| `AuthContext`    | Current user, login/logout, role-based auth          |
| `AppDataContext` | Student selection, chat messages, session data, growth ratings, seriousness records, support requests, daily/weekly limits |

No external state library — pure React Context + useState.

---

## Things to Remember

1. **No backend** — all data is static; switch `USE_STATIC_DATA` to `false` when connecting a real API.
2. **Role-based routing** — `ProtectedRoute` component checks auth + role before rendering pages.
3. **Restrictions are simulated** — message/call limits reset on page refresh (state-based).
4. **Dark mode** — persisted in `localStorage` under the `theme` key.
5. **Semantic tokens** — all colors use CSS variables from `index.css`; never hardcode colors in components.
6. **Component modularity** — every card, meter, and badge is a standalone reusable component.

---

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm test         # Run Vitest tests
```

---

## License

This project is built for **Hold A Hand India**, an NGO initiative for student mentorship and empowerment.
