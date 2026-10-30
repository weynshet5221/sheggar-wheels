# Future Improvements and Development Plan

## 1. Overview

Sheggar Wheels is currently a frontend car-rental marketplace demonstration developed with Next.js and React.

The application demonstrates the main user experiences for renters, car owners, and administrators.

Future development will focus on moving the demonstration features toward a complete, secure, and production-ready car-rental platform.

## 2. Current Limitations

The current frontend implementation has the following limitations:

### No Centralized Database

The application uses browser-side data and client-side state rather than a production database.

Data is not automatically shared between different users or devices.

### Demonstration Authentication

The authentication experience is intended for demonstration purposes.

It does not provide production-grade identity verification or trusted server-side authorization.

### No Real Payment Processing

The application does not provide a real payment gateway.

Any checkout or payment-related experience is a demonstration rather than a real financial transaction.

### No Backend Real-Time Synchronization

Changes made in one user's browser are not automatically synchronized with other users through a backend real-time service.

### Frontend Validation

Client-side validation improves the user experience but cannot replace trusted backend validation.

## 3. Features to Develop in the Future

### 3.1 Backend and Database

Develop a backend API and connect the application to a centralized database.

The backend should manage:

- User accounts.
- Car listings.
- Booking records.
- Reviews.
- Disputes.
- Announcements.
- Administrative records.

### 3.2 Secure Authentication

Implement a secure authentication system with:

- User registration.
- User sign-in and sign-out.
- Secure session management.
- Password hashing where passwords are used.
- Server-side role verification.
- Ownership and permission checks.

### 3.3 Booking Management

Improve the booking system by introducing backend validation.

Future booking improvements should include:

- Real availability checking.
- Prevention of overlapping bookings.
- Reliable booking status transitions.
- Booking cancellation rules.
- Booking history.
- Server-side booking confirmation.

### 3.4 Payment Integration

Integrate a trusted payment provider to support real rental payments.

The backend should verify payment results and store transaction records securely.

### 3.5 Real-Time Notifications

Introduce backend-supported notifications for events such as:

- New booking requests.
- Booking approvals or rejections.
- Booking cancellations.
- Listing moderation updates.
- Dispute status changes.

Server-Sent Events or WebSockets could be considered for real-time updates.

### 3.6 Improved Maps and Location Services

Improve the map experience by connecting it to reliable location and availability data.

Future features could include:

- Accurate pickup and drop-off locations.
- Improved location search.
- Route information.
- Location-based car discovery.

### 3.7 Testing and Accessibility

Expand testing to cover:

- Authentication and access restrictions.
- Car listing management.
- Booking workflows.
- Data validation.
- Responsive layouts.
- Keyboard navigation.
- Screen reader accessibility.
- Performance on mobile devices.

## 4. Development Priorities

| Priority | Improvement | Purpose |
|---|---|---|
| High | Backend and database | Centralized and reliable data |
| High | Secure authentication | Protect user accounts |
| High | Server-side authorization | Protect user and platform data |
| High | Booking validation | Prevent invalid and conflicting bookings |
| Medium | Payment integration | Support real transactions |
| Medium | Notifications | Improve communication |
| Medium | Improved maps | Improve location-based features |
| Medium | Automated testing | Improve reliability |
| Low | Additional interface enhancements | Improve user experience |

## 5. Long-Term Goal

The long-term goal is to develop Sheggar Wheels into a complete peer-to-peer car-rental platform where:

- Car owners can publish and manage their vehicles.
- Renters can find and book available cars.
- Booking availability is checked reliably.
- Payments are processed securely.
- Users receive booking notifications.
- Administrators can manage platform activity.
- Data is stored and managed through a secure backend.

## Conclusion

Sheggar Wheels provides a frontend foundation for a peer-to-peer car-rental marketplace. Future development will focus on backend integration, database persistence, secure authentication, booking reliability, payment processing, and real-time communication.