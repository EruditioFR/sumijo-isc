import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';

countries.registerLocale(enLocale);
countries.registerLocale(frLocale);

/**
 * Resolve a country display name (EN or FR) to an ISO alpha-2 code.
 */
export const countryNameToCode = (name: string): string | null => {
  if (!name) return null;
  const trimmed = name.trim();
  return (
    countries.getAlpha2Code(trimmed, 'en') ||
    countries.getAlpha2Code(trimmed, 'fr') ||
    null
  );
};

/**
 * Returns an SVG flag URL for a given country name (using country-flag-icons CDN-free assets).
 */
export const countryNameToFlagUrl = (name: string): string | null => {
  const code = countryNameToCode(name);
  if (!code) return null;
  // country-flag-icons ships SVG files; we use the unpkg-free local import via dynamic URL
  return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;
};
