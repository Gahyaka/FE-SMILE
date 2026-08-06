<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Instructions

## Scope & Project Boundary
- **Frontend Only:** Proyek ini hanya berupa aplikasi **Frontend** berbasis Next.js, React, Tailwind CSS, dan TypeScript.
- **Backend Separation:** Backend untuk aplikasi ini dikembangkan secara terpisah oleh pengembang lain menggunakan **AdonisJS** di folder/repositori eksternal yang berbeda.
- **No Backend Code:** Jangan pernah membuat route backend, koneksi database langsung (seperti Prisma/Knex), atau menulis API handler lokal di dalam folder proyek ini.
- **API Consumption:** Semua interaksi dengan data dinamis harus dilakukan melalui panggilan HTTP REST API standar (`fetch` atau Axios) ke endpoint backend AdonisJS yang disediakan oleh pengembang backend.
