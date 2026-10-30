export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/owner', '/admin'],
    },
    sitemap: 'https://sheggarwheels.et/sitemap.xml',
  };
}