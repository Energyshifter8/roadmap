import { getRequestConfig } from 'next-intl/server';

const messageImports = {
  en: () => import('../messages/en.json'),
  mn: () => import('../messages/mn.json'),
} as const;

type SupportedLocale = keyof typeof messageImports;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: SupportedLocale =
    requested && requested in messageImports
      ? (requested as SupportedLocale)
      : 'mn';

  return {
    locale,
    messages: (await messageImports[locale]()).default,
  };
});