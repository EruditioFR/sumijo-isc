
# Plan d'internationalisation complète du site

## Objectif
S'assurer que toutes les sections du site sont entièrement traduites dans les 4 langues supportées (FR, EN, KR, ZH).

## Sections identifiées avec du texte hardcodé

### 1. Section Statistiques (`StatsSection.tsx`)
**Textes à internationaliser :**
- Labels des statistiques : "Candidatures", "Pays représentés", "Jours de compétition", "de prix"
- Titre : "Un concours d'envergure internationale"
- Sous-titre : "Les chiffres de l'édition 2024"

**Clés de traduction à ajouter :**
```
stats.title
stats.subtitle
stats.applications
stats.countries
stats.days
stats.prizes
```

### 2. Section Galerie Vidéo (`VideoGallerySection.tsx`)
**Textes à internationaliser :**
- Titre : "Découvrez les performances de nos candidats"
- Sous-titre : "Lors de l'édition 2024"
- Filtres : "Tous", "Demi-finale", "Finale", "Gala"

**Clés de traduction à ajouter :**
```
videos.title
videos.subtitle
videos.filters.all
videos.filters.semifinal
videos.filters.final
videos.filters.gala
```

### 3. Section Presse (`PressSection.tsx`)
**Textes à internationaliser :**
- Badge : "Revue de presse"
- Titre : "La presse parle de nous"
- Description : "Les médias saluent l'excellence..."
- Lien : "Lire l'article"

**Clés de traduction à ajouter :**
```
press.badge
press.title
press.description
press.readArticle
```

### 4. Section Tournée (`TourSection.tsx`)
**Textes à internationaliser :**
- Titre : "Dates et lieux des concerts"
- Infobulle : "Cliquez pour agrandir"
- Dates au format localisé

**Clés de traduction à ajouter :**
```
winners.tour.datesTitle
winners.tour.clickToEnlarge
```

### 5. Section Hero (`HeroSection.tsx`)
**Texte à internationaliser :**
- Date de l'événement : "du 5 au 11 juillet 2026"

**Clé de traduction à ajouter :**
```
hero.eventDates
```

### 6. Section Contact (`ContactSection.tsx`)
**Textes à internationaliser :**
- Titre du formulaire : "Contactez-nous"
- Labels : "Nom", "Email", "Sujet", "Message"
- Placeholders : "Votre nom", "votre@email.com", "Sujet de votre message", "Votre message..."
- Bouton : "Envoyer le message"
- Messages de validation et toast

**Clés de traduction à ajouter :**
```
contact.formTitle
contact.name
contact.namePlaceholder
contact.email
contact.emailPlaceholder
contact.subject
contact.subjectPlaceholder
contact.message
contact.messagePlaceholder
contact.send
contact.success
contact.validation.nameMin
contact.validation.emailInvalid
contact.validation.subjectMin
contact.validation.messageMin
```

### 7. Section Lauréats (`WinnersSection.tsx`)
**Textes à internationaliser :**
- Labels des prix : "1er", "2ème", "3ème", "Prix"

**Clés de traduction à ajouter :**
```
winners.firstPrize
winners.secondPrize
winners.thirdPrize
winners.prizeLabel
```

## Fichiers à modifier

### Fichiers de traduction (4 fichiers)
- `src/i18n/locales/fr.json`
- `src/i18n/locales/en.json`
- `src/i18n/locales/kr.json`
- `src/i18n/locales/zh.json`

### Composants React (7 fichiers)
- `src/components/StatsSection.tsx`
- `src/components/VideoGallerySection.tsx`
- `src/components/PressSection.tsx`
- `src/components/TourSection.tsx`
- `src/components/HeroSection.tsx`
- `src/components/ContactSection.tsx`
- `src/components/WinnersSection.tsx`

## Traductions prévues

| Clé | FR | EN | KR | ZH |
|-----|----|----|----|----|
| stats.title | Un concours d'envergure | An international competition | 국제적 규모의 대회 | 国际规模的比赛 |
| stats.subtitle | Les chiffres de l'édition 2024 | 2024 Edition figures | 2024년 에디션 수치 | 2024年赛事数据 |
| videos.title | Découvrez les performances | Discover the performances | 공연 영상 감상 | 欣赏演出 |
| press.title | La presse parle de nous | Press coverage | 언론 보도 | 媒体报道 |
| hero.eventDates | du 5 au 11 juillet 2026 | July 5-11, 2026 | 2026년 7월 5-11일 | 2026年7月5日至11日 |
| contact.send | Envoyer le message | Send message | 메시지 보내기 | 发送消息 |

## Notes techniques

1. **Dates localisées** : Pour la section Tournée, les dates seront formatées via la bibliothèque `date-fns` avec les locales appropriées.

2. **Citations de presse** : Les citations de la presse restent en français dans toutes les versions car ce sont des citations originales de médias français.

3. **Noms propres** : Conformément à la politique du projet, les noms "Sumi Jo", "Château de La Ferté-Imbault" et "SUMI JO INTERNATIONAL SINGING COMPETITION" ne sont jamais traduits.

## Estimation
- Environ 50 nouvelles clés de traduction à ajouter
- 7 composants React à modifier
- 4 fichiers de traduction à mettre à jour
