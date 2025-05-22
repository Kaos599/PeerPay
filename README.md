# PeerPay - Blockchain Transactions

This project is a modern React frontend application designed to interact with and visualize a blockchain. It allows users to view existing blocks and add new transactions.

## Features 

*   **View Blocks:** Displays a list of blockchain blocks with details like timestamp, hash, and transaction count.
*   **Add Transactions:** A form to submit new transactions (sender, recipient, amount) to be mined.
*   **Real-time Updates:** Block list automatically polls for new blocks.
*   **Form Validation:** Transaction form uses Zod for robust validation.
*   **User Feedback:** Toast notifications for transaction mining success or failure.
*   **Modern UI:** Built with Chakra UI for a responsive and accessible design.
*   **Light/Dark Mode:** Theme toggling support.
*   **Animations:** Subtle animations using Framer Motion.

## Tech Stack

*   **Framework:** React 18+
*   **Build Tool:** Vite
*   **UI Library:** Chakra UI
*   **State Management/Data Fetching:** TanStack Query (React Query) v5
*   **Form Handling:** React Hook Form
*   **Schema Validation:** Zod
*   **Animation:** Framer Motion
*   **Icons:** Lucide React
*   **Styling:** Emotion (via Chakra UI)

## Project Structure (Frontend)

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable React components (Header, Footer, BlockCard, etc.)
│   ├── hooks/         # Custom React hooks (e.g., useBlocks)
│   ├── services/      # API interaction logic (e.g., blockchain.js)
│   ├── styles/        # Global styles or theme overrides (if needed)
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── .eslintrc.cjs    # ESLint configuration
├── .gitignore       # Git ignore file
├── index.html       # Main HTML template
├── package.json     # Project dependencies and scripts
├── vite.config.js   # Vite configuration
└── README.md        # This README file
```

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

### Running the Development Server

```bash
npm run dev
# or
# yarn dev
# or
# pnpm dev
```

This will start the Vite development server, typically available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
# or
# yarn build
# or
# pnpm build
```

This command bundles the application into the `frontend/dist` directory, optimized for deployment.

## Backend Requirement

This frontend application expects a backend service to provide blockchain data and handle transaction submissions. The API endpoints are currently configured in `frontend/src/services/blockchain.js`. Ensure a compatible backend is running and accessible.

## Author

*   Harsh Dayal (22BCE10564)

## License

This project is currently unlicensed. Consider adding an open-source license like MIT if you plan to share it. 
