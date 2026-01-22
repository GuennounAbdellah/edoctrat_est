# eDoctorat

Full-stack application (Spring Boot backend + React + Vite frontend) for managing doctoral candidature, commissions, and related workflows.

## Contents
- Backend: [back-end](back-end/)
- Frontend: [front-end](front-end/)

## Overview
This repository contains two main parts:

- A Java Spring Boot backend (located in `back-end`) exposing REST endpoints and handling authentication (JWT).
- A React + TypeScript frontend (located in `front-end`) built with Vite providing the user interface for different roles (candidat, professeur, directeurs, scolarite, etc.).

## Repository structure
- [back-end](back-end/): Spring Boot application with controllers, services, repositories, security, DTOs, and configuration.
- [front-end](front-end/): Vite + React + TypeScript SPA with components, pages, API service wrappers, and models.

See configuration examples: [back-end/src/main/resources/application.properties](back-end/src/main/resources/application.properties) and front-end env file `.env.local` at `front-end/.env.local`.

## Fonctionnalités par rôle
Cette section décrit, à partir du code présent, les principales fonctionnalités disponibles pour chaque acteur (rôle) de l'application.

- **Candidat**
	- Inscription / pré-inscription et complétion de dossier (données personnelles, diplômes, annexes).
	- Dépôt de sujet / proposition de sujet.
	- Postuler aux sujets ou aux commissions.
	- Consulter calendrier, notifications et résultats (statut de candidature, décisions).
	- Télécharger / joindre des pièces (annexes, diplômes, attestations).

- **Professeur**
	- Authentification et gestion de profil.
	- Proposer des sujets et les gérer (édition, suppression, état).
	- Consulter candidats associés et dossiers soumis.
	- Participer en tant qu'examinateur; accéder aux convocations et documents liés.

- **Directeur de CED (Centre/Etablissement de doctorat)**
	- Valider/contrôler les dossiers de pré-inscription.
	- Gérer commissions et planification au niveau du CED.
	- Suivre listes de candidats et statuts administratifs.

- **Directeur de Laboratoire**
	- Créer et gérer les commissions (composition, date/heure, lieu).
	- Assigner examinateurs, confirmer disponibilités.
	- Gérer sujets rattachés au laboratoire et candidats affiliés.

- **Directeur de Pôle**
	- Supervision inter-laboratoires et validation finale pour certaines étapes.
	- Gestion de communications et notifications liées aux p ôles.

- **Scolarité / Administration**
	- Gestion des inscriptions administratives définitives.
	- Génération et envoi des convocations / courriers.
	- Accès aux listes complètes (candidats, diplômes, documents), export éventuel.

Note: Les noms exacts des actions et endpoints se trouvent dans les contrôleurs backend (dossier `back-end/src/main/java/com/tppartdeux/edoctorat/controller`) et liaisons frontend dans `front-end/src/pages`.

## Prerequisites
- Java 17 or later (Spring Boot 3.x requires Java 17+).

## Architecture du projet
Le projet suit une architecture classique en couches avec une séparation claire entre frontend, backend et persistance:

- **Frontend (SPA)**: React + TypeScript, construit avec Vite. Gère l'interface utilisateur, l'authentification côté client, l'appel des APIs REST et la gestion d'état minimale.
- **Backend (API)**: Spring Boot (Java) exposant des endpoints REST. Structure typique: contrôleurs (API), services (logique métier), repositories (accès aux données), DTOs et sécurité (JWT).
- **Base de données**: PostgreSQL/MySQL (configurable via `application.properties`).
- **Authentification**: JWT (filtres et service JWT présents dans `back-end/src/main/java/.../security`).
- **Stockage de fichiers**: pièces jointes et annexes — gérées soit en base, soit via stockage local/objet (configurable).
- **Services externes**: SMTP pour l'envoi d'e-mails (confirmation, convocations), éventuellement services OAuth pour Google.

Diagramme (simplifié):

	Frontend (Vite React)
			 |
			 | HTTPS / REST
			 v
	Backend (Spring Boot)
	 - Controllers -> Services -> Repositories
	 - JWT Auth
			 |
			 v
	Base de données (Postgres/MySQL)
			 |
			 v
	Stockage (local / S3)  --  SMTP / OAuth providers

Chaque composant est isolé pour faciliter le déploiement (containers, services PaaS) et les tests.

## Relations entre acteurs et flux par fonctionnalité
Pour faciliter la compréhension, ci-dessous les acteurs principaux et leurs interactions associées à chaque fonctionnalité. Les noms d'acteurs correspondent aux rôles implémentés dans le code (ex: `Candidat`, `Professeur`, `DirecteurLabo`, `DirecteurCED`, `DirecteurPole`, `Scolarite`, `Examinateur`).

- **Inscription / Pré-inscription**
	- Acteurs: `Candidat`, `Scolarite`, `DirecteurCED`.
	- Flux: le `Candidat` soumet son dossier -> le backend stocke et notifie `Scolarite` -> `Scolarite` / `DirecteurCED` vérifient et valident (ou rejettent) -> notification renvoyée au `Candidat`.

- **Dépôt / Proposition de sujet**
	- Acteurs: `Professeur`, `Candidat`, `DirecteurLabo`.
	- Flux: `Professeur` propose un sujet -> visible par `Candidat` -> `Candidat` postule au sujet ou le propose via workflow -> `DirecteurLabo` peut approuver/associer.

- **Création et gestion des commissions**
	- Acteurs: `DirecteurLabo`, `DirecteurCED`, `Examinateur`, `Scolarite`.
	- Flux: `DirecteurLabo` crée commission (composition, date) -> invitations/convocations envoyées aux `Examinateurs` et `Scolarite` -> `Examinateurs` confirment -> commission tenue -> décision remontée au backend.

- **Evaluation / Participation (Examinateur)**
	- Acteurs: `Examinateur`, `Professeur`, `Candidat`.
	- Flux: `Examinateur` accède aux dossiers via API -> renseigne avis/notes -> résultat enregistré -> visible par `Professeur` et `Candidat` suivant droits.

- **Validation administrative finale (Scolarité)**
	- Acteurs: `Scolarite`, `DirecteurPole`, `DirecteurCED`, `Candidat`.
	- Flux: Après décision de la commission, `Scolarite` effectue les formalités administratives et clôture l'inscription; `DirecteurPole` peut valider certains cas si nécessaire.

- **Notifications & Calendrier**
	- Acteurs: Tous.
	- Flux: Backend envoie notifications (email/in-app) pour convocations, décisions, échéances — tous les acteurs reçoivent les notifications pertinentes selon leurs rôles.

Remarque: les interactions exactes (endpoints et payloads) sont définies dans les contrôleurs backend (`back-end/src/main/java/.../controller`) et consommées par les pages frontend (`front-end/src/pages`). Si vous voulez, je peux générer une carte complète des endpoints et lier chaque endpoint aux rôles concernés.
- Maven (or use the included `mvnw` / `mvnw.cmd`).
- Node.js (v18+ recommended) and npm (or `bun`/`pnpm` if you prefer).

## Backend — Quick start
From the project root or inside `back-end`:

Windows (PowerShell):

```powershell
cd back-end
mvnw.cmd spring-boot:run
```

Unix/macOS:

```bash
cd back-end
./mvnw spring-boot:run
```

Or with a globally installed Maven:

```bash
mvn spring-boot:run
```

Build a packaged JAR:

```bash
cd back-end
./mvnw package
# then run
java -jar target/eDoctorat-0.0.1-SNAPSHOT.jar
```

Default configuration is in [back-end/src/main/resources/application.properties](back-end/src/main/resources/application.properties). If you need to customize database or JWT settings, update that file or set environment variables as appropriate.

## Frontend — Quick start
From the project root or inside `front-end`:

Install dependencies and run the development server:

```bash
cd front-end
npm install
npm run dev
```

The app runs via Vite (default port 5173). The project also includes a `bun.lockb` file; if you use `bun`, run `bun install` and `bun run dev` instead.

Build for production:

```bash
cd front-end
npm run build
# serve the dist folder using any static server
```

## Environment & configuration
- Backend: check [back-end/src/main/resources/application.properties](back-end/src/main/resources/application.properties) for DB, JWT, and mail settings. There is a `.env` at the back-end root (if used). Provide values for datasource URL, username, password, `jwt.secret` (or equivalent) and any mail or external service credentials.
- Frontend: environment overrides are in `front-end/.env.local` (not committed). Adjust API base URL and any OAuth/client IDs there.

Example backend env keys to check (names may vary):
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `jwt.secret` or `app.jwt.secret`

## Running locally (recommended order)
1. Start the backend API (Maven wrapper):

```bash
cd back-end
mvnw.cmd spring-boot:run   # Windows
# or ./mvnw spring-boot:run on macOS/Linux
```

2. Start the frontend dev server:

```bash
cd front-end
npm install
npm run dev
```

Open the frontend at `http://localhost:5173` (or the port shown by Vite). The frontend expects the backend API to be running — adjust the frontend API base URL in `front-end/src/api/api.tsx` or via `.env.local` if needed.

## Tests
- Backend: run `./mvnw test` in `back-end`.
- Frontend: if tests exist, run `npm test` from `front-end` (adjust as needed).

## Docker (optional)
This repository does not include Dockerfiles by default. To containerize:
- Build the backend JAR and create a Docker image running the JAR.
- Build the frontend and serve the `dist/` using a lightweight static server (e.g., `nginx` or `caddy`).

## Contributing
- Fork the repo and open a pull request with clear description and tests for new functionality.
- Keep backend controllers/services well-tested and the frontend components documented.

## Troubleshooting
- If frontend cannot reach the API, confirm backend is running and update the frontend API base URL.
- For database errors, verify the JDBC URL and credentials in [back-end/src/main/resources/application.properties](back-end/src/main/resources/application.properties).

## License
Add a license file (`LICENSE`) to the repository and update this section accordingly.

## Contact
For questions, open an issue in this repository.

---

*README generated based on repository structure (Spring Boot backend + Vite React frontend).*