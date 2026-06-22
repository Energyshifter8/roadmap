import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['mn', 'en'],
  defaultLocale: 'mn',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};