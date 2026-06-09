// @ts-ignore
import trainerAndreyImg from './assets/images/trainer_andrey_1780984098163.png';
// @ts-ignore
import trainerDmitryImg from './assets/images/trainer_dmitry_1780984114601.png';
// @ts-ignore
import trainerIgorImg from './assets/images/trainer_igor_1780984128129.png';

export interface ProgramInfo {
  tag: string;
  title: string;
  price: string;
  details: string;
  isPopular?: boolean;
}

export interface TrainerInfo {
  initials: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface BenefitCard {
  title: string;
  subtitle: string;
  iconName: 'shield' | 'target' | 'users' | 'trophy';
}

export const PROGRAMS: ProgramInfo[] = [
  {
    tag: '6–12 ЛЕТ',
    title: 'ДЕТИ',
    price: 'от 3 500 ₽/мес',
    details: 'ОФП, координация, основы рукопашного боя. Без жёсткого контакта.'
  },
  {
    tag: 'ПОПУЛЯРНО',
    title: 'ВЗРОСЛЫЕ',
    price: 'от 4 500 ₽/мес',
    details: 'Ударная и борцовская техника, спарринги, самооборона. 3 раза в неделю.',
    isPopular: true
  },
  {
    tag: 'PRO',
    title: 'БОЙЦЫ',
    price: 'от 6 500 ₽/мес',
    details: 'Подготовка к турнирам. Усиленные сборы, индивидуальный план.'
  }
];

export const TRAINERS: TrainerInfo[] = [
  {
    initials: 'AB',
    name: 'АНДРЕЙ ВОЛКОВ',
    role: 'ГЛАВНЫЙ ТРЕНЕР · МСМК',
    description: '18 лет опыта, чемпион ЮФО',
    image: trainerAndreyImg
  },
  {
    initials: 'ДС',
    name: 'ДМИТРИЙ СЕРОВ',
    role: 'ТРЕНЕР ВЗРОСЛЫХ ГРУПП',
    description: 'КМС по рукопашному бою',
    image: trainerDmitryImg
  },
  {
    initials: 'ИК',
    name: 'ИГОРЬ КЛИМОВ',
    role: 'ДЕТСКИЙ ТРЕНЕР',
    description: 'Педагог высшей категории',
    image: trainerIgorImg
  }
];

export const STATS: StatItem[] = [
  { value: '500+', label: 'УЧЕНИКОВ' },
  { value: '10', label: 'ЛЕТ НА ТАТАМИ' },
  { value: '27', label: 'ЧЕМПИОНОВ КРАЯ' }
];

export const ABOUT_BULLETS = [
  'Индивидуальный подход к каждому ученику',
  'Современный зал с татами и боксёрским рингом',
  'Регулярные турниры и сборы',
  'Группы для детей, подростков и взрослых'
];

export const BENEFIT_CARDS: BenefitCard[] = [
  {
    title: 'САМООБОРОНА',
    subtitle: 'Реальные техники защиты',
    iconName: 'shield'
  },
  {
    title: 'ДИСЦИПЛИНА',
    subtitle: 'Характер и воля',
    iconName: 'target'
  },
  {
    title: 'КОМАНДА',
    subtitle: 'Атмосфера братства',
    iconName: 'users'
  },
  {
    title: 'РЕЗУЛЬТАТ',
    subtitle: 'Победы на турнирах',
    iconName: 'trophy'
  }
];

export const CONTACT_INFO = {
  address: 'г. Ставрополь, ул. Доваторцев, 75А',
  phone: '+7 (8652) 00-00-00',
  email: 'hello@stal-stv.ru',
  schedule: 'Пн - Сб: 09:00 - 21:00, Вс: Выходной'
};
