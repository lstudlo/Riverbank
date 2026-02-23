# Riverbank

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Hono](https://img.shields.io/badge/Hono-4.x-E36002?logo=hono)](https://hono.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)

**Send and receive anonymous messages across the world.**

Riverbank is a message-in-a-bottle web application where you can throw a message into the digital ocean and receive random messages from others around the globe.

![Riverbank Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/ec7f4be5-d1d6-4e94-0851-126341745400/preview)

## Features

- **Throw Messages** - Write an anonymous message and cast it into the river
- **Receive Bottles** - Get random messages from other users worldwide
- **Reactions** - React to messages with emojis (Discord-style multi-emoji support)
- **Content Moderation** - Report inappropriate content
- **Rate Limiting** - Fair usage protection against spam
- **Dark/Light Theme** - Comfortable viewing in any environment
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 6, TanStack Router |
| Backend | Hono.js |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM |
| Styling | TailwindCSS 4, shadcn/ui |
| Hosting | Cloudflare Workers |
| Icons | [raster-react](https://github.com/lstudlo/raster-react) |

## Live Demo

Visit the live application at: **[riverbank.day](https://riverbank.day)**

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Cloudflare account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lstudlo/Riverbank.git
cd Riverbank
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up local database:
```bash
pnpm run db:migrate
```

### Development

Start the development server:

```bash
pnpm dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

### Database Management

```bash
# Generate migrations from schema changes
pnpm run db:generate

# Apply migrations (local)
pnpm run db:migrate

# Open Drizzle Studio
pnpm run db:studio:local
```

### Production

Build and deploy to Cloudflare Workers:

```bash
pnpm run build
pnpm run deploy
```

## Project Structure

```
src/
├── web/                    # React 19 frontend (Vite 6)
│   ├── routes/             # TanStack Router (file-based)
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilities
└── worker/                 # Hono.js API
    └── db/                 # Drizzle schema

migrations/                 # Drizzle D1 migrations
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bottles/throw` | Submit a message and receive random bottles |
| `POST` | `/api/bottles/:id/like` | Like a bottle |
| `POST` | `/api/bottles/:id/report` | Report a bottle |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cloudflare](https://www.cloudflare.com/) for the amazing edge computing platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Hono](https://hono.dev/) for the lightweight web framework
- [Drizzle ORM](https://orm.drizzle.team/) for the type-safe database toolkit
