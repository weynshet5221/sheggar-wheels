# Sheggar Wheels

Sheggar Wheels is a peer-to-peer car rental marketplace frontend designed to connect people who want to rent cars with car owners who want to make their vehicles available for rental.

The project is developed using Next.js and React as a frontend capstone project. It demonstrates a car-rental experience with public car browsing, renter and owner dashboards, booking-related workflows, and administrative listing management.

## Project Objectives

- Build a responsive car-rental marketplace.
- Allow visitors to browse and search available vehicles.
- Provide separate experiences for renters, car owners, and administrators.
- Demonstrate car listing and booking management workflows.
- Practice modern React and Next.js development.
- Apply client-side state management and browser storage.
- Build an organized and reusable application structure.

## Main Features

### Public Marketplace
- Homepage with a car-rental search experience.
- Car listing and browsing pages.
- Individual car detail pages.
- Responsive navigation.
- Light and dark theme support.

### Renter Features
- Renter dashboard.
- Browse available cars.
- View car information.
- Manage favorite cars.
- Access renter-related booking features.

### Car Owner Features
- Owner dashboard.
- Manage car listings.
- Add and edit vehicle information.
- View owner-related listing and booking information.

### Administrator Features
- Admin dashboard.
- Review car listings.
- Approve or reject submitted listings.
- View individual listing details.
- Access administrative features.

### Additional Features
- Zustand for shared client-side state management.
- Leaflet for interactive map functionality.
- Recharts for data visualization where implemented.
- Lucide React icons.
- Responsive layouts for different screen sizes.
- CSS-based light and dark theme support.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Building user interfaces |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| Zustand | Shared client-side state |
| Leaflet | Interactive maps |
| Recharts | Data visualization |
| Lucide React | Icons |
| localStorage | Browser-side data persistence where used |
| sessionStorage | Temporary browser session data where used |

## Project Structure

```text
sheggar-wheels/
├── app/                 # Application routes and layouts
├── components/          # Reusable React components
├── lib/                 # Data helpers and application state
├── public/              # Static assets and car images
├── docs/                # Project documentation
├── README.md
└── package.json
```

## Getting Started

### Prerequisites

Install the following:

- Node.js
- npm
- Visual Studio Code or another code editor

### Installation

Clone the repository:

```bash
git clone https://github.com/weynshet5221/sheggar-wheels.git
```

Navigate into the project folder:

```bash
cd sheggar-wheels
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs the lint script if configured |

Refer to `package.json` for the exact scripts available in the project.

## Demo Accounts

Sheggar Wheels uses demonstration authentication rather than production identity verification.

Use the demonstration sign-in options available in the application.

If the application provides fixed demo accounts, add their exact details here:

- Renter: Add the displayed demo account.
- Car Owner: Add the displayed demo account.
- Administrator: Add the displayed demo account.

Do not use real passwords or personal account credentials.

## Deployment

Deployment platform: Vercel

Live application URL: Add the deployed Vercel URL here.

GitHub repository:

https://github.com/weynshet5221/sheggar-wheels

## Project Documentation

Additional technical documentation is available in the `docs/` folder.

- [AUTH.md](docs/AUTH.md) — Authentication and authorization.
- [STRATEGY.md](docs/STRATEGY.md) — Routing and rendering strategy.
- [DATA.md](docs/DATA.md) — Data management and browser storage.
- [BOUNDARY.md](docs/BOUNDARY.md) — Server and Client Component boundaries.
- [PERF.md](docs/PERF.md) — Performance testing and optimization.
- [FUTURE.md](docs/FUTURE.md) — Limitations and future improvements.

## Known Limitations

- The project is a frontend demonstration and does not use a production database.
- Browser storage is not a replacement for a centralized database.
- Demo authentication is not production-grade authentication.
- Real payment processing is not implemented.
- Browser-side data is not reliably synchronized between different users or devices.
- Production booking and listing workflows require backend validation and persistence.

## Author

Weynshet Kebede

Frontend Development Capstone Project
IBT-QIYAS Full-Stack Software Development Program