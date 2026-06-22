import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["mn", "en"];
const defaultLocale = "mn";

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((l) => l.split(";")[0].trim().slice(0, 2))
      .find((l) => locales.includes(l));
    if (preferred) return preferred;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|.*\\..*).*)"],
};
