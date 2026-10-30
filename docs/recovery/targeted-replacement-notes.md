# Sheggar Wheels targeted replacements

These files are replacements for the same relative paths in the project.

## Apply
1. Make a backup or commit your current working version.
2. Copy the folders in this archive into the project root and choose **Replace** for matching files.
3. Do not replace files that are not listed here.
4. Restart the development server after replacing files:
   - Stop it with `Ctrl+C`
   - Run `npm run dev`

## Important route correction
The project contains both `app/page.js` and `app/(public)/page.js`. Both map to `/` because route-group folder names in parentheses are omitted from URLs. Next.js does not allow two pages for the same route. Keep `app/page.js` (the main Sheggar Wheels homepage) and delete `app/(public)/page.js` if that duplicate file is still present.

## Car photo paths
The seed data refers to `/images/cars/*.jpg`. Those image files were not included in the uploaded ZIP, so this package cannot verify whether each file exists in your local `public/images/cars/` folder. Confirm that the filenames match exactly, including capitalization. `CarCard.js` now uses each car's own `photos[0]` instead of the nonexistent `car.type`, which was causing every card to fall back to the same sedan image.

## Route map used by these replacements
- Catalogue: `/cars`
- Car details: `/cars/[id]`
- Sign-in: `/signin`
- Renter dashboard: `/renter/dashboard`
- Renter booking history: `/bookings`
- Mock checkout: `/renter/checkout`
- Owner dashboard: `/owner/dashboard`
- Owner booking requests: `/owner`
- Owner car listings: `/owner/cars`
- Admin dashboard: `/admin/dashboard`

## Notes
- Browser storage is editable by the user. These are frontend demo checks, not production authentication or authorization.
- The mock checkout never contacts TeleBirr and does not collect payment credentials.
- After applying, run `npm run build` and test sign-in, catalogue images, booking, owner approval/decline, and admin listing moderation.
