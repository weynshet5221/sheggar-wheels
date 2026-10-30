# Recovery status and known limitations

This folder was reconstructed from the archived project folder, later replacement files, the photo-upload fix, and the code directly shared in the recent conversation.

## Applied recent fixes

- Car details accept local, browser-uploaded `data:image/...`, and HTTPS photos without requiring a Next Image remote-host configuration.
- Per-user favorites are stored by user ID; Favorites and heart buttons are only available while the active role is renter.
- The header's dashboard destination follows the active role and closes the mobile menu when resizing to desktop.
- The booking details page's Back to Dashboard link points to the correct role-specific dashboard.
- The review page uses Next.js promise-based dynamic route params and returns to `/renter/dashboard` after submission.
- Duplicate `app/(public)/page.js` was removed because `app/page.js` already owns `/`.

## Known unfinished or unverifiable parts

- The archived owner dashboard shows booking statuses but does not contain Start Rental / Mark Completed action buttons. `lib/bookings.js` supports those transitions, but the UI controls were not present in the recovered source, so they have not been invented in this recovery snapshot.
- The review route exists, but the archived review page contains hard-coded car/owner IDs and does not verify that the booking is completed or update the booking status to `reviewed`. This should be completed before presenting the end-to-end review workflow.
- The original JPG car images were absent. Placeholder SVGs are included so the site can render seeded listings. Replace them with original images if they are recovered.
- Root configuration files were absent from the uploaded folder archive and were reconstructed from the known project stack. If `npm install` reports unavailable versions, adjust the version in `package.json` to the installed version used in your course environment.
- The original browser localStorage/sessionStorage cannot be recovered from source files. The app will seed demo data in the new browser; photos uploaded to the damaged PC's browser storage are not included.
