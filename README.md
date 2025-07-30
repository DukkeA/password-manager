# Web3 Password Manager

A decentralized password manager built with Next.js 15, Prisma ORM, PostgreSQL, and Web3 wallet integration. This application allows users to securely store encrypted passwords using their crypto wallet for authentication and encryption key derivation.

## Features

- 🔐 **Client-side AES-GCM encryption** - Passwords are encrypted before being stored
- 🦊 **Polkadot.js wallet integration** - Connect with Talisman, Polkadot.js Extension
- 🗄️ **PostgreSQL database** - Secure storage with Prisma ORM
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- 📱 **Responsive design** - Works on desktop and mobile devices
- ⚡ **Real-time updates** - React Query for efficient state management

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide React icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Web3**: Polkadot.js Extension integration
- **State Management**: Zustand, React Query
- **Form Handling**: React Hook Form with Zod validation
- **Encryption**: Web Crypto API (AES-GCM)

## Getting started

### 1. Clone and setup the project

Clone this repository:

```bash
git clone https://github.com/DukkeA/password-manager.git
cd password-manager
```

Install dependencies:

```bash
npm install
```

### 2. Database Setup

Create a new [Prisma Postgres](https://www.prisma.io/docs/postgres/overview) database:

```bash
npx prisma init --db
```

Follow the CLI prompts to:
1. Select your preferred region
2. Enter a project name (e.g., "password-manager")

Copy the provided database URL and create a `.env` file:

```bash
# .env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=ey...
```

Run the database migrations to create the `PasswordEntry` table:

```bash
npx prisma migrate dev --name init
```

### 3. Install Required Browser Extension

Install one of the following wallet extensions:
- [Talisman Wallet](https://talisman.xyz/)
- [Polkadot.js Extension](https://polkadot.js.org/extension/)

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Wallet Connection**: Users connect their Polkadot-compatible wallet
2. **Message Signing**: The app requests the wallet to sign a deterministic message
3. **Key Derivation**: A cryptographic key is derived from the wallet signature
4. **Encryption**: Passwords are encrypted client-side using AES-GCM before storage
5. **Secure Storage**: Only encrypted data is stored in the PostgreSQL database

## Database Schema

The application uses a single `PasswordEntry` model:

```prisma
model PasswordEntry {
  id           String   @id @default(uuid())
  title        String
  username     String
  url          String
  notes        String?
  ciphertext   String   // Encrypted password
  iv           String   // Initialization vector
  ownerAddress String   // Wallet address
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Security Features

- **Client-side encryption**: Passwords never leave the browser unencrypted
- **Wallet-based authentication**: No traditional passwords or accounts needed
- **Per-user isolation**: Users can only access their own encrypted data
- **Initialization vectors**: Each encryption uses a unique IV for security

## Known Issues

⚠️ **Critical Issue - Non-Deterministic Signatures**: 

The current implementation has a fundamental flaw where wallet signatures are non-deterministic. This means:

- The same message signed multiple times produces different signatures
- Encryption keys derived from signatures are inconsistent
- Users cannot decrypt previously stored passwords
- This breaks the core functionality of the password manager

**Potential Solutions Being Researched**:
- Implement master password + wallet address combination
- Use deterministic key derivation with wallet's extended public keys  
- Hybrid approach combining wallet authentication with user-provided encryption keys

## API Endpoints

### POST `/api/passwords`
Create a new encrypted password entry.

**Request Body**:
```json
{
  "title": "string",
  "username": "string", 
  "url": "string",
  "notes": "string (optional)",
  "ciphertext": "string",
  "iv": "string",
  "ownerAddress": "string"
}
```

### GET `/api/passwords?ownerAddress=<address>`
Retrieve all password entries for a specific wallet address.

## Development

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
