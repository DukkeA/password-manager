# Web3 Password Manager

A secure, decentralized password manager built with Next.js 15, Prisma ORM, PostgreSQL, and Web3 wallet integration. This application combines Web3 authentication with master password-based encryption to provide a robust and user-friendly password management solution.

## Features

- 🔐 **Master Password Encryption** - PBKDF2-derived AES-GCM encryption with 100k iterations
- 🦊 **Web3 Authentication** - Wallet-based login with Polkadot.js Extension support
- 🔑 **JWT Security** - Secure API access with wallet signature verification
- 🗄️ **PostgreSQL database** - Encrypted storage with Prisma ORM
- ⚡ **Real-time updates** - React Query for efficient state management
- 🛡️ **Zero-knowledge architecture** - Server never sees plaintext passwords

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide React icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Web3**: Polkadot.js Extension integration, JWT authentication
- **State Management**: Zustand, React Query
- **Form Handling**: React Hook Form with Zod validation
- **Encryption**: Web Crypto API (AES-GCM, PBKDF2)

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

### 2. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/password_manager"

# JWT Secret for authentication (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-key-here"
```

### 3. Database Setup

Create a new [Prisma Postgres](https://www.prisma.io/docs/postgres/overview) database or set up a local PostgreSQL instance.

Init Prisma:
```bash
npx prisma init
```

Run the database migrations to create the `PasswordEntry` table:

```bash
npx prisma migrate dev --name init
```

### 4. Install Required Browser Extension

Install one of the following wallet extensions:
- [Talisman Wallet](https://talisman.xyz/)
- [Polkadot.js Extension](https://polkadot.js.org/extension/)

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

The application uses a hybrid approach combining Web3 authentication with master password-based encryption:

### Authentication Flow
1. **Wallet Connection**: Users connect their Polkadot-compatible wallet
2. **Signature Authentication**: The app requests the wallet to sign a verification message
3. **JWT Token**: A secure JWT token is issued for API access

### Encryption Flow
1. **Master Password**: Users provide a master password (never sent to server)
2. **Key Derivation**: PBKDF2 derives a 256-bit AES key from the master password (100,000 iterations)
3. **Client-side Encryption**: Passwords are encrypted using AES-GCM before transmission
4. **Secure Storage**: Only encrypted data and unique initialization vectors are stored
5. **Decryption**: Master password re-derives the same key to decrypt stored passwords

### Security Architecture
- **Zero-knowledge**: Server never sees master passwords or plaintext data
- **Per-user isolation**: Each wallet address maintains separate encrypted vaults
- **Deterministic encryption**: Same master password always generates same decryption key
- **Authenticated encryption**: AES-GCM provides both confidentiality and integrity

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

- **Client-side encryption**: All passwords encrypted in browser before transmission
- **Master password-based keys**: PBKDF2 with 100,000 iterations for robust key derivation
- **Web3 authentication**: Wallet signature verification for secure access control
- **JWT authorization**: Token-based API security with expiration handling
- **Unique initialization vectors**: Each password entry uses cryptographically secure random IVs
- **Zero-knowledge architecture**: Server has no access to plaintext passwords or master passwords
- **Per-user data isolation**: Wallet addresses provide natural user boundaries
- **Authenticated encryption**: AES-GCM prevents tampering and ensures data integrity

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Authenticate with wallet signature and receive JWT token.

**Request Body**:
```json
{
  "address": "wallet_address",
  "signature": "signed_message_hex"
}
```

**Response**:
```json
{
  "token": "jwt_token"
}
```

### Password Management

#### POST `/api/passwords`
Create a new encrypted password entry. Requires JWT authentication.

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "title": "string",
  "username": "string", 
  "url": "string",
  "notes": "string (optional)",
  "ciphertext": "string (base64 encrypted password)",
  "iv": "string (base64 initialization vector)"
}
```

#### GET `/api/passwords`
Retrieve all password entries for the authenticated user.

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "string",
    "username": "string",
    "url": "string", 
    "notes": "string",
    "ciphertext": "string",
    "iv": "string",
    "ownerAddress": "string",
    "createdAt": "ISO_date",
    "updatedAt": "ISO_date"
  }
]
```

## Usage Guide

### First Time Setup
1. **Connect Wallet**: Click "Login with Wallet" and select your Polkadot-compatible account
2. **Sign Authentication**: Approve the signature request to verify wallet ownership
3. **Set Master Password**: Enter a strong master password when prompted (this encrypts your data)
4. **Start Adding Passwords**: Use the form to securely store your passwords

### Daily Usage
1. **Connect & Authenticate**: Connect your wallet and sign the authentication message
2. **Enter Master Password**: Provide your master password to decrypt stored data
3. **Manage Passwords**: View, copy, or add new password entries
4. **Secure Logout**: Simply close the browser or switch accounts to clear the master password

### Security Best Practices
- **Strong Master Password**: Use a unique, complex master password you can remember
- **Wallet Security**: Keep your wallet extension secure and updated
- **Regular Backups**: Consider backing up your master password securely
- **Account Switching**: Master password is automatically cleared when switching wallet accounts

## Encryption Details

### Key Derivation Process
```typescript
// PBKDF2 with 100,000 iterations
const key = await crypto.subtle.deriveKey({
  name: "PBKDF2",
  salt: staticSalt + walletAddress,
  iterations: 100_000,
  hash: "SHA-256"
}, masterPasswordKey, {
  name: "AES-GCM",
  length: 256
}, false, ["encrypt", "decrypt"]);
```

### Encryption Process
```typescript
// AES-GCM with random IV per entry
const iv = crypto.getRandomValues(new Uint8Array(12));
const encrypted = await crypto.subtle.encrypt({
  name: "AES-GCM",
  iv: iv
}, derivedKey, passwordBytes);
```

## Development

### Development Commands

#### View Database
```bash
npx prisma studio
```

#### Reset Database
```bash
npx prisma migrate reset
```

#### Generate Prisma Client
```bash
npx prisma generate
```

### Project Structure
```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── passwords/    # Password management endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── account-dropdown.tsx
│   ├── password-creation-form.tsx
│   ├── passwords-table.tsx
│   └── wallet-login-button.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── crypto/           # Encryption utilities
│   ├── stores/           # State management
│   └── middleware/       # API middleware
├── prisma/               # Database schema and migrations
└── types/                # TypeScript type definitions
```

### Environment Variables
```bash
# Required
DATABASE_URL="postgresql://..."  # Database connection
JWT_SECRET="secure-secret-key"   # JWT signing secret
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
