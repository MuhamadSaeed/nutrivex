# Nutrivex

A comprehensive nutrition and fitness platform powered by AI. Nutrivex helps users track their nutrition, discover exercises, and receive personalized wellness guidance from an intelligent assistant.

**Live Demo:** [nutrivex.vercel.app](https://nutrivex.vercel.app)

## Features

### Core Features
- **AI-Powered Assistant** - Chat with an intelligent nutrition and fitness advisor powered by OpenAI
- **Nutrition Database** - Search and explore thousands of food items with nutritional information
- **Exercise Library** - Discover exercises with detailed descriptions and guides
- **BMI Calculator** - Calculate and track your Body Mass Index
- **Blog** - Read latest wellness and nutrition articles
- **Doctor Locator** - Find healthcare professionals in your area

### User & Admin Features
- **User Authentication** - Secure signup and login with Firebase
- **Personalized Profiles** - Save preferences and track your wellness journey
- **Admin Dashboard** - Manage blog posts, exercises, and nutrition 
tips
- **Responsive Design** - Seamless experience across all devices

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS 
- **Backend & Database:** Firebase (Authentication & Firestore)
- **AI Integration:** OpenAI API
- **Forms:** React Hook Form + Zod validation
- **Email:** EmailJS
- **Search:** Fuse.js
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Firebase project setup
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nutrivex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

Build the production bundle:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── assistant/         # AI chat interface
│   ├── blog/              # Blog pages
│   ├── bmi/               # BMI calculator
│   ├── doctors/           # Doctor locator
│   ├── exercises/         # Exercise library
│   ├── nutrition/         # Nutrition database
│   └── (auth)/            # Authentication pages
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── context/          # React Context (Auth)
│   ├── fetch/            # Data fetching utilities
│   ├── firebase.ts       # Firebase configuration
│   └── email.ts          # Email service
└── types/                # TypeScript type definitions
```

## Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with featured content |
| AI Assistant | `/assistant` | Chat interface with AI wellness advisor |
| Nutrition | `/nutrition` | Food database with search functionality |
| Exercises | `/exercises` | Exercise library with filters |
| Blog | `/blog` | Wellness and nutrition articles |
| BMI Calculator | `/bmi` | Calculate your BMI |
| Doctors | `/doctors` | Find healthcare professionals |
| Login | `/login` | User authentication |
| Signup | `/signup` | Create new account |


