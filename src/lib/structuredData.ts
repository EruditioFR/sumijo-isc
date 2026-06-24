// Données structurées JSON-LD pour le SEO et GEO

const BASE_URL = 'https://www.sumijo-isc.com';

export interface FAQItem {
  question: string;
  answer: string;
}

// Organization schema
export const getOrganizationSchema = () => ({
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Association du Château de La Ferté-Imbault',
  alternateName: 'SUMI JO International Singing Competition',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo-sjisc.jpg`,
    width: 512,
    height: 512,
  },
  sameAs: [
    'https://www.instagram.com/sumijoisc',
    'https://www.youtube.com/@SumijoISC',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@aacfi.fr',
    contactType: 'customer service',
    availableLanguage: ['French', 'English', 'Korean', 'Chinese'],
  },
});

// MusicEvent schema for the competition
export const getEventSchema = () => ({
  '@type': 'MusicEvent',
  '@id': `${BASE_URL}/#event`,
  name: 'SUMI JO International Singing Competition 2026',
  description:
    'Concours international de chant lyrique présidé par Sumi Jo au Château de La Ferté-Imbault, Val de Loire, France.',
  startDate: '2026-07-05',
  endDate: '2026-07-11',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    '@id': `${BASE_URL}/#venue`,
    name: 'Château de La Ferté-Imbault',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Château de La Ferté-Imbault',
      addressLocality: 'La Ferté-Imbault',
      postalCode: '41300',
      addressRegion: 'Loir-et-Cher',
      addressCountry: 'FR',
    },
  },
  organizer: {
    '@id': `${BASE_URL}/#organization`,
  },
  performer: {
    '@type': 'Person',
    name: 'Sumi Jo',
    jobTitle: 'Présidente du Jury',
  },
  image: `${BASE_URL}/og-image.jpg`,
  offers: {
    '@type': 'Offer',
    url: `${BASE_URL}/billetterie`,
    availability: 'https://schema.org/PreOrder',
    validFrom: '2026-03-01',
    priceCurrency: 'EUR',
  },
});

// Person schema for Sumi Jo
export const getSumiJoSchema = () => ({
  '@type': 'Person',
  '@id': `${BASE_URL}/#sumi-jo`,
  name: 'Sumi Jo',
  givenName: 'Sumi',
  familyName: 'Jo',
  jobTitle: ['Soprano colorature', 'Présidente du Jury SJISC'],
  description:
    'Soprano colorature sud-coréenne de renommée mondiale, lauréate d\'un Grammy Award, avec plus de 40 ans de carrière internationale.',
  nationality: {
    '@type': 'Country',
    name: 'South Korea',
  },
  award: [
    'Grammy Award',
    'Chevalier de la Légion d\'Honneur',
    'Ordre du Mérite Culturel de Corée',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Accademia Nazionale di Santa Cecilia',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rome',
      addressCountry: 'IT',
    },
  },
  sameAs: [
    'https://en.wikipedia.org/wiki/Sumi_Jo',
    'https://www.instagram.com/sumijoisc',
  ],
  image: `${BASE_URL}/sumi-jo-portrait.jpg`,
});

// FAQPage schema
export const getFAQSchema = (faqItems: FAQItem[]) => ({
  '@type': 'FAQPage',
  '@id': `${BASE_URL}/#faq`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

// Place schema for Château
export const getChateauSchema = () => ({
  '@type': 'Place',
  '@id': `${BASE_URL}/#venue`,
  name: 'Château de La Ferté-Imbault',
  description:
    'Plus grand château en briques de Sologne, édifice millénaire au cœur du Val de Loire, France. Lieu d\'accueil du SUMI JO International Singing Competition.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Château de La Ferté-Imbault',
    addressLocality: 'La Ferté-Imbault',
    postalCode: '41300',
    addressRegion: 'Loir-et-Cher',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 47.3867,
    longitude: 1.9533,
  },
  image: `${BASE_URL}/chateau-drone.jpg`,
  containedInPlace: {
    '@type': 'AdministrativeArea',
    name: 'Val de Loire',
  },
});

// WebSite schema
export const getWebSiteSchema = () => ({
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'SUMI JO International Singing Competition',
  description:
    'Site officiel du concours international de chant lyrique Sumi Jo au Château de La Ferté-Imbault.',
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  inLanguage: ['fr', 'en', 'ko', 'zh'],
});

// Generate complete JSON-LD for a page
export const generateJsonLd = (schemas: object[]) => ({
  '@context': 'https://schema.org',
  '@graph': schemas,
});

// Default FAQ items in French
export const defaultFAQItems: FAQItem[] = [
  {
    question: 'Quand aura lieu le concours SUMI JO International Singing Competition 2026 ?',
    answer: 'Le concours se déroulera du 6 au 11 juillet 2026 au Château de La Ferté-Imbault, dans le Val de Loire, France.',
  },
  {
    question: 'Qui peut participer au concours ?',
    answer: 'Le concours est ouvert aux chanteurs lyriques de toutes nationalités, âgés de 18 à 35 ans, sans distinction de voix.',
  },
  {
    question: 'Où se déroule le concours ?',
    answer: 'Le concours a lieu au Château de La Ferté-Imbault, le plus grand château en briques de Sologne, un domaine millénaire situé en Val de Loire.',
  },
  {
    question: 'Quand la billetterie sera-t-elle ouverte ?',
    answer: 'L\'ouverture de la billetterie en ligne est prévue pour le 1er mars 2026.',
  },
  {
    question: 'Qui préside le jury du concours ?',
    answer: 'Le jury est présidé par Sumi Jo, soprano colorature de renommée mondiale, lauréate d\'un Grammy Award.',
  },
];
