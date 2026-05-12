import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';

countries.registerLocale(enLocale);
countries.registerLocale(frLocale);

/**
 * Convert an ISO 3166-1 alpha-2 country code to its emoji flag.
 */
export const codeToFlagEmoji = (code: string): string => {
  if (!code || code.length !== 2) return '';
  const upper = code.toUpperCase();
  const A = 0x1f1e6;
  return String.fromCodePoint(
    A + (upper.charCodeAt(0) - 65),
    A + (upper.charCodeAt(1) - 65),
  );
};

/**
 * Resolve a country display name (EN or FR) to an ISO alpha-2 code.
 */
export const countryNameToCode = (name: string): string | null => {
  if (!name) return null;
  return (
    countries.getAlpha2Code(name, 'en') ||
    countries.getAlpha2Code(name, 'fr') ||
    null
  );
};

export const countryNameToFlag = (name: string): string => {
  const code = countryNameToCode(name);
  return code ? codeToFlagEmoji(code) : '';
};
