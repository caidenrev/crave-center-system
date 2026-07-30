import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'id'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  console.log('[i18n] raw requestLocale:', locale);

  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  console.log('[i18n] final resolved locale:', locale);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
