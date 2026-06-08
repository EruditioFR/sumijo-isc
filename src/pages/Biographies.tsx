import { useEffect, Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, User, Ticket } from 'lucide-react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import posterAsset from '@/assets/concert-cortot-poster.png.asset.json';
import sumiJoPortrait from '@/assets/sumi-jo-bio-portrait.jpg.asset.json';

const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

interface Artist {
  name: string;
  role: string;
  bio: string;
  fullBio?: string[];
  photo?: string;
}

const artists: Artist[] = [
  {
    name: 'Sumi Jo',
    role: 'Soprano colorature — Présidente du jury',
    bio: "Icône internationale de l'opéra, Sumi Jo incarne l'excellence vocale et la passion artistique depuis quatre décennies. Lauréate d'un Grammy Award, surnommée « La Voix venue du Ciel » par Herbert von Karajan, elle s'est imposée comme l'une des sopranos les plus accomplies de notre époque avec plus de 50 albums à son actif.",
    fullBio: [
      "Originaire de Corée du Sud, Sumi Jo s'est imposée comme l'une des sopranos les plus accomplies de notre époque. Sa carrière, d'une richesse exceptionnelle, est saluée par la critique et le public pour la musicalité remarquable de sa voix, son agilité, sa précision et la pureté unique de son timbre. Elle est aujourd'hui l'une des artistes classiques ayant vendu le plus d'albums dans l'histoire de la musique, avec plus de 50 enregistrements à son actif, dont plusieurs disques de platine.",
      "Après des études initiales en Corée, Sumi Jo a perfectionné son art au Conservatorio dell'Accademia di Santa Cecilia à Rome, dont elle est sortie diplômée avec les honneurs en 1986. Son ascension fulgurante a été marquée par le prix international Puccini, des premiers prix dans les plus prestigieux concours internationaux, une collaboration privilégiée avec le chef d'orchestre du siècle Herbert von Karajan, qui l'a surnommée « La voix venue du ciel », et un Grammy Award pour son enregistrement de Die Frau ohne Schatten sous la direction de Sir Georg Solti.",
      "Sumi Jo a foulé les scènes des plus grands opéras du monde, interprétant des rôles iconiques du répertoire lyrique : Lucia di Lammermoor, Gilda (Rigoletto) et Olympia (Les Contes d'Hoffmann) au Metropolitan Opera de New York ; des rôles de bel canto tels que Le Comte Ory ou Fra Diavolo à La Scala de Milan ; ses débuts mémorables en Reine de la Nuit (La Flûte enchantée) et Zerbinetta à la Wiener Staatsoper ; Olympia à l'Opéra de Paris. Son répertoire s'étend de Mozart et Rossini à Donizetti, Bellini, Strauss et Gounod, incluant même des œuvres contemporaines comme Nixon in China.",
      "La diversité de son talent s'exprime à travers une discographie variée allant du baroque aux comédies musicales américaines. Elle a notamment été nommée aux Oscars et aux Golden Globes pour sa chanson Simple Song #3 dans le film Youth de Sorrentino, où elle joue son propre rôle. Ses contributions culturelles et humanitaires lui ont valu des titres prestigieux : Artiste de l'UNESCO pour la paix, Commandeur de l'ordre des Arts et des Lettres (France, 2025), Chevalier de l'ordre de l'Étoile d'Italie (2019) et Ambassadrice honoraire de la Corée du Sud.",
      "En 1989, Mlle Jo remporte le Grammy Award de soliste principal dans le meilleur enregistrement d'opéra pour « La Femme sans ombre » de Richard Strauss. En 2000, elle reçoit de M. Matsuura, directeur général de l'UNESCO, le titre « d'Artiste UNESCO de la Paix ». En 2015, célébrant ses 30 ans de carrière, elle réalise une tournée chinoise, américaine, australienne et européenne. La chanson qu'elle interprète dans le film de Sorrentino « Youth » est nommée pour un Golden Globe et un Academy Award.",
      "Aujourd'hui, Sumi Jo se consacre à la transmission de son expérience aux nouvelles générations. À travers le Sumi Jo International Singing Competition (SJISC), elle a créé un concours d'un genre nouveau, basé sur l'ambition, l'émotion et la générosité. Son objectif est d'offrir un tremplin aux jeunes talents tout en promouvant la diversité et l'inclusion dans le monde de l'opéra. Le 15 juillet 2024, elle lance officiellement la première compétition internationale de chant qui porte son nom.",
    ],
  },
  {
    name: 'Zihao Li',
    role: 'Lauréat 2024',
    bio: 'Né le 3 mai 2002 dans la province du Shandong, en Chine, Zihao Li est lauréat du Premier Prix du premier Sumi Jo International Singing Competition 2024. Baryton distingué par une projection vocale puissante et une présence scénique d\'un niveau professionnel et international, il étudie au département Opéra de la Central Academy of Drama à Pékin.',
    fullBio: [
      "Né le 3 mai 2002 dans la province du Shandong, en Chine, il étudie au département Opéra de la Central Academy of Drama, auprès du baryton et professeur Sun Jian, du chef d'orchestre d'opéra Niels Muus et du directeur artistique Guo Jiayin.",
      "Prix et distinctions professionnelles :",
      "En 2026, il remporte le Cinquième Prix du 21e Seoul International Music Competition.",
      "En 2026, il met en scène sa première production d'opéra, Die Zauberflöte, présentée à Pékin.",
      "En 2025, il fait partie de la distribution principale dans le rôle de Cascada dans l'opérette de Lehár Die lustige Witwe, production officielle du National Centre for the Performing Arts de Chine.",
      "En 2024, il remporte le Premier Prix du premier Sumi Jo International Singing Competition.",
      "En 2024, il est officiellement admis à la Riccardo Muti Italian Opera Academy. Il participe avec succès à la représentation de l'opéra Cavalleria rusticana, aux côtés du Maestro Riccardo Muti, du Suzhou Symphony Orchestra, du Chœur du China National Symphony Orchestra et du Chœur du Conservatoire de musique de Tianjin.",
      "En 2023, il reçoit le Deuxième Prix dans la catégorie Opéra au 35e Concours international de chant de Marmande, en France.",
      "En 2022, il remporte le Premier Prix du groupe professionnel, dans la catégorie Mélodie et Air d'opéra, au 6e Concours vocal international Corée-Chine.",
      "En 2021, il reçoit le Prix spécial de la Première Dame présidentielle lors du 8e Seoul International Music Competition.",
      "En 2020, il est distingué par deux prix professionnels majeurs au 6e Concours international d'opéra Paolo Coni, en Italie : le Prix du meilleur baryton et le Prix du jeune chanteur le plus prometteur.",
      "La soprano Sumi Jo a déclaré à son sujet : « À seulement 22 ans, son interprétation, sa projection vocale et sa présence scénique sont d'un niveau absolument professionnel et international ! Il est véritablement arrivé, et il apportera une immense surprise au monde ! »",
      "Le Maestro Riccardo Muti a déclaré : « Il possède une voix exceptionnellement saine ! Il est très jeune, et l'avenir lui appartient ! »",
      "Rôles d'opéra : Il barbiere di Siviglia — Figaro ; La Traviata — Giorgio Germont ; Les Pêcheurs de perles — Zurga ; Roméo et Juliette — Mercutio ; La Bohème — Marcello ; Rigoletto — Rigoletto ; Die lustige Witwe — Danilo Danilovitsch ; Die Zauberflöte — Papageno ; Turandot — Ping ; Cavalleria rusticana — Alfio.",
      "Récitals solo : 2021 — Récital solo « Splendid Baroque », Pékin ; 2023 — Récital solo consacré à Der Schwanengesang de Schubert, Pékin ; 2023 — Récital solo consacré à Dichterliebe de Schumann et aux Lieder eines fahrenden Gesellen de Mahler, Pékin.",
      "Chefs d'orchestre et orchestres : Riccardo Muti, Philippe Mestres, Niels Muus, Victor Jacob, Jia Lü, Tao Fan. China NCPA Orchestra, Suzhou Symphony Orchestra — SZSO, Orchestre National Bordeaux Aquitaine — ONBA, Beijing Union Symphony Orchestra — BUSO, Changsha Symphony Orchestra.",
    ],
  },
  {
    name: 'Juliette Tacchino',
    role: 'Lauréate 2024',
    bio: "Lauréate du prix spécial du jury au Concours International de Chant Sumi Jo 2024 et du French Riviera Masters Competition 2024 à l'Opéra de Nice Côte d'Azur, Juliette Tacchino poursuit une carrière en pleine ascension. Issue d'une famille de musiciens, elle déploie une voix lumineuse à travers des rôles variés allant de Mozart au répertoire contemporain.",
    fullBio: [
      "Lauréate du prix spécial du jury au Concours International de Chant Sumi Jo 2024 et du French Riviera Masters Competition 2024 à l'Opéra de Nice Côte d'Azur, elle poursuit une carrière en pleine ascension.",
      "Au cours de la saison 2025–2026, elle incarnera Delphine Garnier dans Les Demoiselles de Rochefort au prestigieux cabaret le Théâtre Lido 2 Paris et partira en tournée aux États-Unis dans le cadre de concerts de musique de chambre et de récitals solos.",
      "Durant la saison 2024–2025, Juliette s'est produite à Paris avec Opéra Fuoco sous la direction de David Stern, collaborant notamment avec Laurent Naouri et Elsa Rooke dans des scènes d'opéra de Jules Massenet. Elle a également donné un récital au Château d'Écouen, près de Paris, et interprété la partie de soprano soliste dans Solomon de William Boyce à l'Opéra de Massy.",
      "Cette même saison, elle a fait ses débuts dans les rôles de Susanna (Le nozze di Figaro) sous la direction de Nicholas McGegan, et dans Candide sous la baguette de David-Charles Abell, avec le Curtis Opera Theatre. Elle a aussi interprété Lonely Child de Claude Vivier avec le Curtis Symphony Orchestra. Juliette a fait ses débuts aux Chorégies d'Orange, l'un des plus prestigieux festivals lyriques européens et a accompagné la soprano de renommée internationale Sumi Jo lors de sa tournée en Chine et en Corée du Sud.",
      "Parmi ses engagements marquants des dernières années, citons ses interprétations en concert de Mélisande (Pelléas et Mélisande) et Sophie (Der Rosenkavalier) avec le Curtis Symphony Orchestra dirigé par Yannick Nézet-Séguin, ainsi que ses prestations scéniques dans les rôles de Ginevra (Ariodante), Thérèse (Les Mamelles de Tirésias), la Renarde (The Cunning Little Vixen), ou encore en tant que soliste dans une mise en scène du L'Allegro, il Penseroso ed il Moderato de Haendel.",
      "En concert, elle s'est illustrée comme soprano soliste dans le Requiem de Mozart avec le Binghamton Philharmonic, la Symphonie n° 4 de Mahler avec l'Orchestre de l'Université de Montréal, ainsi que dans Dixit Dominus et le Dettingen Te Deum de Haendel avec l'Orchestre de chambre de Monte-Carlo.",
      "Issue d'une famille de musiciens, Juliette a commencé son parcours vocal au sein du Chœur d'enfants de l'Opéra de Nice. Pendant ses études musicales, elle a incarné les rôles d'Ilia (Idomeneo), Pauline (La Vie Parisienne), Phani (Les Indes Galantes), une nymphe dans The Fairy Queen, et a été soliste dans une œuvre contemporaine de la compositrice canadienne Ana Sokolović.",
      "Elle a remporté le Premier Prix du Concours d'Opéra Bouffe de Québec en 2020 et 2022, et a reçu la Bourse Louise Roy, la bourse de la Fondation Azrieli, ainsi que le titre de lauréate 2024 du Cercle Richard Wagner Rive Droite. En 2024, elle a été mise à l'honneur dans un article du New York Times portant sur la formation et le développement artistique des jeunes talents au sein du prestigieux Curtis Institute of Music.",
      "Juliette est titulaire d'un Master of Music du Curtis Institute of Music et d'un baccalauréat en musique de l'Université de Montréal.",
    ],
  },
  {
    name: 'George Virban',
    role: 'Ténor lyrique — Lauréat 2024',
    bio: "George Vîrban est un ténor lyrique roumain distingué par l'élégance de sa phrasé, la clarté de son timbre et une musicalité naturellement expressive. Lauréat 2024 du Sumi Jo International Singing Competition, il allie éclat et souplesse vocale à travers un large éventail stylistique, de Mozart au répertoire romantique et à l'opérette.",
    fullBio: [
      "George Vîrban est un ténor lyrique roumain, distingué par l'élégance de sa phrasé, la clarté de son timbre et une musicalité naturellement expressive. Sa voix combine éclat et souplesse, lui permettant d'évoluer sans effort à travers un large éventail stylistique, allant des exigences raffinées de Mozart à l'intensité lyrique du répertoire romantique, ainsi qu'à la sophistication de l'opérette.",
      "Son répertoire operatique comprend des rôles tels que Don Ottavio (Don Giovanni), Ferrando (Così fan tutte) et Tamino (Die Zauberflöte), ainsi que Nemorino (L'elisir d'amore), Alfredo (La Traviata) et Lensky (Eugène Onéguine). Il a également interprété des rôles principaux d'opérette, notamment Eisenstein (Die Fledermaus) et Sou-Chong (Le Pays du sourire).",
      "Parallèlement à sa carrière scénique, il est un artiste de concert actif, avec un répertoire incluant la Petite Messe solennelle de Rossini, le Requiem et la Messe du Couronnement de Mozart, ainsi que l'oratorio Elias de Mendelssohn. Il a commencé sa formation musicale au lycée des arts « Dimitrie Cuclin » à Galați avant de poursuivre ses études à l'Université nationale de musique de Bucarest, où il a obtenu sa licence et son master. Ses débuts internationaux ont eu lieu en 2016 dans le rôle de Lensky (Eugène Onéguine) à l'Opéra de Saransk.",
      "Lauréat de plusieurs concours internationaux, il a été récompensé en Roumanie et en France, notamment aux Jeunes Espoirs d'Avignon et au concours « Georges Enesco » à Paris. En 2024, il a obtenu le deuxième prix lors de la première édition du Concours international de chant Sumi Jo en France. George Vîrban s'est produit en tant que soliste avec l'Opéra national roumain de Bucarest et l'Opéra national d'opérette et de comédie musicale « Ion Dacian », dont il est actuellement membre permanent de la troupe. De 2019 à 2021, il a fait partie de l'Opera Studio de la Bayerische Staatsoper de Munich.",
      "Ses engagements récents incluent des apparitions au Aalto-Theater d'Essen, où il a interprété Ferrando (Così fan tutte) et Valentino dans le Fausto de Louise Bertin, suivies de ses débuts dans le rôle de Don Ottavio (Don Giovanni). En 2025, il s'est produit au Metropolitan Opera en tant que cover de Tamino dans la production de Die Zauberflöte mise en scène par Simon McBurney, puis a effectué une tournée en Corée du Sud en concert aux côtés de la soprano Sumi Jo. La même année, il a fait ses débuts au Festival George Enescu avec Vox Maris aux côtés de la Sinfonia Varsovia.",
      "Durant la saison 2025/26, il collabore avec des institutions majeures telles que la Bayerische Staatsoper et l'Opéra d'Israël. En 2026, il fait ses débuts dans le rôle d'Alfredo (La Traviata) à l'Opéra national roumain de Cluj-Napoca. Ses engagements récents incluent également Sou-Chong (Le Pays du sourire) à Bucarest et des représentations de Lensky à Haïfa. Jusqu'à la fin de la saison en cours, le public peut l'entendre dans le rôle d'Alfredo (La Traviata) au Théâtre d'État d'Oradea et dans celui de Ferrando (Così fan tutte) au Festival d'opéra lyrique de Jérusalem.",
      "La saison à venir comprendra plusieurs débuts importants, notamment le rôle de Roméo dans Roméo et Juliette de Gounod à l'Opéra national roumain de Cluj-Napoca et au Teatro Colón de Buenos Aires, ainsi que le rôle-titre de Werther de Massenet à l'Opéra national roumain de Cluj-Napoca.",
    ],
  },
  {
    name: 'Marie Lombard',
    role: 'Lauréate 2024',
    bio: "Marie Lombard, soprano, est membre de l'International Opera Studio de l'Opéra de Zurich depuis la saison 2024-2025. Lauréate du Sumi Jo International Singing Competition, du Concours international Jeunes Espoirs du Grand Opéra d'Avignon et du Concours international de chant de Marmande, elle déploie une voix lumineuse et une présence scénique affirmée à travers un répertoire varié allant de Mozart au grand opéra romantique.",
    fullBio: [
      "Marie Lombard, soprano, est membre de l'International Opera Studio de l'Opéra de Zurich depuis la saison 2024-2025. Elle y a fait ses débuts dans les rôles de Barbarina (Le Nozze di Figaro), de la Contessa di Folleville (Il viaggio a Reims) et de Frederika (Jakob Lenz). Elle a également été invitée à se produire lors du concert de gala de bienfaisance aux côtés de Cecilia Bartoli.",
      "Cette saison, elle reprend le rôle de Barbarina et interprétera également Sandmann (Hänsel und Gretel) ainsi que Lauretta (Gianni Schicchi). Cet été, elle chantera Violetta Valéry (La Traviata) et Marzelline (Fidelio) dans plusieurs festivals français. La saison prochaine, elle interprétera Antonia (Les Contes d'Hoffmann) au Théâtre de Saint-Gall, en Suisse, Frasquita à l'Opéra de Monte-Carlo, ainsi que Marzelline dans plusieurs théâtres en France.",
      "Elle a précédemment étudié au Conservatoire National Supérieur de Musique et de Danse de Paris auprès de Chantal Mathias, ainsi qu'à Rennes avec Stéphanie d'Oustrac. Elle a également participé à des masterclasses auprès de Lisette Oropesa, Elīna Garanča, Anne Sofie von Otter, Stéphane Degout, Inva Mula, Brigitte Fassbaender et Mariella Devia.",
      "Elle est également ancienne élève de l'Académie de l'Opéra de Bordeaux et de l'Académie de l'Opéra de Monte-Carlo, placée sous la direction de Sophie Koch.",
      "Marie Lombard est lauréate du Sumi Jo International Singing Competition, du Concours international Jeunes Espoirs du Grand Opéra d'Avignon et du Concours international de chant de Marmande.",
      "Elle a également interprété des rôles tels qu'Inès (La Favorite), La Princesse (L'Enfant et les Sortilèges), Belinda (Dido and Aeneas), Eurydice (Orfeo ed Euridice), Adèle (Die Fledermaus), Coraline (Le Toréador) et la Première Dame (Die Zauberflöte).",
    ],
  },
  {
    name: 'Alexandre Baldo',
    role: 'Baryton-basse — Finaliste 2024',
    bio: "Talent Adami Classique et lauréat du Prix du Public au Concours International Pier Antonio Cesti en Autriche, le baryton-basse Alexandre Baldo s'impose avec éclat sur les plus grandes scènes tant en France qu'à l'international. Finaliste du Sumi Jo International Singing Competition 2024, il déploie un timbre généreux et une forte présence scénique au service d'un répertoire s'étendant du premier baroque aux grands oratorios romantiques.",
    fullBio: [
      "Talent Adami Classique et lauréat du Prix du Public au Concours International Pier Antonio Cesti en Autriche, le baryton-basse Alexandre Baldo s'impose avec éclat sur les plus grandes scènes tant en France qu'à l'international. Finaliste du Sumi Jo International Singing Competition 2024, il déploie un timbre généreux et une forte présence scénique au service d'un répertoire s'étendant du premier baroque aux grands oratorios romantiques.",
      "À l'opéra, ses premières saisons témoignent d'une remarquable ascension française et européenne. Alexandre Baldo a ainsi fait des débuts particulièrement remarqués en Italie, foulant les scènes historiques du Maggio Musicale Fiorentino ainsi que des Teatri Comunali de Ferrare et de Modène dans Le Carnaval de Lully sous la direction de Federico Maria Sardelli. En France, le public a pu l'applaudir à l'Opéra de Marseille dans le rôle de Pluton (L'Orfeo de Monteverdi), à l'Opéra de Montpellier en Raphaël et Adam (Die Schöpfung de Haydn), à l'Opéra de Saint-Étienne en Abimélech (Samson et Dalila), ainsi qu'à l'Opéra de Lille en Deuxième Homme armé (Die Zauberflöte). Fidèle complice du chef et contre-ténor Philippe Jaroussky, il a incarné Esculapio et Plutone dans L'Orfeo de Sartorio au Théâtre de l'Athénée à Paris et en tournée française. Il collabore également de manière régulière avec l'Opéra Royal de Versailles (Alidoro dans La Cenerentola de Rossini et le Sprecher dans Die Zauberflöte de Mozart).",
      "En concert, Alexandre Baldo s'est récemment produit au Musikverein de Vienne dans La Resurrezione de Haendel, incarnant Lucifero aux côtés de l'orchestre Wiener Akademie sous la direction de Martin Haselböck, ainsi qu'au Théâtre des Champs-Élysées, où il a chanté Jésus dans la Passion selon saint Matthieu de Bach sous la direction de Thibault Noally à la tête de l'orchestre Les Ambassadeurs. Partenaire privilégié d'Hervé Niquet et du Concert Spirituel, il s'est illustré comme soliste dans Israel in Egypt de Haendel, projet gravé pour le label Alpha. Récemment, sa trajectoire internationale l'a mené jusqu'en Chine pour une grande tournée de concerts de gala aux côtés de la célèbre soprano Sumi Jo.",
      "En parallèle de son intense activité de soliste, Alexandre Baldo développe des projets artistiques ambitieux et au long cours avec son ensemble baroque Mozaïque. Leur premier enregistrement discographique, dédié aux airs pour basse d'Antonio Caldara et paru chez le label Pan Classics, a été unanimement salué par la critique internationale, décrochant notamment 5 Diapasons et 5 étoiles Classica.",
      "Au cours de la saison 2026/2027, Alexandre Baldo débutera dans de nombreux théâtres tels que le Theater an der Wien, l'Opéra de Toulon et l'Opéra de Rennes, et renouvellera sa collaboration avec l'Opéra Royal du Château de Versailles et l'Opéra de Marseille. Plusieurs sorties discographiques majeures sont attendues chez le label Aparté : un deuxième album solo ainsi que l'enregistrement en première mondiale de l'oratorio David umiliato de Caldara avec l'ensemble Mozaïque.",
    ],
  },
];

const BiographyCard = ({ artist, index }: { artist: Artist; index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl border border-gold/20 p-5 sm:p-6 md:p-8 hover:border-gold/50 transition-all duration-500"
    >
      <div className="flex flex-col sm:grid sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] gap-5 md:gap-8 items-start">
        <div className="relative w-32 sm:w-full mx-auto sm:mx-0">
          <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-gradient-to-br from-rose/10 to-gold/10 border border-gold/20 flex items-center justify-center">
            {artist.photo ? (
              <img
                src={artist.photo}
                alt={artist.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center text-gold/40 gap-1">
                <User className="w-10 h-10 sm:w-14 sm:h-14" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-center px-1">
                  Photo à venir
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-center sm:text-left">
          <div>
            <p className="text-gold text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2">
              {artist.role}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground font-bold">
              {artist.name}
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent mt-3 mx-auto sm:mx-0" />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {artist.bio}
          </p>
          {artist.fullBio && artist.fullBio.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-rose-dark hover:text-rose font-bold text-sm sm:text-base tracking-wide uppercase underline-offset-4 hover:underline transition-colors"
              >
                Lire la suite →
              </button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-gold/30">
                  <DialogHeader>
                    <p className="text-gold text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
                      {artist.role}
                    </p>
                    <DialogTitle className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-bold text-left">
                      {artist.name}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Biographie complète de {artist.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
                  <div className="space-y-4 text-muted-foreground text-base leading-relaxed text-left">
                    {artist.fullBio.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const Biographies = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Biographies des artistes | Concert Sumi Jo & Winners — Salle Cortot 10 juin 2026"
        description="Découvrez les biographies de Sumi Jo et des lauréats du Sumi Jo International Singing Competition 2024 : Zihao Li, Juliette Tacchino, George Virban, Marie Lombard et Alexandre Baldo, en concert le 10 juin 2026 à la Salle Cortot, Paris."
        keywords="biographies, chanteurs, Sumi Jo, lauréats, Salle Cortot, concert, opéra"
        path="/biographies"
      />
      <Header />

      <main className="pt-20 sm:pt-24 md:pt-32 pb-32 sm:pb-28">
        {/* Poster */}
        <section className="container mx-auto px-4 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="max-w-sm sm:max-w-md md:max-w-lg mx-auto"
          >
            <img
              src={posterAsset.url}
              alt="Affiche du concert Sumi Jo & Winners — Salle Cortot, 10 juin 2026"
              className="w-full h-auto rounded-xl shadow-2xl border border-gold/20"
            />
          </motion.div>
        </section>

        {/* Hero */}
        <section className="container mx-auto px-4 mb-10 sm:mb-16 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            <p className="text-gold text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] uppercase">
              10 juin 2026 — Salle Cortot
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-foreground font-bold leading-tight">
              Biographies des artistes
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-gold/60" />
              <div className="w-2 h-2 rotate-45 bg-gold" />
              <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed px-2">
              Découvrez les parcours exceptionnels de Sumi Jo et des lauréats 2024 du Sumi Jo
              International Singing Competition.
            </p>
          </motion.div>
        </section>

        {/* Artists */}
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-5 sm:space-y-8">
            {artists.map((artist, i) => (
              <BiographyCard key={artist.name} artist={artist} index={i} />
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mt-12 mb-6">
              <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-gold/40" />
              <div className="w-2 h-2 rotate-45 bg-gold/40" />
              <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-gold/40" />
            </div>
            <div className="text-center">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-bold border-rose/30 hover:border-rose hover:bg-rose hover:text-white transition-all duration-300"
              >
                <Link to="/concert-gala-paris">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour au concert
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="h-40 bg-muted" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      {/* Floating ticket button — mobile-optimized */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed bottom-3 left-0 right-0 flex justify-center px-3 sm:bottom-6 sm:px-0 z-50"
      >
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto bg-gradient-to-r from-rose-dark via-rose to-rose-dark text-white font-bold px-4 sm:px-6 py-4 sm:py-5 shadow-[0_8px_30px_rgba(200,90,107,0.45)] hover:shadow-[0_0_30px_rgba(200,90,107,0.6)] transition-all duration-300 hover:scale-[1.02] rounded-full text-sm sm:text-base leading-tight h-auto whitespace-normal text-center"
        >
          <Link to="/billetterie">
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
            <span>Réservez vos places — SJISC 2026</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default Biographies;
