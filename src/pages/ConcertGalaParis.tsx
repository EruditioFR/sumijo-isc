import { useEffect } from 'react';
import { lazy, Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft, Phone, Mail, MapPin, Calendar } from 'lucide-react';

const Header = lazy(() => import('@/components/Header'));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));

const RESERVATION_URL = 'mailto:billetterie@sallecortot.fr?subject=R%C3%A9servation%20Concert%20Sumi%20Jo%20%26%20Winners%20-%2010%20juin%202026';

type Piece = {
  artists: string;
  aria: string;
  opera: string;
  composer: string;
};

const partOne: Piece[] = [
  { artists: 'Alexandre Baldo', aria: '« Sous les Pieds d\u2019une Femme »', opera: 'La Reine de Saba', composer: 'Gounod' },
  { artists: 'Zihao Li', aria: '« O Vaterland, du machst bei tag »', opera: 'Die lustige Witwe', composer: 'Lehar' },
  { artists: 'Juliette Tacchino', aria: '« Naughty Marietta »', opera: 'Naughty Marietta', composer: 'Herbert' },
  { artists: 'George Virban', aria: '« Ah, Lève-toi Soleil ! »', opera: 'Roméo et Juliette', composer: 'Gounod' },
  { artists: 'Marie Lombard', aria: '« Robert, toi que j\u2019aime »', opera: 'Robert le Diable', composer: 'Meyerbeer' },
  { artists: 'Marie Lombard & Juliette Tacchino', aria: '« Sull\u2019aria »', opera: 'Nozze di Figaro', composer: 'Mozart' },
  { artists: 'Zihao Li', aria: '« Mein Sehnen, mein Wahnen »', opera: 'Die Tote Stadt', composer: 'Korngold' },
  { artists: 'George Virban & Juliette Tacchino', aria: '« Caro elisir »', opera: 'L\u2019elisir d\u2019amore', composer: 'Donizetti' },
];

const partTwo: Piece[] = [
  { artists: 'Zihao Li', aria: '« Largo al factotum »', opera: 'Il Barbiere di Siviglia', composer: 'Rossini' },
  { artists: 'Juliette Tacchino', aria: '« Da Tempeste »', opera: 'Giulio Cesare', composer: 'Handel' },
  { artists: 'Alexandre Baldo', aria: '« O Isis und Osiris »', opera: 'La Flûte Enchantée', composer: 'Mozart' },
  { artists: 'Juliette Tacchino & Alexandre Baldo', aria: '« La ci darem la mano »', opera: 'Don Giovanni', composer: 'Mozart' },
  { artists: 'Marie Lombard', aria: '« Ah fors\u2019e lui… sempre libera »', opera: 'Traviata', composer: 'Verdi' },
  { artists: 'Quartetto — G. Virban, Z. Li, J. Tacchino, M. Lombard', aria: '« Dunque e proprio finita ? »', opera: 'La Bohème', composer: 'Puccini' },
  { artists: 'George Virban', aria: '« Nessun Dorma »', opera: 'Turandot', composer: 'Puccini' },
  { artists: 'Sumi Jo', aria: '« Oh, quante volte »', opera: 'I Capuletti e i Montecchi', composer: 'Bellini' },
  { artists: 'Sumi Jo', aria: '« Spiel ich die Unschuld vom Lande »', opera: 'Die Fledermaus', composer: 'Johann Strauss II' },
  { artists: 'Tutti avec Sumi Jo', aria: '« Make our Garden Grow »', opera: 'Candide', composer: 'Bernstein' },
];

const tarifs = [
  { label: 'Catégorie 1', price: '55 €' },
  { label: 'Catégorie 2', price: '35 €' },
  { label: 'Catégorie 3', price: '20 €' },
  { label: 'T