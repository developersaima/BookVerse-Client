<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=📚+BookVerse;Discover+%26+Read+Original+Ebooks;Your+Digital+Reading+Universe" alt="Typing SVG" />

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-book--verse--bd.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://book-verse-bd.vercel.app/)
[![Client Repo](https://img.shields.io/badge/📁_Client_Repo-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/developersaima/BookVerse-Client)
[![Server Repo](https://img.shields.io/badge/📁_Server_Repo-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/developersaima/BookVerse-Server)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI_v5-5A0EF8?style=flat-square&logo=daisyui&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

</div>

---

## 📖 About BookVerse

**BookVerse** is a modern ebook sharing platform that bridges talented writers with passionate readers. Writers upload and manage original ebooks, readers discover and purchase them, and a powerful admin keeps the ecosystem thriving — all in one beautifully crafted interface.

> _"Where every story finds its reader."_

---

## ✨ Key Features

### 👤 For Readers
- 🔍 **Browse & Search** — Filter ebooks by genre, price range, and availability
- 📖 **Purchase Ebooks** — Secure checkout powered by **Stripe**
- 🔖 **Bookmark System** — Save ebooks for later reading
- 📊 **Purchase History** — Track all bought ebooks in one place
- 🧑‍💼 **Personal Dashboard** — View profile and purchased ebook gallery

### ✍️ For Writers
- 📤 **Upload Ebooks** — Add title, description, cover (via imgBB), genre, and price
- ⚙️ **Manage Ebooks** — Edit, delete, publish, or unpublish with one click
- 💰 **Sales History** — See who bought your books and when
- 🔖 **Bookmarks** — Keep track of ebooks you love

### 🛡️ For Admins
- 👥 **User Management** — Change roles, delete users
- 📚 **Ebook Moderation** — Publish/unpublish/delete any ebook
- 💳 **All Transactions** — View every payment across the platform
- 📈 **Analytics Dashboard** — Revenue cards, monthly sales chart, genre pie chart

### 🌐 Platform-Wide
- 🔐 **JWT Auth** + **Google OAuth** via BetterAuth
- 🌙 **Dark Mode** — Persisted via `next-themes`
- 🎞️ **Framer Motion Animations** — Hero fade-ins, staggered card reveals, hover effects
- 📱 **Fully Responsive** — Mobile-first design with hamburger nav
- ⚡ **Skeleton Loaders** — Smooth loading states everywhere
- 🚫 **Custom 404 Page** — Illustrated error with home redirect

---

## 🗂️ Project Structure

```
BookVerse-Client/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (main)/
│   │   ├── page.jsx              # Home
│   │   ├── browse/               # Browse Ebooks
│   │   └── ebooks/[id]/          # Ebook Details
│   └── dashboard/
│       ├── user/                 # Reader Dashboard
│       ├── writer/               # Writer Dashboard
│       └── admin/                # Admin Dashboard
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── home/                     # Home page sections
│   └── dashboard/                # Dashboard components
├── lib/
│   ├── auth.js                   # BetterAuth config
│   └── stripe.js                 # Stripe client
└── public/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn
- A running [BookVerse Server](https://github.com/developersaima/BookVerse-Server)

### Installation

```bash
# Clone the repository
git clone https://github.com/developersaima/BookVerse-Client.git
cd BookVerse-Client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# App
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# imgBB
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

> ⚠️ **Never commit `.env.local` to version control.**

### Run Locally

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Dependencies

### Production

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.9 | React framework |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | DOM rendering |
| `better-auth` | ^1.6.20 | Auth (JWT + Google OAuth) |
| `@better-auth/mongo-adapter` | ^1.6.20 | MongoDB adapter for BetterAuth |
| `framer-motion` | ^12.42.0 | Animations & transitions |
| `motion` | ^12.42.0 | Motion primitives |
| `stripe` | ^22.3.0 | Payment processing |
| `swiper` | ^12.2.0 | Hero carousel/slider |
| `recharts` | ^3.9.0 | Admin analytics charts |
| `react-hook-form` | ^7.80.0 | Form state management |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `react-icons` | ^5.6.0 | Icon library |
| `next-themes` | ^0.4.6 | Dark/light mode |
| `mongodb` | ^7.3.0 | MongoDB client |

### Development

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4 | Utility-first CSS |
| `@tailwindcss/postcss` | ^4 | PostCSS integration |
| `daisyui` | ^5.5.23 | UI component library |
| `eslint` | ^9 | Code linting |
| `eslint-config-next` | 16.2.9 | Next.js ESLint rules |
| `@types/react` | 19.2.17 | TypeScript types |
| `@types/node` | 26.0.1 | Node TypeScript types |

---

## 🔑 Admin Credentials

```
Email:    admin@bookverse.com
Password: Admin001
```

---

## 🌍 Deployment

This project is deployed on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/developersaima/BookVerse-Client)

Make sure all environment variables are set in your Vercel project settings under **Settings → Environment Variables**.

---

## 📸 Pages Overview

| Page | Route | Access |
|---|---|---|
| Home | `/` | Public |
| Browse Ebooks | `/browse` | Public |
| Ebook Details | `/ebooks/[id]` | Public |
| Login | `/login` | Guest only |
| Register | `/register` | Guest only |
| Reader Dashboard | `/dashboard/user` | Reader |
| Writer Dashboard | `/dashboard/writer` | Writer |
| Admin Dashboard | `/dashboard/admin` | Admin |

---

## 👩‍💻 Developer

<div align="center">

**Saima Akter**

[![GitHub](https://img.shields.io/badge/GitHub-developersaima-181717?style=flat-square&logo=github)](https://github.com/developersaima)

_Built with ❤️ as part of the A10_CAT-012 assignment_

</div>

---

<div align="center">
<sub>© 2025 BookVerse. All rights reserved.</sub>
</div>