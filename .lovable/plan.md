
# Plan d'implémentation de l'internationalisation

## Textes hardcodés identifiés

### 1. StatsSection.tsx (lignes 119-143, 182-184)
**Textes non traduits :**
- "Candidatures" → `stats.applications`
- "Pays représentés" → `stats.countries`
- "Jours de compétition" → `stats.days`
- "de prix" → `stats.prizes`
- "Un concours d'envergure internationale" → `stats.title`
- "Les chiffres de l'édition 2024" → `stats.subtitle`

### 2. VideoGallerySection.tsx (lignes 85-100, 127-132)
**Textes non traduits :**
- Filtres : "Tous", "Demi-finale", "Finale", "Gala"
- Titre : "Découvrez les performances de nos candidats"
- Sous-titre : "Lors de l'édition 2024"

### 3. HeroSection.tsx (ligne 102)
**Texte non traduit :**
- "du 5 au 11 juillet 2026" → `hero.eventDates`

### 4. ContactSection.tsx (lignes 23-27, 47, 139, 149, 152, 166, 169, 183, 186, 200, 203, 206, 207, 222)
**Textes non traduits :**
- Titre formulaire : "Contactez-nous"
- Labels : "Nom", "Email", "Sujet", "Message"
- Placeholders : "Votre nom", "votre@email.com", "Sujet de votre message", "Votre message..."
- Bouton : "Envoyer le message"
- Toast : "Votre message a été envoyé avec succès !"
- Messages de validation Zod (hardcodés en français)

### 5. WinnersSection.tsx (ligne 236)
**Texte non traduit :**
- Badge prix : "{winner.prize} Prix" (ex: "1er Prix")

### 6. TourSection.tsx (lignes 45, 74)
**Textes non traduits :**
- "Dates et lieux des concerts"
- "Cliquez pour agrandir"

### 7. PressSection.tsx (lignes 55, 62, 68, 73)
**Textes non traduits :**
- Badge : "Revue de presse"
- Titre : "La presse parle de nous"
- Description : "Les médias saluent l'excellence..."
- Lien : "Lire l'article"

---

## Modifications à effectuer

### Fichiers de traduction (4 fichiers)

#### Nouvelles clés à ajouter dans tous les fichiers :

```json
"stats": {
  "title": "Un concours d'envergure internationale",
  "subtitle": "Les chiffres de l'édition 2024",
  "applications": "Candidatures",
  "countries": "Pays représentés",
  "days": "Jours de compétition",
  "prizes": "de prix"
},
"videos": {
  "title": "Découvrez les performances de nos candidats",
  "subtitle": "Lors de l'édition 2024",
  "filters": {
    "all": "Tous",
    "semifinal": "Demi-finale",
    "final": "Finale",
    "gala": "Gala"
  }
},
"hero": {
  "eventDates": "du 5 au 11 juillet 2026"
},
"contact": {
  "formTitle": "Contactez-nous",
  "name": "Nom",
  "namePlaceholder": "Votre nom",
  "email": "Email",
  "emailPlaceholder": "votre@email.com",
  "subject": "Sujet",
  "subjectPlaceholder": "Sujet de votre message",
  "message": "Message",
  "messagePlaceholder": "Votre message...",
  "send": "Envoyer le message",
  "success": "Votre message a été envoyé avec succès !",
  "validation": {
    "nameMin": "Le nom doit contenir au moins 2 caractères",
    "emailInvalid": "Email invalide",
    "subjectMin": "Le sujet doit contenir au moins 3 caractères",
    "messageMin": "Le message doit contenir au moins 10 caractères"
  }
},
"winners": {
  "prizeLabel": "Prix"
},
"press": {
  "badge": "Revue de presse",
  "title": "La presse parle de nous",
  "description": "Les médias saluent l'excellence et le rayonnement international du concours",
  "readArticle": "Lire l'article"
}
```

Et mise à jour de `winners.tour` :
```json
"winners": {
  "tour": {
    "datesTitle": "Dates et lieux des concerts",
    "clickToEnlarge": "Cliquez pour agrandir"
  }
}
```

---

### Composants React (7 fichiers)

#### StatsSection.tsx
- Remplacer les labels hardcodés par `t('stats.applications')`, etc.
- Remplacer le titre par `t('stats.title')`
- Remplacer le sous-titre par `t('stats.subtitle')`

#### VideoGallerySection.tsx
- Remplacer les labels de filtres par des clés de traduction
- Remplacer le titre et sous-titre

#### HeroSection.tsx
- Remplacer "du 5 au 11 juillet 2026" par `t('hero.eventDates')`

#### ContactSection.tsx
- Utiliser les clés de traduction pour tous les labels, placeholders
- Créer un schéma de validation dynamique avec `t()` pour les messages d'erreur

#### WinnersSection.tsx
- Remplacer `{winner.prize} Prix` par `{winner.prize} {t('winners.prizeLabel')}`

#### TourSection.tsx
- Remplacer les textes hardcodés par les clés de traduction

#### PressSection.tsx
- Remplacer tous les textes hardcodés par les clés appropriées

---

## Traductions par langue

| Clé | FR | EN | KR | ZH |
|-----|----|----|----|----|
| stats.title | Un concours d'envergure internationale | An international competition | 국제적 규모의 대회 | 国际规模的比赛 |
| stats.subtitle | Les chiffres de l'édition 2024 | 2024 Edition figures | 2024년 에디션 수치 | 2024年赛事数据 |
| stats.applications | Candidatures | Applications | 지원 | 申请 |
| stats.countries | Pays représentés | Countries represented | 참가국 | 参赛国家 |
| stats.days | Jours de compétition | Competition days | 대회 일수 | 比赛天数 |
| stats.prizes | de prix | in prizes | 상금 | 奖金 |
| videos.title | Découvrez les performances de nos candidats | Discover our candidates' performances | 참가자들의 공연을 감상하세요 | 欣赏选手们的表演 |
| videos.subtitle | Lors de l'édition 2024 | From the 2024 edition | 2024년 에디션 | 2024年赛事 |
| videos.filters.all | Tous | All | 전체 | 全部 |
| videos.filters.semifinal | Demi-finale | Semi-final | 준결승 | 半决赛 |
| videos.filters.final | Finale | Final | 결승 | 决赛 |
| videos.filters.gala | Gala | Gala | 갈라 | 晚会 |
| hero.eventDates | du 5 au 11 juillet 2026 | July 5-11, 2026 | 2026년 7월 5-11일 | 2026年7月5日至11日 |
| contact.formTitle | Contactez-nous | Contact us | 문의하기 | 联系我们 |
| contact.name | Nom | Name | 이름 | 姓名 |
| contact.namePlaceholder | Votre nom | Your name | 이름을 입력하세요 | 您的姓名 |
| contact.email | Email | Email | 이메일 | 电子邮箱 |
| contact.emailPlaceholder | votre@email.com | your@email.com | your@email.com | your@email.com |
| contact.subject | Sujet | Subject | 제목 | 主题 |
| contact.subjectPlaceholder | Sujet de votre message | Subject of your message | 메시지 제목 | 消息主题 |
| contact.message | Message | Message | 메시지 | 消息 |
| contact.messagePlaceholder | Votre message... | Your message... | 메시지를 입력하세요... | 您的消息... |
| contact.send | Envoyer le message | Send message | 메시지 보내기 | 发送消息 |
| contact.success | Votre message a été envoyé avec succès ! | Your message has been sent successfully! | 메시지가 성공적으로 전송되었습니다! | 您的消息已成功发送！ |
| contact.validation.nameMin | Le nom doit contenir au moins 2 caractères | Name must be at least 2 characters | 이름은 2자 이상이어야 합니다 | 姓名至少需要2个字符 |
| contact.validation.emailInvalid | Email invalide | Invalid email | 유효하지 않은 이메일 | 无效的电子邮箱 |
| contact.validation.subjectMin | Le sujet doit contenir au moins 3 caractères | Subject must be at least 3 characters | 제목은 3자 이상이어야 합니다 | 主题至少需要3个字符 |
| contact.validation.messageMin | Le message doit contenir au moins 10 caractères | Message must be at least 10 characters | 메시지는 10자 이상이어야 합니다 | 消息至少需要10个字符 |
| winners.prizeLabel | Prix | Prize | 상 | 奖 |
| winners.tour.datesTitle | Dates et lieux des concerts | Concert dates and venues | 콘서트 일정 및 장소 | 音乐会日期和地点 |
| winners.tour.clickToEnlarge | Cliquez pour agrandir | Click to enlarge | 클릭하여 확대 | 点击放大 |
| press.badge | Revue de presse | Press review | 언론 보도 | 媒体报道 |
| press.title | La presse parle de nous | Press coverage | 언론이 우리를 말하다 | 媒体评价 |
| press.description | Les médias saluent l'excellence et le rayonnement international du concours | The media praise the excellence and international reach of the competition | 언론이 대회의 우수성과 국제적 영향력을 칭송합니다 | 媒体赞扬比赛的卓越性和国际影响力 |
| press.readArticle | Lire l'article | Read article | 기사 읽기 | 阅读文章 |

---

## Notes techniques

1. **Validation du formulaire Contact** : Le schéma Zod sera déplacé à l'intérieur du composant pour avoir accès à `t()`, ou les messages seront passés dynamiquement.

2. **Citations de presse** : Elles restent en français car ce sont des citations originales de médias francophones.

3. **Noms propres** : Conformément à la politique, "Sumi Jo", "Château de La Ferté-Imbault" et "SUMI JO INTERNATIONAL SINGING COMPETITION" ne sont jamais traduits.

---

## Résumé des modifications

- **4 fichiers de traduction** : ~35 nouvelles clés chacun
- **7 composants React** : Remplacement des textes hardcodés par `t('clé')`
- **Total** : ~140 nouvelles traductions
