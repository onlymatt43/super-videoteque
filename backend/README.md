# SUPER-VIDEOTHEQUE – Backend API

Service de location vidéo basé sur Node.js + Express, MongoDB et intégrations Payhip/Bunny.net.

## Fonctionnalités principales
- REST API structurée (controllers/services/routes).
- Validation serveur des codes Payhip avant création d'une location.
- Gestion des locations uniques avec expiration automatique (TTL MongoDB).
- Génération de liens Bunny.net signés et temporisés pour chaque lecture.
- TypeScript, logger Pino, validations Zod, middlewares d'erreurs prêts pour la prod.

## Prérequis
- Node.js 18+
- MongoDB 6+
- Clés/identifiants Payhip et Bunny.net valides.

## Installation
```bash
cd backend
cp .env.sample .env  # renseigner vos valeurs
npm install
```

## Scripts utiles
- `npm run dev` : serveur en mode watch via `tsx`.
- `npm run build` : compilation TypeScript vers `dist/`.
- `npm start` : exécute la version compilée.

## Variables d'environnement
| Nom | Description |
| --- | --- |
| `PORT` | Port HTTP (défaut: 4000). |
| `MONGO_URI` | URI MongoDB. |
| `PAYHIP_API_BASE_URL` | Racine de l'API Payhip (ex: `https://payhip.com/api/v2`). |
| `PAYHIP_API_KEY` | Jeton d'API Payhip. |
| `PAYHIP_PRODUCT_ID` | Identifiant du produit Payhip qui émet les clés. |
| `BUNNY_PULL_ZONE_HOST` | Hostname Bunny (sans protocole). |
| `BUNNY_SIGNING_KEY` | Clé secrète pour signer les liens. |
| `BUNNY_LIBRARY_ID` | (Optionnel) ID de la librairie Bunny pour l'import automatique. |
| `BUNNY_API_KEY` | (Optionnel) AccessKey Bunny Video API (utilisé par le seeder). |
| `DEFAULT_RENTAL_HOURS` | Durée par défaut d'une location (heures). |

### Import massif depuis Bunny

1. Renseignez `BUNNY_LIBRARY_ID` et `BUNNY_API_KEY` (Access Key de la Video Library) dans `.env`.
2. Assurez-vous que MongoDB est accessible (`MONGO_URI`).
3. Lancez `npm run seed:movies` :

```bash
cd backend
npm run seed:movies
```

Le script interroge l'API Bunny Video, récupère l'ensemble des vidéos de la librairie puis les upsert dans la collection `movies` (création ou mise à jour). Les champs `videoPath` et `previewUrl` sont remplis automatiquement à partir des URLs Bunny.

## Endpoints clés
Base path : `/api`

### Films
- `GET /movies` – liste complète.
- `GET /movies/:id` – détail.
- `POST /movies` – création (titre, slug, infos Bunny, durée location).

### Locations
- `POST /rentals` – crée une location après validation Payhip et renvoie un lien signé Bunny.
- `GET /rentals/:id` – récupère la location, rafraîchit le lien si encore valide.

### Payhip
- `POST /payhip/validate` – vérifie un code Payhip sans créer de location (utile côté front).

## Flow type pour une location
1. Le front appelle `POST /rentals` avec `{ movieId, customerEmail, payhipCode }`.
2. Le backend :
   - vérifie le film + durée,
   - appelle l'API Payhip pour le code,
   - empêche les doublons actifs,
   - crée la location + TTL,
   - génère un lien signé Bunny (TTL max 1h) et le stocke.
3. La réponse contient `{ rental, signedUrl }`.
4. Pour renouveler le lien avant expiration : `GET /rentals/:id`.

## Tests / Postman
- Endpoint `GET /health` pour vérifier que le service tourne.
- Les schémas Zod renvoient des erreurs explicites en cas de payload invalide.

## Prochaines étapes suggérées
- Ajouter l’authentification et la gestion des rôles.
- Brancher un job de nettoyage/logs pour les locations expirées.
- Couvrir les services critiques avec des tests unitaires.
