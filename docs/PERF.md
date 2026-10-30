# Performance Testing and Optimization

## 1. Overview

Performance is important for providing a smooth experience when browsing cars and using the Sheggar Wheels application.

The project uses Next.js and React and applies frontend optimization techniques where appropriate.

This document records the performance testing approach and the optimization work carried out on the application.

## 2. Performance Goals

The main performance goals are:

- Fast initial page loading.
- Responsive navigation and interactions.
- Efficient loading of car images.
- Smooth page transitions.
- Reduced unnecessary client-side JavaScript.
- Stable layouts during loading.
- Good performance on desktop and mobile devices.

## 3. Optimization Techniques

### Next.js Production Build

The application should be tested using a production build rather than relying only on the development server.

Run:

```bash
npm run build
```

This checks whether Next.js can compile the application for production.

### Image Optimization

Car images are important to the marketplace experience.

Image optimization should focus on:

- Using appropriately sized images.
- Avoiding unnecessarily large image files.
- Preventing images from being stretched or cropped incorrectly.
- Loading images efficiently.
- Using Next.js image optimization where applicable.

### Dynamic Imports

Dynamic imports can help avoid loading certain components until they are needed.

This is useful for browser-heavy components such as interactive maps when they are not required immediately on the initial page.

### Client-Side JavaScript

Client Components are used when browser interactions are necessary.

Unnecessary client-side code should be avoided to reduce JavaScript loading and execution.

### Responsive Layouts

The interface should adapt to different screen sizes.

Responsive layouts help prevent horizontal scrolling and improve usability on mobile devices.

## 4. Performance Measurement

Lighthouse should be used to measure the deployed production application.

Record the actual results in the table below after testing.

| Metric | Result |
|---|---|
| Performance | 91 |
| Accessibility |95 |
| Best Practices | 100|
| SEO | 92|
| Largest Contentful Paint (LCP) | 1.4s |
| Cumulative Layout Shift (CLS) | 0 |
|

## 5. Before and After Comparison

When an optimization is made, compare the results before and after the change.

| Measurement | Before Optimization | After Optimization |
|---|---|---|
| Performance score | 70 | 91 |
| LCP | 1.9| 1.4 |
| CLS | 0| 0 |


If a metric was not measured, mark it as Not measured.

## 6. Future Optimization Work

Possible improvements include:

- Further image compression and sizing.
- Reducing unnecessary JavaScript.
- Reviewing large client components.
- Improving loading behavior for maps and charts.
- Testing performance on slower mobile devices.
- Reducing layout shifts.
- Reviewing font loading and asset delivery.

## Conclusion

Performance testing helps identify areas where the application can be improved. Lighthouse measurements should be taken from the deployed production build and recorded here so that optimization decisions are based on actual results.