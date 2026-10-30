# Authentication and Authorization

## 1. Overview

Sheggar Wheels demonstrates authentication and role-aware access for a frontend car-rental marketplace.

The application provides different user experiences for renters, car owners, and administrators.

Authentication in this project is intended for demonstration and learning purposes. It is not production-grade identity verification.

## 2. User Roles

The application supports three main role experiences.

| Role | Responsibilities |
|---|---|
| Renter | Browse cars, manage favorites, and access renter features |
| Car Owner | Manage car listings and access owner features |
| Administrator | Review and moderate car listings and access administrative features |

Each role has its own dashboard experience and navigation.

## 3. Demo Authentication

The application uses a demonstration sign-in flow to represent the currently signed-in user.

Authentication-related functionality is organized in the application's authentication utilities.

The project includes the `getCurrentSession()` authentication helper.

The demo session represents an application user; it does not verify a real-world identity.

No real passwords, payment credentials, or sensitive authentication secrets should be stored in browser storage.

## 4. Role-Based Access

Protected pages and actions should check the current demo user and the expected role.

Examples include:

- A renter accessing renter dashboard features.
- A car owner managing car listings.
- An administrator reviewing submitted listings.
- A user attempting to access a dashboard intended for another role.

Role-aware navigation helps users find the correct features. However, hiding a navigation link alone is not sufficient access control.

The corresponding action should also validate the user before modifying data.

## 5. Ownership Validation

Ownership validation is important for actions involving cars and bookings.

Examples include:

- A car owner should only edit their own car listing.
- A renter should only manage their own booking.
- A user should not be able to modify another user's records by changing an ID in the URL.

These checks are frontend guardrails for the demonstration application.

## 6. Safe Navigation

When a user is redirected to a sign-in page, the return destination should be an internal application route.

External URLs must not be accepted as safe post-sign-in destinations.

## 7. Negative Testing Checklist

The following tests should be performed and their actual results recorded.

| Test | Expected Result |
|---|---|
| Attempt a protected action while signed out | The action is rejected |
| Attempt to modify another user's booking | The action is rejected |
| Attempt to edit another owner's car | The action is rejected |
| Attempt to access an admin page as a renter | Access is denied or redirected |
| Provide an external return URL | The application does not redirect to the external website |

These tests demonstrate expected frontend behavior. They do not prove that the application is secure against a determined user.

## 8. Security Limitations

This project uses frontend demonstration authentication.

Browser storage and client-side state can be inspected and modified by users.

Therefore:

- Client-side role checks are not production security.
- Browser storage must not contain passwords or secrets.
- Users may manipulate client-side data.
- There is no trusted backend authorization layer for the demonstration data.
- Sensitive operations require server-side verification in a production application.

## 9. Production Improvements

A production version should include:

1. Secure user authentication.
2. Server-side session validation.
3. Server-side role and permission checks.
4. Database-level ownership validation.
5. Secure password handling if passwords are used.
6. Protection against unauthorized data modification.
7. Secure session expiration and logout handling.

## Conclusion

Sheggar Wheels demonstrates role-aware authentication and frontend access guardrails. These features support the capstone learning objectives but must be strengthened with trusted server-side security before the application is used as a real car-rental platform.