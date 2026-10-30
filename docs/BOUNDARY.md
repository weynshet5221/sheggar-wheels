# Server and Client Component Boundaries

## 1. Overview

Sheggar Wheels uses the Next.js App Router, which supports both React Server Components and Client Components.

The application separates server-rendered content from browser-dependent interactions.

This separation is important because browser APIs are only available in the browser.

## 2. Server Components

Server Components are the default in the Next.js App Router.

They are appropriate for pages and components that do not require browser-only APIs or interactive client state.

Potential uses include:

- Page structure and content.
- Layouts that do not require client-side interaction.
- Server-rendered content.
- Metadata generation where supported.

Server Components cannot directly access browser APIs such as:

- `localStorage`
- `sessionStorage`
- `window`
- `document`

## 3. Client Components

Client Components use the `"use client"` directive.

They are required when components use client-side React hooks, browser APIs, or interactive event handlers.

In Sheggar Wheels, Client Components are used for browser-dependent features such as:

- Theme switching.
- Favorites and shared client-side state.
- Search and filtering.
- Interactive forms.
- Dashboard interactions.
- Browser storage.
- Interactive maps.
- Charts that depend on client-side data.

## 4. Examples from the Project

| Component or Feature | Client-Side Requirement |
|---|---|
| ThemeToggle | Updates the theme using browser document state |
| Zustand store usage | Reads and updates shared client-side state |
| Favorites | Uses interactive user-specific state |
| Search and filters | Responds to user input |
| Interactive maps | Requires browser rendering and map interaction |
| Dashboard controls | Respond to user actions |
| Forms | Handle input and submission interactions |

The actual component files determine where the `"use client"` directive is required.

## 5. Browser Storage Boundary

Browser storage can only be accessed in the browser.

For this reason:

- Components that read or write browser storage must execute on the client.
- Browser-dependent initialization should happen after the component mounts when necessary.
- Server Components must not assume that localStorage or sessionStorage is available.
- Shared state that depends on persisted browser data must account for initial hydration.

## 6. State Management Boundary

Zustand provides shared client-side state.

The application's store is located in:

```text
lib/store.js
```

Components that subscribe to the store must run as Client Components.

This allows different interactive components to access and update shared application state.

## 7. Third-Party Browser Libraries

Some libraries require browser APIs.

For example, Leaflet uses browser rendering capabilities and should be loaded in a client-compatible way.

Interactive map components should therefore be isolated from server-only rendering.

The same consideration applies to charts and other interactive visual components when they depend on client-side state or browser APIs.

## 8. Why Component Boundaries Matter

Separating Server and Client Components helps:

- Avoid browser API errors during server rendering.
- Keep interactive functionality in the browser.
- Organize application responsibilities.
- Reduce unnecessary client-side JavaScript where possible.
- Make the application easier to maintain.

## 9. Limitations

Because the application relies on browser-side demonstration data:

- Server Components cannot directly read persisted browser data.
- Client-side state is not a trusted security boundary.
- Browser data is not automatically shared across users or devices.
- Server-side authorization and database access are not provided by the current frontend data model.

## Conclusion

Sheggar Wheels uses Client Components for browser-dependent interactions and shared state, while Server Components remain suitable for content and layouts that do not require browser functionality. This boundary supports the Next.js App Router architecture and the frontend-only scope of the project.