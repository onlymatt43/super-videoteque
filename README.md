# 🎬 Super Vidéothèque

Plateforme de location de vidéos avec paiement Payhip et streaming via Bunny.net.

## 🚀 Démarrage rapide

```bash
# Mode interactif (ouvre 2 terminaux)
./dev.sh

# OU mode background
./start.sh

# Arrêter tout
./stop.sh
```

## 📁 Structure

```
├── backend/          # API Express.js + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── routes/
│   └── .env          # Configuration (voir .env.sample)
│
├── frontend/         # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│   └── .env          # Configuration (voir .env.sample)
│
├── start.sh          # Démarrer en background
├── stop.sh           # Arrêter tout
└── dev.sh            # Mode développement (terminaux séparés)
```

## ⚙️ Configuration

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://...
PAYHIP_API_KEY=...
BUNNY_API_KEY=...
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:4000
```

## 🔗 URLs

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:5173   |
| Backend  | http://localhost:4000   |

## 📦 Tech Stack

- **Backend**: Express.js, TypeScript, MongoDB, Zod
- **Frontend**: React 19, Vite, TailwindCSS, Zustand
- **Intégrations**: Payhip (paiements), Bunny.net (CDN vidéo)
