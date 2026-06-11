# DistInc User Microservice

A strict TypeScript and Firebase Cloud Functions service that manages DistInc user registration, account resets, and coordinated deletion of authentication and Firestore data.

## Links

| Resource | Link |
|---|---|
| Live application | [distinc.co.uk](https://www.distinc.co.uk) |
| Demo video | [Watch on YouTube](https://youtu.be/xbIUeWg9SuI) |
| Public API entry point | [DistInc API Gateway](https://github.com/SaoodCS/DistInc-API-Gateway) |
| React PWA | [DistInc Frontend](https://github.com/SaoodCS/DistInc-PWA-React-TypeScript-Front-End) |
| Data service | [DistInc Data Microservice](https://github.com/SaoodCS/DistInc-Data-Microservice) |
| Notification service | [DistInc Notification Microservice](https://github.com/SaoodCS/DistInc-Notification-Microservice) |

## Tech Stack

| Area | Technology | Purpose |
|---|---|---|
| Runtime | Node.js 20, TypeScript 5.4 | Strictly typed server-side implementation |
| API | Express, Firebase Cloud Functions | HTTP routing and serverless execution |
| Identity | Firebase Authentication, Admin SDK | User creation, lookup, and deletion |
| Persistence | Cloud Firestore | User profile and application-data cleanup |
| Testing | Jest, `ts-jest` | TypeScript unit tests |
| Quality | ESLint, Prettier, TypeScript | Static analysis, formatting, and type checking |
| Delivery | GitHub Actions, Firebase CLI | Branch-based CI/CD to development and production |

## Key Features

- Registers email/password users with Firebase Authentication.
- Creates a matching UID-keyed `userDetails` document after successful registration.
- Returns a conflict response when an email is already registered.
- Attempts cleanup if registration fails after partially creating authentication or Firestore state.
- Resets an account by deleting UID-matched application documents across Firestore collections and recreating the base user record.
- Deletes both the user's Firestore data and Firebase Authentication account.
- Batches cross-collection Firestore deletions into a single commit.
- Validates request payloads and centralizes Firebase and application error responses.

## Getting Started

### Prerequisites

- Node.js 20
- npm
- Firebase CLI 13.7.2 for emulation or deployment
- Access to a Firebase project with Authentication and Firestore configured

The repository uses `package-lock.json`, so npm is the supported package manager.

```bash
git clone https://github.com/SaoodCS/DistInc-User-Microservice.git
cd DistInc-User-Microservice
npm install
```

The root install script installs dependencies in `functions/`, where the Cloud Function package is located.

### Environment

Environment files are gitignored, and the repository does not currently include a `.env.example`. Create `functions/.env` with the same internal key configured in the API gateway:

```dotenv
API_KEY=replace-with-shared-gateway-key
```

Firebase Admin uses the active Firebase project or `GOOGLE_APPLICATION_CREDENTIALS`. Deployed requests are expected to include:

- `Content-Type: application/json`
- `api-key: <shared key>`

The gateway contract also requires authorization for reset and deletion operations. Registration is the unauthenticated onboarding operation.

Start the development-project Functions emulator:

```bash
npm run serve-dev
```

The production-project emulator is available through `npm run serve-prod`. Both scripts build the TypeScript source and serve functions on port `9000`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run build` | Removes generated output and compiles TypeScript |
| `npm run serve-dev` | Builds and emulates functions against `distinc-dev` |
| `npm run serve-prod` | Builds and emulates functions against `distinc-9ad9d` |
| `npm run test` | Runs the Jest test suite |
| `npm run test-watch` | Runs Jest in watch mode |
| `npm run lint-ts` | Runs ESLint and TypeScript checks concurrently |
| `npm run lint-fix` | Applies supported ESLint fixes |
| `npm run prettify` | Formats TypeScript source with Prettier |
| `npm run deploy-dev` | Builds and deploys `userService` to development |
| `npm run deploy-prod` | Builds and deploys `userService` to production |

## Architecture

Each account lifecycle operation has a focused endpoint and request-body type guard. Shared Firebase helpers coordinate authentication and Firestore operations.

```text
functions/src/
├── index.ts                 # Express composition and Cloud Function export
├── registerUser/            # Authentication and base-profile creation
├── resetUser/               # Application-data reset
├── deleteUser/              # Authentication and data deletion
└── global/
    ├── middleware/          # API-key and request-header checks
    ├── helpers/firebase/    # Auth lookup, deletion, and Firestore cleanup
    ├── helpers/             # Validation and error handling
    └── utils/               # Firebase clients, collections, response codes
```

The Express middleware validates the service-to-service request. Endpoints then validate their payloads and delegate Firebase operations to focused helpers. Reset and deletion resolve the Firebase UID from the submitted email before modifying UID-keyed records.

## API Overview

All routes use `POST` and are mounted beneath the deployed `userService` HTTPS function. They are normally called through the API gateway.

| Route | Request body | Purpose |
|---|---|---|
| `/registerUser` | `email`, `password` | Creates the Firebase Auth user and base Firestore profile |
| `/resetUser` | `email` | Removes application data and restores the base user profile |
| `/deleteUser` | `email` | Removes application data and deletes the Firebase Auth account |

The cleanup helper lists the project's top-level Firestore collections and deletes the document matching the user's UID from each collection in a batch. This aligns with the UID-keyed storage model used by the related DistInc microservices.

## Testing and Quality

- TypeScript is configured with `strict: true`.
- ESLint checks type-aware rules, imports, unused code, formatting, and selected security concerns.
- Jest currently covers shared array, number, and object helper behavior.
- GitHub Actions runs type checking, linting, and tests before deployment.
- Firebase-specific errors are mapped to clearer HTTP responses for common authentication failures.

Automated coverage currently focuses on utilities rather than account lifecycle endpoints or Firebase integration.

## Deployment

The service deploys as the `userService` Firebase HTTPS function. The GitHub Actions workflow uses Node.js 20.12.2 and Firebase CLI 13.7.2, then:

- deploys `dev` branch pushes to the `distinc-dev` Firebase project;
- deploys `prod` branch pushes to the `distinc-9ad9d` Firebase project;
- supplies the environment file and service-account credentials through repository secrets.

## Engineering Decisions

- Firebase Authentication remains the identity source, while Firestore stores application-specific user state under the same UID.
- Registration includes compensating cleanup to reduce partially created user records when a later step fails.
- Account deletion removes Firestore data before deleting the Auth record, retaining the UID needed for data cleanup.
- Batched Firestore deletion coordinates changes across all top-level collections with one commit.
- Firebase operations are isolated in focused helpers so endpoint handlers remain centered on validation and lifecycle flow.

## Known Limitations and Roadmap

- Add endpoint and Firestore integration tests; current tests cover only shared helpers.
- Add a sanitized `.env.example` and documented Firebase emulator configuration.
- Add rate limiting and operational alerting.
