# 📚 Book Platform

> **A full-stack web-based book reading & writing platform — built as a hobby project to learn modern web technologies.**

This is a personal learning project where I explored and practiced various modern full-stack web development technologies. It is **not intended for production use** — the primary goal was to get hands-on experience with the tools and frameworks listed below.

---

## ✨ Features

- 📖 **Book Reading & Writing** — Users can publish their own books with chapters and read others' work
- ✍️ **Rich Text Editor** — Powered by Tiptap with bubble menus, text alignment, and placeholder support
- 💬 **Inline Comments** — Paragraph-level commenting system with threaded replies
- ❤️ **Likes & Interactions** — Like books and engage with the community
- 🔍 **Search & Categories** — Browse books by category or search by keyword
- 🔔 **Notifications** — Real-time notification system for replies, likes, and mentions
- 🛡️ **Admin Panel** — Content moderation, user management, and reporting system
- 🌗 **Dark / Light Theme** — Theme toggle with `next-themes`
- 📱 **Responsive Design** — Mobile-friendly UI with dedicated mobile navigation
- 🖼️ **Image Upload & Cropping** — Profile and book cover image management with `react-easy-crop`
- 🔐 **Authentication** — JWT-based auth with role-based access control (User, Author, Moderator, Admin)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework (App Router) |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |
| [Tiptap](https://tiptap.dev/) | Rich text editor |
| [Recharts](https://recharts.org/) | Data visualization (admin charts) |
| [Lucide React](https://lucide.dev/) | Icon library |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling & validation |
| [dnd-kit](https://dndkit.com/) | Drag and drop (chapter reordering) |

### Backend
| Technology | Purpose |
|---|---|
| [NestJS](https://nestjs.com/) | Backend framework |
| [Prisma](https://www.prisma.io/) | ORM & database toolkit |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Passport.js](http://www.passportjs.org/) + JWT | Authentication |
| [Swagger](https://swagger.io/) | API documentation |
| [Sharp](https://sharp.pixelplumbing.com/) | Image processing |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing |

### Testing
| Technology | Purpose |
|---|---|
| [Jest](https://jestjs.io/) | Test runner |
| [Testing Library](https://testing-library.com/) | React component testing |
| [Supertest](https://github.com/visionmedia/supertest) | HTTP assertion library |

---

## 📁 Project Structure

```
book-platform/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   ├── book/               # Book detail pages
│   ├── category/           # Category listing
│   ├── communities/        # Community pages
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── profile/            # User profiles
│   ├── read/               # Book reader
│   ├── search/             # Search functionality
│   ├── settings/           # User settings
│   ├── studio/             # Author writing studio
│   └── tag/                # Tag-based browsing
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui components
│   └── __tests__/          # Component tests
├── backend/                # NestJS backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── books/          # Books CRUD
│   │   ├── chapters/       # Chapters management
│   │   ├── categories/     # Categories management
│   │   ├── comments/       # Comments system  (interactions/)
│   │   ├── notifications/  # Notification system
│   │   ├── reports/        # Content reporting
│   │   ├── users/          # User management
│   │   ├── upload/         # File upload handling
│   │   └── admin/          # Admin endpoints
│   └── prisma/             # Database schema & migrations
├── lib/                    # Utility functions & API helpers
├── hooks/                  # Custom React hooks
├── styles/                 # Global styles
└── public/                 # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) database
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/book-platform.git
   cd book-platform
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the database**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/bookplatform"
   JWT_SECRET="your-secret-key"
   ```

5. **Run Prisma migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

6. **Start the development servers**

   Backend:
   ```bash
   cd backend
   npm run start:dev
   ```

   Frontend (in a separate terminal):
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 📸 Screenshots

> _Coming soon..._

---

## 📝 What I Learned

This project helped me gain hands-on experience with:

- Building a full-stack application with **Next.js App Router** and **NestJS**
- Working with **Prisma ORM** and **PostgreSQL** for data modeling and queries
- Implementing **JWT-based authentication** with role-based access control
- Creating a **rich text editor** with Tiptap
- Building accessible UI components with **Radix UI** and **shadcn/ui**
- Writing **unit tests** with Jest and Testing Library
- Managing complex state and forms with **React Hook Form** and **Zod**
- Handling **file uploads** and image processing with Sharp
- Implementing **drag-and-drop** interfaces with dnd-kit
- Setting up **API documentation** with Swagger

---

## ⚠️ Disclaimer

This is a **hobby/learning project**. It is not production-ready and may contain incomplete features, bugs, or security issues. Use it as a reference or learning resource at your own risk.

This project was designed, directed, and developed by me. The product vision, architecture decisions, and feature requirements are my own; AI-assisted tools were used along the way to help implement them under my direction.
