# Routing and Rendering Strategy

## 1. Overview

Sheggar Wheels uses the Next.js App Router to organize application pages, layouts, and navigation.

The application uses route groups to organize public pages and role-specific dashboard areas.

Rendering decisions depend on whether a page requires browser functionality, interactive state, or server-rendered content.

## 2. Route Organization

The application organizes its pages into the following areas:

| Route Group | Purpose |
|---|---|
| `(public)` | Public marketplace pages |
| `(renter)` | Renter dashboard and features |
| `(owner)` | Owner dashboard and car management |
| `(admin)` | Administrative dashboard and management |

Route groups organize related routes without adding the group name to the URL.

## 3. Main Route Types

### Public Routes

Public routes provide marketplace information and allow visitors to explore cars.

Examples include:

- `/` — Homepage.
- `/public/cars` — Car listing page.
- `/public/cars/[id]` — Individual car detail page.

### Renter Routes

Renter routes provide access to renter-related dashboard features and activities.

### Owner Routes

Owner routes provide access to car listing management and owner dashboard features.

Examples include:

- `/owner/cars`
- `/owner/cars/[id]/edit`

### Administrator Routes

Administrator routes provide access to administrative tools.

Examples include:

- `/admin/listings`
- `/admin/listings/[id]`

The route examples above describe the application organization. The actual route folders in `app/` define the final available URLs.

## 4. Dynamic Routes

Dynamic routes display information based on a record identifier.

For example:

- `/public/cars/[id]` displays a selected car.
- `/owner/cars/[id]/edit` provides an editing page for a selected car.
- `/admin/listings/[id]` displays an individual listing for administrative review.

The dynamic route parameter identifies the record to load.

## 5. Rendering Strategy

### Client Components

Client Components are used when a page requires browser functionality or interactive state.

Examples include:

- Search and filtering.
- Interactive forms.
- Theme switching.
- Favorites.
- Dashboard interactions.
- Browser storage.
- Interactive maps.
- Client-side charts.

### Server Components

Server Components are the default in the Next.js App Router.

They are appropriate for content and layouts that do not require browser-only APIs or client-side interaction.

However, Server Components cannot directly read `localStorage` or `sessionStorage`.

Pages that depend on browser-stored data must load that data on the client.

## 6. Data Loading

The application uses JavaScript data helpers and shared client-side state to read and update demonstration data.

Zustand is used for shared application state.

Components that depend on browser storage should initialize their data after the browser environment is available.

This helps avoid accessing browser-only APIs during server rendering.

## 7. Navigation and Access

The application separates public navigation from role-specific dashboard navigation.

Frontend access checks are used for protected dashboard experiences.

These checks improve the user experience but do not replace server-side authorization.

## 8. Why This Strategy?

This strategy was selected because:

- The project is a frontend-focused capstone.
- Route groups help organize different user experiences.
- Dynamic routes support individual car and listing pages.
- Client Components support interactive browser features.
- Server Components remain available for content that does not need browser functionality.
- Reusable layouts and components reduce duplicated code.

## 9. Limitations

Because the project uses browser-side demonstration data:

- Server Components cannot directly access browser storage.
- Browser data is not a centralized shared data source.
- Client-side changes are not automatically synchronized between different users.
- Production data loading and authorization require backend services.

## Conclusion

The routing and rendering strategy organizes public pages and role-specific dashboards while using Client Components for browser-dependent interactions and Server Components where appropriate.