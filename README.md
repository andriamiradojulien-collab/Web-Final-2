<<<<<<< HEAD
# Web-Final-2
=======
# Exam Hub

Application de gestion d'examens en ligne (QCM).

## Lancement rapide

```bash
# 1. Démarrer PostgreSQL
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run migrate       # applique migrations/001_init.sql
npm run init-admin    # crée le premier compte admin (RG-01)
npm run dev            # démarre l'API sur http://localhost:4000

# 3. Frontend (dans un autre terminal)
cd frontend
cp .env.example .env
npm install
npm run dev             # démarre sur http://localhost:5173
```

Connecte-toi avec l'email/mot de passe définis dans `backend/.env`
(`INIT_ADMIN_EMAIL` / `INIT_ADMIN_PASSWORD`).

## Structure

- `backend/` — Node.js + Express + TypeScript, SQL brut via `pg`, JWT, bcrypt
  - `src/controller` → `src/service` → `src/repository` → `src/model` / `src/security`
- `frontend/` — React (Vite), react-router-dom, fetch

## Notes sur les règles de gestion (RG)

Voir les commentaires `// RG-xx` directement dans le code source, en particulier :
- `migrations/001_init.sql` : contraintes SQL + trigger RG-04
- `src/service/questionService.ts` : RG-04, RG-08
- `src/service/attemptService.ts` : RG-02, RG-03, RG-05, RG-06, RG-07, RG-12
- `src/repository/courseRepository.ts` / `examRepository.ts` : RG-09
- `src/service/studentService.ts` : RG-10
- `src/service/authService.ts` : RG-11
>>>>>>> 327f80e (Initial commit: Express TypeScript PostgreSQL setup)
