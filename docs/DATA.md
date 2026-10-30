# Data Management and Storage

## 1. Overview

Sheggar Wheels is a frontend demonstration application. It uses JavaScript data structures, browser storage, and client-side state management instead of a production database.

The data layer is responsible for reading, updating, and maintaining the demonstration data used by the application.

## 2. Main Data Entities

The application is designed around the following marketplace entities:

| Entity | Purpose |
|---|---|
| User | Represents a renter, car owner, or administrator |
| Car | Stores vehicle and listing information |
| Booking | Represents a rental request and its status |
| Favorite | Represents a car saved by a user |
| Review | Represents feedback about a rental |
| Dispute | Represents a reported booking or rental issue |
| Announcement | Represents a platform announcement |

The exact fields for each entity are defined by the JavaScript objects and data helpers used in the application.

## 3. Browser Storage

The project uses browser-side persistence where implemented.

### localStorage

`localStorage` keeps data in the browser after the page is refreshed or the browser is reopened.

It is suitable for demonstration data that should remain available between visits.

### sessionStorage

`sessionStorage` stores temporary information for the current browser tab session.

It is suitable for temporary session information and short-lived interface state.

Passwords, payment credentials, and sensitive authentication secrets must not be stored in browser storage.

## 4. Zustand State Management

Zustand is used to manage shared client-side application state.

The main store is located at:

```text
lib/store.js
```

The current store includes:

- Theme preference.
- `favoritesByUser` for user-related favorite state.

The store uses Zustand persistence with browser storage.

The exact persisted storage key and configuration should be taken from `lib/store.js` rather than assumed in this document.

## 5. Data Access Layer

Application data helpers are organized in the `lib/` directory.

For example, the car data module provides functions used to retrieve and update car records.

Data helper functions centralize operations so that components do not need to duplicate the same data logic.

Examples of data operations include:

- Retrieving car records.
- Retrieving booking records where supported.
- Saving or updating car listings.
- Updating listing moderation status.
- Reading application data for dashboard pages.

The exact functions available depend on the current implementation in the `lib/` directory.

## 6. Data Validation

Before changing a record, the application should verify:

1. The record exists.
2. The current user is allowed to perform the operation.
3. The user owns the record when ownership is required.
4. The record is in a valid state for the requested operation.
5. Required form fields contain valid values.

Invalid operations should be rejected rather than silently changing data.

## 7. Data Recovery

Browser storage can be missing, unavailable, or contain invalid data.

The application should handle these situations safely.

Recommended recovery behavior includes:

- Use safe defaults when optional data is missing.
- Handle malformed stored JSON without crashing the application.
- Display useful error messages when data cannot be loaded.
- Avoid overwriting existing user data during initialization.
- Provide a controlled way to restore demonstration data when necessary.

## 8. Data Limitations

Browser storage is not a database.

It has several limitations:

- Data is stored locally in the user's browser.
- Different users do not share a centralized data source.
- Data can be manually modified or deleted.
- Data is not automatically backed up.
- Browser storage does not provide reliable multi-user synchronization.
- It cannot guarantee transaction consistency across different users.

## 9. Future Database Design

A production version should use a backend API and a centralized database.

The backend should manage users, cars, bookings, reviews, disputes, and announcements.

It should also validate ownership, availability, and booking state before saving changes.

## Conclusion

The current data strategy demonstrates frontend data modeling, client-side state management, and browser persistence. A production version requires a centralized database and trusted backend validation.