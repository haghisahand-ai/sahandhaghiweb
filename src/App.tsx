/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Personal Technology Hub
 * Global Localization, Native Professional Content & Brand Identity Refinement
 * Supports: Persian (fa-IR, RTL), English (en-US, LTR), Turkish (tr-TR, LTR)
 */

import React, { useState, useEffect, useRef } from 'react';
import SahandLogo, { SahandEmblem, SahandFavicon16, SahandLogoSystemInspector } from './components/SahandLogo';
import NeuralDataFlowBackground from './components/NeuralDataFlowBackground';
import { BuildStatusDashboard } from './components/BuildStatusDashboard';
import { AiGatewayDiagnosticTool } from './components/AiGatewayDiagnosticTool';
import { WordPressEditionModal } from './components/WordPressEditionModal';
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Terminal, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Eye,
  Activity,
  Server,
  Code2,
  Database,
  GitBranch,
  Radio,
  Sliders,
  Compass,
  FileCode,
  Zap,
  Download,
  BookOpen,
  Send,
  Binary,
  Workflow,
  Search,
  Menu,
  X,
  Play,
  RotateCcw
} from 'lucide-react';

type Language = 'fa' | 'en' | 'tr';

interface NavItem {
  id: string;
  label: string;
  num: string;
}

interface StatItem {
  label: string;
  value: string;
  unit?: string;
}

interface ProjectItem {
  title: string;
  category: string;
  status: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  terminalLogs: string[];
}

interface DomainItem {
  title: string;
  desc: string;
  tags: string[];
}

interface LangContent {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  brandWordmark: string;
  secondaryBrand: string;
  tagline: string;
  coordinates: string;
  introHeadline: string;
  introSubheadline: string;
  introCta: string;
  introBadge: string;
  navItems: NavItem[];
  heroBadge: string;
  heroHeadline: string;
  heroSub: string;
  ctaExplore: string;
  ctaAiLab: string;
  stats: StatItem[];
  nodeMatrixTitle: string;
  nodeMatrixStatus: string;
  node1Title: string;
  node1Sub: string;
  node2Title: string;
  node2Sub: string;
  node3Title: string;
  node3Sub: string;
  telemetrySession: string;
  telemetryTick: string;
  domainsHeader: string;
  domainsTitle: string;
  domainsSub: string;
  domains: DomainItem[];
  projectsHeader: string;
  projectsTitle: string;
  viewAllProjects: string;
  caseStudy1: ProjectItem;
  caseStudy2: ProjectItem;
  aiLabHeader: string;
  aiLabTitle: string;
  aiLabBadge: string;
  aiModelLabel: string;
  aiDefenseLabel: string;
  aiRateLabel: string;
  aiPromptLabel: string;
  aiDefaultPrompt: string;
  aiBtnExecute: string;
  aiBtnExecuting: string;
  aiOutputHeader: string;
  aiOutputTag: string;
  aiSimulatedResult: string;
  contactHeader: string;
  contactTitle: string;
  contactSub: string;
  contactNameLabel: string;
  contactEmailLabel: string;
  contactMsgLabel: string;
  contactBtn: string;
  contactSuccess: string;
  contactPgp: string;
  footerTagline: string;
  footerSla: string;
  footerArch: string;
  footerReturnPortal: string;
  aboutTab: {
    badge: string;
    title: string;
    bio: string;
    experienceTitle: string;
    experienceText: string;
  };
  launchpadTab: {
    badge: string;
    title: string;
    desc: string;
    items: { name: string; ver: string; desc: string; btn: string }[];
  };
}

const CONTENT: Record<Language, LangContent> = {
  fa: {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    dir: 'rtl',
    brandWordmark: 'سهند',
    secondaryBrand: 'SAHAND',
    tagline: 'پلتفرم تخصصی فناوری، مهندسی سیستم‌ها و هوش مصنوعی',
    coordinates: 'مختصات کوه سهند: ۳۷.۷۵° شمالی // ۴۶.۴۲° شرقی',
    introHeadline: 'فراتر از مرزهای فناوری؛ ساخت راه‌حل‌های پایدار و پیشرو',
    introSubheadline: 'هوش مصنوعی · معماری سیستم‌ها · نوآوری نرم‌افزاری · محصولات دیجیتال',
    introCta: 'ورود به پلتفرم سهند',
    introBadge: 'محیط عملیاتی // اعتماد صفر // زبان فارسی',
    navItems: [
      { id: 'home', label: 'خانه', num: '۰۱' },
      { id: 'about', label: 'درباره من', num: '۰۲' },
      { id: 'projects', label: 'پروژه‌ها', num: '۰۳' },
      { id: 'launchpad', label: 'سکوی محصولات', num: '۰۴' },
      { id: 'ai-lab', label: 'آزمایشگاه هوش مصنوعی', num: '۰۵' },
      { id: 'engineering', label: 'معماری سیستم‌ها', num: '۰۶' },
      { id: 'insights', label: 'دیدگاه‌ها و مقالات', num: '۰۷' },
      { id: 'contact', label: 'ارتباط و همکاری', num: '۰۸' },
    ],
    heroBadge: 'سیستم‌های توزیع‌شده · مدل‌های محاسباتی هوش مصنوعی · مهندسی مالی',
    heroHeadline: 'معماری سیستم‌های پیشرفته با انضباط و استانداردهای دقیق مهندسی',
    heroSub: 'توسعه زیرساخت‌های نرم‌افزاری مقیاس‌پذیر، هسته‌های معاملاتی الگوریتمی و ابزارهای هوش مصنوعی بر پایه معماری دفاع در عمق، امنیت چندلایه و حاکمیت مستقل داده‌ها.',
    ctaExplore: 'مشاهده مطالعات موردی و پروژه‌ها',
    ctaAiLab: 'ورود به آزمایشگاه هوش مصنوعی',
    stats: [
      { label: 'تاخیر پردازش سفارشات', value: '۰.۸', unit: 'میلی‌ثانیه' },
      { label: 'شاخص پایداری و تاب‌آوری', value: '۹۹.۹۸', unit: 'درصد' },
      { label: 'ماژول‌های مستقل فعال', value: '۲۴+', unit: 'سرویس' },
      { label: 'پروتکل امنیتی هسته', value: 'اعتماد صفر', unit: 'فعال' },
    ],
    nodeMatrixTitle: 'ماتریس توپولوژی نودها و سرویس‌ها',
    nodeMatrixStatus: 'کلیه نودها فعال و پایدار',
    node1Title: 'موتور الگوریتمی MicroMap',
    node1Sub: 'پایتون ۳.۱۲ · تحلیل عمق و جریان سفارشات',
    node2Title: 'درگاه مدل‌های زبانی هوش مصنوعی',
    node2Sub: 'سرور امن Gemini 2.5',
    node3Title: 'پلتفرم توزیع‌شده سهند',
    node3Sub: 'وردپرس مستقل و چندزبانه',
    telemetrySession: 'سشن معاملاتی: لندن و نیویورک',
    telemetryTick: 'پردازش تیک: ۰.۸ میلی‌ثانیه',
    domainsHeader: '۰۲ // حوزه‌های تخصصی و توانمندی‌ها',
    domainsTitle: 'حوزه‌های کلیدی مهندسی و توسعه سیستم‌ها',
    domainsSub: 'ترکیب ریاضیات کاربردی، پردازش بلادرنگ و امنیت چندلایه برای حل مسائل پیچیده محاسباتی و تجاری.',
    domains: [
      {
        title: 'هوش مصنوعی و مدل‌های زبانی',
        desc: 'طراحی خطوط لوله استنتاج سروری، بازیابی معنایی داده‌ها و محافظت پیشرفته در برابر حملات تزریق پرامپت.',
        tags: ['مدل Gemini 2.5', 'بازیابی برداری RAG', 'اعتبارسنجی توکن'],
      },
      {
        title: 'مهندسی سیستم‌های مالی و الگوریتمی',
        desc: 'تحلیل عمق بازار، مپینگ نقدینگی در پنجره‌های معاملاتی حساس لندن/نیویورک و فیلترهای پیشرفته حجم اردرها.',
        tags: ['پایتون ۳.۱۲', 'الگوریتم MicroMap', 'وب‌سوکت بلادرنگ'],
      },
      {
        title: 'امنیت سایبری و دفاع چندلایه',
        desc: 'مدل‌سازی سیستماتیک تهدیدات با متدولوژی STRIDE، کنترل احراز هویت و دسترسی مبتنی بر نقش و ممیزی توکن‌ها.',
        tags: ['متدولوژی STRIDE', 'ممیزی نانس وردپرس', 'سیاست سخت‌گیرانه CSP'],
      },
      {
        title: 'معماری سیستم‌های توزیع‌شده',
        desc: 'طراحی ماژولار و تفکیک لایه ارائه از لایه منطق، بهینه‌سازی شده برای عملکرد سبک روی هاست‌های پایدار.',
        tags: ['پی‌اچ‌پی ۸.۲+', 'پایگاه داده MySQL', 'کش‌گذاری هوشمند FastCGI'],
      },
    ],
    projectsHeader: '۰۳ // مطالعات موردی و پروژه‌های شاخص',
    projectsTitle: 'پروژه‌های مهندسی و سیستم‌های پیاده‌سازی‌شده',
    viewAllProjects: 'مشاهده تمام پروژه‌ها (۱۲ پروژه)',
    caseStudy1: {
      title: 'هسته معاملاتی الگوریتمی MicroMap و تحلیل جریان سفارشات',
      category: 'مهندسی مالی و پردازش بلادرنگ',
      status: 'محیط عملیاتی // فعال',
      description: 'سامانه نرم‌افزاری اختصاصی جهت تحلیل رفتار قیمت، توزیع نقدینگی و عدم تعادل سفارشات در پنجره‌های معاملاتی حساس سشن‌های لندن و نیویورک. اتصال به APIهای معاملاتی و اجرای خودکار فرامین با تاخیر کمتر از یک میلی‌ثانیه.',
      metrics: [
        { label: 'تاخیر پردازش', value: 'کمتر از ۱.۲ میلی‌ثانیه' },
        { label: 'پنجره‌های فعال', value: 'سشن لندن / نیویورک' },
        { label: 'زبان پیاده‌سازی', value: 'پایتون ۳.۱۲' },
      ],
      tags: ['پایتون', 'وب‌سوکت', 'MicroMap', 'مدیریت ریسک'],
      terminalLogs: [
        '[۰۸:۰۰:۰۱ به وقت لندن] پنجره زمانی گشایش سشن لندن فعال شد',
        '> ارزیابی عدم تعادل نقدینگی در سطوح کلیدی...',
        '> دلتای حجم خریداران: +۴,۲۸۰ لات // اسپرد: ۰.۱ پیپ',
        '> شرایط الگوریتمی تایید شد. سیگنال اجرا ارسال گردید.',
        '[۰۸:۰۰:۰۱.۰۰۲] تاییدیه صرافی دریافت شد // تاخیر پردازش: ۰.۸ میلی‌ثانیه',
      ],
    },
    caseStudy2: {
      title: 'معماری مستقل و چندزبانه پلتفرم مهندسی سهند',
      category: 'معماری زیرساخت و سیستم‌ها',
      status: 'مستقر در سرور // نسخه ۱.۰',
      description: 'طراحی تفکیک‌شده قالب sahand-theme و پلاگین هسته sahand-core برای استقرار روی هاست‌های استاندارد بدون نیاز به پردازش‌های سنگین Node.js در سرور، همراه با پشتیبانی همزمان از سه زبان (فارسی، انگلیسی، ترکی).',
      metrics: [
        { label: 'زبان‌های پشتیبانی‌شده', value: 'فارسی / انگلیسی / ترکی' },
        { label: 'سربار پایگاه داده', value: 'صفر (ساختار بومی)' },
        { label: 'سطح امنیت', value: 'استحکام‌بخشی STRIDE' },
      ],
      tags: ['وردپرس مستقل', 'قالب اختصاصی', 'پلاگین هسته', 'Polylang'],
      terminalLogs: [
        '> بارگذاری هسته sahand-core... موفقیت‌آمیز',
        '> بررسی هدرهای امنیتی: Content-Security-Policy فعال شد',
        '> اعتبارسنجی نانس‌ها و نرخ‌گذاری درخواست‌ها مسلح شد',
        '> نگاشت مسیرهای چندزبانه: /fa/ و /en/ و /tr/ آماده پردازش',
      ],
    },
    aiLabHeader: '۰۴ // آزمایشگاه و محیط آزمون هوش مصنوعی',
    aiLabTitle: 'محیط آزمون و استنتاج مدل‌های هوش مصنوعی',
    aiLabBadge: 'درگاه امن سمت سرور GEMINI 2.5 فعال است',
    aiModelLabel: 'مدل پردازشی هدف:',
    aiDefenseLabel: 'محافظت در برابر تزریق پرامپت: فعال',
    aiRateLabel: 'سقف نرخ: ۵ درخواست در دقیقه',
    aiPromptLabel: 'پرسش آزمایشی یا درخواست ارزیابی معماری سیستم:',
    aiDefaultPrompt: 'معماری خط لوله پردازش جریان سفارشات MicroMap را شرح دهید',
    aiBtnExecute: 'اجرای استنتاج مدل',
    aiBtnExecuting: 'در حال پردازش...',
    aiOutputHeader: 'استنتاج سروری در ۴۸۰ میلی‌ثانیه تکمیل شد',
    aiOutputTag: 'استناد و صحت داده تایید گردید',
    aiSimulatedResult: '[تحلیل معماری سامانه MicroMap v2.4]: این ساختار یک خط لوله پردازش جریان سفارشات همزمان (Event-Driven Order Flow Pipeline) را اجرا می‌کند. سیستم با استفاده از اتصالات وب‌سوکت کم‌تاخیر، داده‌های عمق بازار را در پنجره‌های معاملاتی حساس لندن و نیویورک فیلتر کرده و با رعایت دقیق استانداردهای مدیریت ریسک، تایید الگوریتمی را با تاخیر ۰.۸ میلی‌ثانیه صادر می‌نماید.',
    contactHeader: '۰۵ // ارتباط کاری و مشاوره فنی',
    contactTitle: 'ارتباط مستقیم و آغاز همکاری‌های تخصصی',
    contactSub: 'برای مشاوره در زمینه معماری سیستم‌های توزیع‌شده، پیاده‌سازی زیرساخت‌های معاملاتی الگوریتمی و استقرار راهکارهای هوش مصنوعی پیام خود را ارسال فرمایید.',
    contactNameLabel: 'نام و نام خانوادگی:',
    contactEmailLabel: 'آدرس ایمیل سازمانی:',
    contactMsgLabel: 'شرح نیازمندی‌های پروژه یا سوال فنی:',
    contactBtn: 'ارسال پیام امن و آغاز گفتگو',
    contactSuccess: '✓ پیام شما به صورت رمزنگاری‌شده ارسال گردید.',
    contactPgp: 'اثر انگشت کلید PGP: 4A8B 91F2 C04E 8A97',
    footerTagline: 'پلتفرم تخصصی فناوری و مهندسی سهند حقی',
    footerSla: 'پایداری سیستم: ۹۹.۹۸٪',
    footerArch: 'معماری تفکیک‌شده وردپرس',
    footerReturnPortal: 'بازگشت به پرتال ورودی',
    aboutTab: {
      badge: '۰۲ // درباره من و فلسفه مهندسی',
      title: 'سهند حقی — معمار ارشد سیستم‌ها و توسعه‌دهنده نرم‌افزار',
      bio: 'مهندس نرم‌افزار و طراح زیرساخت‌های محاسباتی با تمرکز ویژه بر سیستم‌های توزیع‌شده با کارایی بالا، مهندسی مالی الگوریتمی، و یکپارچه‌سازی امن مدل‌های هوش مصنوعی. پایبند به انضباط مهندسی، معماری دفاع در عمق و تولید نرم‌افزارهای پایدار و مستقل.',
      experienceTitle: 'رویکرد و فلسفه فنی',
      experienceText: 'باور به سادگی معماری، جلوگیری از پیچیدگی‌های غیرضروری، بهینه‌سازی تاخیر در سطح میلی‌ثانیه، و حفظ استقلال زیرساختی بدون وابستگی به سرویس‌های انحصاری خارجی.',
    },
    launchpadTab: {
      badge: '۰۴ // سکوی محصولات و ابزارهای دیجیتال',
      title: 'سکوی محصولات نرم‌افزاری سهند',
      desc: 'مجموعه‌ای از ابزارهای مستقل توسعه‌دهندگان، کتابخانه‌های نرم‌افزاری و سرویس‌های کاربردی آماده استفاده.',
      items: [
        { name: 'ابزار ترمینال MicroMap CLI', ver: 'نسخه ۱.۴.۲ · پایدار · لینوکس/مک', desc: 'موتور خط فرمان برای پایش سریع نقدینگی و هشدارهای معاملاتی پنجره‌های سشن لندن.', btn: 'دریافت نسخه باینری' },
        { name: 'پوسته مستقل SAHAND Hub', ver: 'نسخه ۱.۰.۰ · وردپرس ۶.۷', desc: 'قالب اختصاصی بهینه‌سازی‌شده برای هاست‌های استاندارد با پشتیبانی سه زبانه کامل.', btn: 'مشاهده مستندات فنی' },
      ],
    },
  },

  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    brandWordmark: 'SAHAND',
    secondaryBrand: 'سهند',
    tagline: 'Personal Technology Hub, Systems Architecture & AI Platform',
    coordinates: 'MOUNT SAHAND: LAT 37.75°N // LNG 46.42°E',
    introHeadline: "Beyond Technology. Building What's Next.",
    introSubheadline: 'Artificial Intelligence · Systems Engineering · Software Innovation · Digital Products',
    introCta: 'Enter SAHAND Platform',
    introBadge: 'PRODUCTION RUNTIME // ZERO-TRUST // EN-US',
    navItems: [
      { id: 'home', label: 'Overview', num: '01' },
      { id: 'about', label: 'Engineering Bio', num: '02' },
      { id: 'projects', label: 'Projects', num: '03' },
      { id: 'launchpad', label: 'Launchpad', num: '04' },
      { id: 'ai-lab', label: 'AI Lab', num: '05' },
      { id: 'engineering', label: 'Architecture', num: '06' },
      { id: 'insights', label: 'Insights', num: '07' },
      { id: 'contact', label: 'Contact', num: '08' },
    ],
    heroBadge: 'Distributed Systems · AI Inference Pipelines · Algorithmic Trading',
    heroHeadline: 'Engineering Scalable Systems with High Mathematical Precision',
    heroSub: 'Architecting high-throughput financial trading systems, sovereign AI toolkits, and robust decoupled platforms built on defense-in-depth cybersecurity.',
    ctaExplore: 'Explore Case Studies',
    ctaAiLab: 'Enter AI Research Lab',
    stats: [
      { label: 'Order Execution Latency', value: '0.8', unit: 'ms' },
      { label: 'System Uptime SLA', value: '99.98', unit: '%' },
      { label: 'Autonomous Modules', value: '24+', unit: 'Active' },
      { label: 'Security Posture', value: 'Zero-Trust', unit: 'Armed' },
    ],
    nodeMatrixTitle: 'NODE TOPOLOGY MATRIX',
    nodeMatrixStatus: 'ALL RUNTIMES OPTIMAL',
    node1Title: 'MicroMap Algorithmic Core',
    node1Sub: 'Python 3.12 · Order Flow Analytics',
    node2Title: 'Sovereign AI Gateway',
    node2Sub: 'Gemini 2.5 Server API',
    node3Title: 'SAHAND CMS Platform',
    node3Sub: 'Decoupled WordPress Theme + Plugin',
    telemetrySession: 'SESSION: LONDON / NY',
    telemetryTick: 'TICK LATENCY: 0.8ms',
    domainsHeader: '02 // CAPABILITIES & DISCIPLINES',
    domainsTitle: 'Core Engineering Disciplines & Systems Expertise',
    domainsSub: 'Bridging applied mathematics, distributed real-time computing, and defense-in-depth cybersecurity.',
    domains: [
      {
        title: 'Artificial Intelligence & LLMs',
        desc: 'Server-side LLM inference pipelines, vector embeddings, semantic retrieval, and prompt injection defense.',
        tags: ['Gemini 2.5', 'Vector RAG', 'Token Defense'],
      },
      {
        title: 'Financial Systems & Algorithmic Trading',
        desc: 'High-frequency market microstructure mapping, London/NY liquidity filters, and paper testnets.',
        tags: ['Python 3.12', 'MicroMap', 'WebSockets'],
      },
      {
        title: 'Cybersecurity & Defense-in-Depth',
        desc: 'STRIDE threat modeling, least-privilege capability architecture, transient rate-limiting, and zero-trust verification.',
        tags: ['STRIDE', 'WP Nonces', 'CSP Strict'],
      },
      {
        title: 'Distributed Systems Architecture',
        desc: 'Clean separation between presentation and business logic, optimized for standard high-availability hosting.',
        tags: ['PHP 8.2+', 'MySQL 8.0', 'FastCGI Cache'],
      },
    ],
    projectsHeader: '03 // SELECTED CASE STUDIES',
    projectsTitle: 'Featured Engineering Projects & Implementations',
    viewAllProjects: 'View All Projects (12 Projects)',
    caseStudy1: {
      title: 'MicroMap Algorithmic Order Flow Trading Core',
      category: 'Financial Engineering & Real-Time Processing',
      status: 'PRODUCTION // ACTIVE',
      description: 'High-throughput price-action trading bot executing automated strategies across London & New York session liquidity windows. Integrates micro-structure depth filters and paper-trading environments with sub-millisecond execution.',
      metrics: [
        { label: 'Execution Latency', value: '< 1.2ms' },
        { label: 'Active Windows', value: 'London / NY' },
        { label: 'Core Runtime', value: 'Python 3.12' },
      ],
      tags: ['Python', 'WebSockets', 'MicroMap', 'Risk Management'],
      terminalLogs: [
        '[08:00:01 UTC] London Session Open Window Triggered',
        '> Evaluating MicroMap Liquidity Imbalance...',
        '> Volume Delta: +4,280 lots // Spread: 0.1 pips',
        '> Execution Condition Met. Order Dispatched.',
        '[08:00:01.002] ACK Received // Latency: 0.8ms',
      ],
    },
    caseStudy2: {
      title: 'SAHAND Decoupled WordPress Multilingual Platform',
      category: 'Infrastructure & Systems Architecture',
      status: 'DEPLOYED // VERSION 1.0',
      description: 'Architected sovereign decoupled WordPress theme and core functionality plugin running trilingual routing without database bloat, fortified with transient rate-limiting and zero-trust input validation.',
      metrics: [
        { label: 'Languages', value: 'FA / EN / TR' },
        { label: 'Database Overhead', value: 'Zero (Native)' },
        { label: 'Security Level', value: 'STRIDE Fortified' },
      ],
      tags: ['Decoupled WP', 'Custom Theme', 'Core Plugin', 'Polylang'],
      terminalLogs: [
        '> Bootstrapping sahand-core plugin... OK',
        '> Enforcing Security Headers: Content-Security-Policy armed',
        '> Nonce validation & transient rate-limiters active',
        '> Trilingual URL routing: /fa/, /en/, /tr/ operational',
      ],
    },
    aiLabHeader: '04 // AI RESEARCH LAB & SANDBOX',
    aiLabTitle: 'Autonomous AI Lab & Experiment Sandbox',
    aiLabBadge: 'SERVER-SIDE GEMINI API GATEWAY ARMED',
    aiModelLabel: 'Target Inference Model:',
    aiDefenseLabel: 'Prompt Defense: Active',
    aiRateLabel: 'Rate Limit: 5 req/min',
    aiPromptLabel: 'Test Query or Architectural Evaluation Prompt:',
    aiDefaultPrompt: 'Explain the architecture of the MicroMap order flow engine',
    aiBtnExecute: 'Run Model Inference',
    aiBtnExecuting: 'Inferring...',
    aiOutputHeader: 'Server inference completed in 480ms',
    aiOutputTag: 'Grounding verified against published data',
    aiSimulatedResult: '[MicroMap v2.4 Architecture Analysis]: Executes an event-driven order-flow pipeline filtering market depth and liquidity imbalances during London and New York trading sessions. Integrates sub-millisecond execution rules with strict risk constraints.',
    contactHeader: '05 // TECHNICAL COLLABORATION',
    contactTitle: 'Initiate Direct Technical Collaboration',
    contactSub: 'Available for technical consultation, algorithmic trading architecture, and sovereign AI integrations.',
    contactNameLabel: 'Your Full Name:',
    contactEmailLabel: 'Organization Email:',
    contactMsgLabel: 'Project Scope or Architectural Inquiry:',
    contactBtn: 'Transmit Secure Inquiry',
    contactSuccess: '✓ Inquiry securely encrypted and transmitted.',
    contactPgp: 'PGP Fingerprint: 4A8B 91F2 C04E 8A97',
    footerTagline: 'Personal Technology Hub by Sahand Haghi',
    footerSla: 'SLA: 99.98% Uptime',
    footerArch: 'Decoupled WordPress Architecture',
    footerReturnPortal: 'Return to Intro Portal',
    aboutTab: {
      badge: '02 // ENGINEERING BIOGRAPHY',
      title: 'Sahand Haghi — Principal Systems Architect & Software Engineer',
      bio: 'Software engineer and systems architect specializing in high-throughput distributed infrastructure, algorithmic financial engineering, and defense-in-depth cybersecurity. Committed to architectural precision, data sovereignty, and reliable digital systems.',
      experienceTitle: 'Engineering Philosophy',
      experienceText: 'Advocating for structural clarity over superficial complexity, millisecond-level latency optimizations, and self-hosted platform sustainability without vendor lock-in.',
    },
    launchpadTab: {
      badge: '04 // DIGITAL PRODUCTS & RELEASES',
      title: 'SAHAND Product Launchpad',
      desc: 'Independent developer utilities, microservices, and specialized software tools ready for production use.',
      items: [
        { name: 'MicroMap CLI Trading Utility', ver: 'v1.4.2 · Stable · Linux/macOS', desc: 'Lightweight terminal tool for monitoring liquidity windows and real-time execution alerts.', btn: 'Download Binary' },
        { name: 'SAHAND Decoupled WordPress Theme', ver: 'v1.0.0 · WP 6.7 Compatible', desc: 'High-performance theme built with CSS logical properties and zero frontend bloat.', btn: 'View Tech Docs' },
      ],
    },
  },

  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    dir: 'ltr',
    brandWordmark: 'SAHAND',
    secondaryBrand: 'سهند',
    tagline: 'Kişisel Teknoloji ve Sistem Mühendisliği Platformu',
    coordinates: 'SAHAND KOORDİNAT: 37.75°K // 46.42°D',
    introHeadline: 'Teknolojinin Ötesinde. Geleceği Şekillendiren Sistemler.',
    introSubheadline: 'Yapay Zekâ · Sistem Mühendisliği · Yazılım İnovasyonu · Dijital Ürünler',
    introCta: 'SAHAND Platformuna Giriş',
    introBadge: 'ÇALIŞMA ZAMANI // SIFIR GÜVEN // TR-TR',
    navItems: [
      { id: 'home', label: 'Ana Sayfa', num: '01' },
      { id: 'about', label: 'Hakkında', num: '02' },
      { id: 'projects', label: 'Projeler', num: '03' },
      { id: 'launchpad', label: 'Ürünler', num: '04' },
      { id: 'ai-lab', label: 'Yapay Zekâ', num: '05' },
      { id: 'engineering', label: 'Sistem Mimarisi', num: '06' },
      { id: 'insights', label: 'Teknik Yazılar', num: '07' },
      { id: 'contact', label: 'İletişim', num: '08' },
    ],
    heroBadge: 'Dağıtık Sistemler · Yapay Zekâ Boru Hatları · Algoritmik Finans',
    heroHeadline: 'Yüksek Matematiksel Hassasiyetle Ölçeklenebilir Sistemler',
    heroSub: 'Derinlemesine güvenlik mimarisi üzerine kurulu yüksek işlem kapasiteli finansal işlem motorları, yapay zekâ araçları ve bağımsız dijital ürünler geliştirme.',
    ctaExplore: 'Projeleri İnceleyin',
    ctaAiLab: 'Yapay Zekâ Laboratuvarı',
    stats: [
      { label: 'Emir Yürütme Gecikmesi', value: '0.8', unit: 'ms' },
      { label: 'Sistem Süreklilik Oranı', value: '99.98', unit: '%' },
      { label: 'Özerk Sistem Modülü', value: '24+', unit: 'Aktif' },
      { label: 'Güvenlik Durumu', value: 'Sıfır Güven', unit: 'Aktif' },
    ],
    nodeMatrixTitle: 'DÜĞÜM TOPOLOJİSİ VE SİSTEM MATRİSİ',
    nodeMatrixStatus: 'TÜM ÇALIŞMA ZAMANLARI OPTİMUM',
    node1Title: 'MicroMap Algoritmik Çekirdek',
    node1Sub: 'Python 3.12 · Emir Akışı Analitiği',
    node2Title: 'Özerk Yapay Zekâ Ağ Geçidi',
    node2Sub: 'Gemini 2.5 Sunucu API',
    node3Title: 'SAHAND CMS Platformu',
    node3Sub: 'Ayrık WordPress Teması + Eklentisi',
    telemetrySession: 'İŞLEM SEANSI: LONDRA / NY',
    telemetryTick: 'GECİKME: 0.8ms',
    domainsHeader: '02 // YETKİNLİKLER VE DİSİPLİNLER',
    domainsTitle: 'Temel Mühendislik Disiplinleri ve Sistem Uzmanlığı',
    domainsSub: 'Uygulamalı matematik, dağıtık gerçek zamanlı hesaplama ve derinlemesine siber güvenliğin birleşimi.',
    domains: [
      {
        title: 'Yapay Zekâ ve Dil Modelleri',
        desc: 'Sunucu taraflı LLM boru hatları, vektörel veri tabanları, anlamsal erişim ve komut enjeksiyonu savunması.',
        tags: ['Gemini 2.5', 'Vektör RAG', 'Token Savunması'],
      },
      {
        title: 'Finansal Sistemler ve Algoritmik İşlem',
        desc: 'Yüksek frekanslı piyasa derinliği analizi, Londra/NY likidite pencereleri ve test ortamları.',
        tags: ['Python 3.12', 'MicroMap', 'WebSockets'],
      },
      {
        title: 'Siber Güvenlik ve Çok Katmanlı Savunma',
        desc: 'STRIDE tehdit modellemesi, en az ayrıcalık yetkilendirmesi, geçici hız sınırlaması ve sıfır güven mimarisi.',
        tags: ['STRIDE', 'WP Nonce', 'CSP Katı'],
      },
      {
        title: 'Dağıtık Sistem Mimarisi',
        desc: 'Sunum katmanı ile iş mantığı katmanını tamamen ayıran, standart paylaşımlı barındırmaya uygun mimari.',
        tags: ['PHP 8.2+', 'MySQL 8.0', 'FastCGI Önbellek'],
      },
    ],
    projectsHeader: '03 // SEÇİLMİŞ VAKA ANALİZLERİ',
    projectsTitle: 'Öne Çıkan Mühendislik Projeleri ve Çözümler',
    viewAllProjects: 'Tüm Projeleri Görüntüle (12 Proje)',
    caseStudy1: {
      title: 'MicroMap Algoritmik Emir Akışı İşlem Çekirdeği',
      category: 'Finansal Mühendislik ve Gerçek Zamanlı İşleme',
      status: 'ÜRETİM ORTAMI // AKTİF',
      description: 'Londra ve New York seans likidite pencerelerinde otomatik işlem stratejilerini yürüten yüksek kapasiteli fiyat hareketi botu. Mikrosaniye düzeyinde emir yürütme ve entegre risk yönetimi kuralları.',
      metrics: [
        { label: 'Yürütme Hızı', value: '< 1.2ms' },
        { label: 'Aktif Seanslar', value: 'Londra / NY' },
        { label: 'Çekirdek Dil', value: 'Python 3.12' },
      ],
      tags: ['Python', 'WebSockets', 'MicroMap', 'Risk Yönetimi'],
      terminalLogs: [
        '[08:00:01 UTC] Londra Seansı Açılış Penceresi Tetiklendi',
        '> MicroMap Likidite Dengesizliği Hesaplanıyor...',
        '> Hacim Deltası: +4,280 lot // Fark: 0.1 pip',
        '> Algoritmik Koşul Sağlandı. Emir İletildi.',
        '[08:00:01.002] Onay Alındı // Gecikme: 0.8ms',
      ],
    },
    caseStudy2: {
      title: 'SAHAND Ayrık WordPress Çok Dilli Platform Mimarisi',
      category: 'Altyapı ve Sistem Mimarisi',
      status: 'YAYINDA // SÜRÜM 1.0',
      description: 'Veri tabanı şişkinliği yaratmadan üç dilli yönlendirmeyi yöneten, geçici istek sınırlaması ve sıfır güven mimarisiyle güçlendirilmiş bağımsız WordPress teması ve çekirdek eklentisi.',
      metrics: [
        { label: 'Desteklenen Diller', value: 'FA / EN / TR' },
        { label: 'Veri Tabanı Yükü', value: 'Sıfır (Yerel)' },
        { label: 'Güvenlik Standardı', value: 'STRIDE Onaylı' },
      ],
      tags: ['Ayrık WP', 'Özel Tema', 'Çekirdek Eklenti', 'Polylang'],
      terminalLogs: [
        '> sahand-core eklentisi başlatılıyor... Başarılı',
        '> Güvenlik Başlıkları Uygulandı: Content-Security-Policy devrede',
        '> Nonce doğrulaması ve IP sınırlamaları devrede',
        '> Çok dilli yönlendirme: /fa/, /en/, /tr/ aktif',
      ],
    },
    aiLabHeader: '04 // YAPAY ZEKÂ ARAŞTIRMA LABORATUVARI',
    aiLabTitle: 'Özerk Yapay Zekâ ve Model Deney Ortamı',
    aiLabBadge: 'SUNUCU TARAFLI GEMINI 2.5 API AĞ GEÇİDİ AKTİF',
    aiModelLabel: 'Hedef Model:',
    aiDefenseLabel: 'Komut Enjeksiyonu Koruması: Aktif',
    aiRateLabel: 'Hız Limiti: 5 istek/dk',
    aiPromptLabel: 'Test Sorgusu veya Sistem Mimarisi Değerlendirmesi:',
    aiDefaultPrompt: 'MicroMap emir akışı motorunun mimari yapısını analiz edin',
    aiBtnExecute: 'Modeli Çalıştır',
    aiBtnExecuting: 'İşleniyor...',
    aiOutputHeader: 'Sunucu çıkarımı 480 ms içinde tamamlandı',
    aiOutputTag: 'Doğruluk ve veri kaynağı onaylandı',
    aiSimulatedResult: '[MicroMap v2.4 Mimari Analizi]: Londra ve New York işlem seanslarında piyasa derinliği ve likidite dengesizliklerini filtreleyen olaya dayalı bir emir akışı boru hattı çalıştırır. Katı risk kısıtlamalarıyla milisaniye altı yürütme kurallarını uygular.',
    contactHeader: '05 // TEKNİK İŞ BİRLİĞİ',
    contactTitle: 'Doğrudan Teknik İletişim ve İş Birliği',
    contactSub: 'Dağıtık sistem mimarisi, algoritmik finans ve yapay zekâ entegrasyonları konularında teknik danışmanlık.',
    contactNameLabel: 'Adınız ve Soyadınız:',
    contactEmailLabel: 'Kurumsal E-posta Adresi:',
    contactMsgLabel: 'Proje Kapsamı veya Teknik Soru:',
    contactBtn: 'Güvenli Mesajı İlet',
    contactSuccess: '✓ Mesajınız şifrelenerek başarıyla iletildi.',
    contactPgp: 'PGP Parmak İzi: 4A8B 91F2 C04E 8A97',
    footerTagline: 'Sahand Haghi Kişisel Teknoloji ve Mühendislik Platformu',
    footerSla: 'SLA: %99.98 Süreklilik',
    footerArch: 'Ayrık WordPress Mimarisi',
    footerReturnPortal: 'Giriş Portaline Dön',
    aboutTab: {
      badge: '02 // MÜHENDİSLİK BİYOGRAFİSİ',
      title: 'Sahand Haghi — Kıdemli Sistem Mimarı ve Yazılım Mühendisi',
      bio: 'Yüksek kapasiteli dağıtık sistemler, algoritmik finans mühendisliği ve derinlemesine siber güvenlik alanlarında uzmanlaşmış yazılım mühendisi. Mühendislik disiplini, veri egemenliği ve güvenilir sistem tasarımı ilkelerine bağlıdır.',
      experienceTitle: 'Mühendislik Yaklaşımı',
      experienceText: 'Yüzeysel karmaşıklık yerine mimari sadelik, milisaniye düzeyinde gecikme optimizasyonu ve dışa bağımlılığı en aza indiren bağımsız altyapı sürdürülebilirliği.',
    },
    launchpadTab: {
      badge: '04 // DİJİTAL ÜRÜNLER VE SÜRÜMLER',
      title: 'SAHAND Ürün Platformu',
      desc: 'Geliştiriciler için bağımsız araçlar, mikro servisler ve üretime hazır yazılımlar.',
      items: [
        { name: 'MicroMap CLI İşlem Aracı', ver: 'v1.4.2 · Kararlı · Linux/macOS', desc: 'Likidite pencerelerini izlemek için hafif terminal izleme aracı.', btn: 'Sürümü İndir' },
        { name: 'SAHAND Ayrık WordPress Teması', ver: 'v1.0.0 · WP 6.7 Uyumlu', desc: 'CSS mantıksal özellikleri ile inşa edilmiş yüksek performanslı bağımsız tema.', btn: 'Teknik Belgeyi İncele' },
      ],
    },
  },
};

export default function App() {
  const [selectedLang, setSelectedLang] = useState<Language>('fa');
  const [hoveredLang, setHoveredLang] = useState<Language | null>(null);
  const [inPortalMode, setInPortalMode] = useState<boolean>(false);
  const [showLogoInspector, setShowLogoInspector] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // AI sandbox state
  const [aiModel, setAiModel] = useState<string>('gemini-2.5-flash');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [inferenceTelemetry, setInferenceTelemetry] = useState<any>(null);

  // WordPress Edition modal state
  const [isWpModalOpen, setIsWpModalOpen] = useState<boolean>(false);

  // Contact form submission state
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Canvas ref for approved intro screen
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentContent = CONTENT[selectedLang];
  const previewContent = hoveredLang ? CONTENT[hoveredLang] : currentContent;

  // Initialize prompt when language changes
  useEffect(() => {
    setAiPrompt(currentContent.aiDefaultPrompt);
    setAiOutput(null);
  }, [selectedLang]);

  // Approved Neural Canvas Animation for Intro Screen
  useEffect(() => {
    if (inPortalMode || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodeCount = Math.min(55, Math.floor(window.innerWidth / 25));
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }

    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(2, 132, 199, ' : 'rgba(56, 189, 248, ',
        pulse: Math.random() * Math.PI,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      gradient.addColorStop(0, '#0a101f');
      gradient.addColorStop(0.5, '#070b14');
      gradient.addColorStop(1, '#03060b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.02;
        const currentAlpha = 0.35 + Math.sin(node.pulse) * 0.25;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${currentAlpha})`;
        ctx.shadowColor = '#0284C7';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [inPortalMode, reducedMotion]);

  // Handle language switch
  const handleSelectLanguage = (lang: Language) => {
    setSelectedLang(lang);
    setInPortalMode(true);
  };

  // Run AI sandbox inference with real backend gateway and diagnostic telemetry
  const handleRunAiInference = async (customPrompt?: string, customModel?: string) => {
    const promptToSend = (customPrompt !== undefined ? customPrompt : aiPrompt) || currentContent.aiDefaultPrompt;
    const modelToSend = customModel || aiModel;
    setAiGenerating(true);
    setAiOutput(null);
    const start = Date.now();

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          task: 'market-analysis-and-engineering',
          language: selectedLang,
          model: modelToSend,
        }),
      });

      const data = await res.json();
      const latency = Date.now() - start;

      setInferenceTelemetry({
        model: modelToSend,
        latency_ms: latency,
        source: data.source || (res.ok ? 'gemini-live' : 'error'),
        httpStatus: res.status,
        status: res.ok ? 'SUCCESS' : 'FAILED',
        diagnostics: data.diagnostics || null,
      });

      if (res.ok && data.text) {
        setAiOutput(data.text);
      } else {
        setAiOutput(data.text || data.error || 'Inference execution completed with fallback response.');
      }
    } catch (err: unknown) {
      const latency = Date.now() - start;
      setInferenceTelemetry({
        model: modelToSend,
        latency_ms: latency,
        source: 'client-error',
        httpStatus: 0,
        status: 'NETWORK_ERROR',
        diagnostics: { error: err instanceof Error ? err.message : 'Fetch failed' },
      });
      setAiOutput(currentContent.aiSimulatedResult);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div 
      className={`min-h-screen ${
        selectedLang === 'fa' ? 'font-persian' : 'font-latin'
      }`}
      dir={inPortalMode ? currentContent.dir : 'ltr'}
    >
      {!inPortalMode ? (
        /* ============================================================== */
        /* APPROVED CINEMATIC FULL-SCREEN MULTILINGUAL INTRO PORTAL       */
        /* (STRUCTURE PRESERVED — UPDATED WITH NEW MOUNT SAHAND EMBLEM)   */
        /* ============================================================== */
        <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#070b14] text-white select-none">
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

          {/* Top Architectural Header Bar */}
          <header className="relative z-10 w-full px-6 py-6 sm:px-12 flex items-center justify-between border-b border-white/[0.06] backdrop-blur-md bg-[#070b14]/50">
            <div className="flex items-center gap-3">
              <SahandLogo size="sm" variant="horizontal" lang={selectedLang} showSubtitle={false} />
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] font-mono text-[11px] text-sky-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{previewContent.introBadge}</span>
              </div>

              <button
                onClick={() => setShowLogoInspector(true)}
                title="Inspect Mount Sahand SVG Logo System"
                className="px-2.5 py-1.5 rounded-md border border-sky-400/30 bg-sky-500/10 text-sky-300 hover:text-white hover:border-sky-400/60 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.15)]"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">SVG Identity</span>
              </button>

              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                title="Toggle Reduced Motion"
                className="px-2.5 py-1.5 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs font-mono transition-colors"
              >
                {reducedMotion ? 'MOTION: OFF' : 'MOTION: ON'}
              </button>
            </div>
          </header>

          {/* Central Hero Portal Experience */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 max-w-5xl mx-auto w-full text-center">
            
            {/* New Mount Sahand Vector Identity Emblem */}
            <div className="relative mb-8 group cursor-default">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-blue-600/20 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-b from-[#131d33] to-[#0a1122] border border-sky-400/40 p-4 shadow-[0_0_30px_rgba(2,132,199,0.25)] flex items-center justify-center">
                <SahandEmblem size={68} theme="dark" />
              </div>
            </div>

            {/* Brand Title (Correctly displays 'سهند' or 'SAHAND') */}
            <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.18em] text-white mb-4">
              {previewContent.brandWordmark}
            </h1>

            {/* Professionally Localized Headline */}
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white/95 tracking-tight max-w-3xl leading-snug mb-4">
              {previewContent.introHeadline}
            </p>

            {/* Supporting Statement */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-sky-400/90 font-mono tracking-wider mb-10 max-w-2xl">
              <span>{previewContent.introSubheadline}</span>
            </div>

            {/* Trilingual Language Selector Grid */}
            <div className="w-full max-w-3xl">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center justify-center gap-2">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>SELECT REGION & LANGUAGE / زبان را انتخاب کنید</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Persian fa-IR */}
                <button
                  onClick={() => handleSelectLanguage('fa')}
                  onMouseEnter={() => setHoveredLang('fa')}
                  onMouseLeave={() => setHoveredLang(null)}
                  className={`group relative p-5 rounded-xl border text-right transition-all duration-300 backdrop-blur-md cursor-pointer ${
                    selectedLang === 'fa'
                      ? 'bg-sky-950/40 border-sky-400 shadow-[0_0_25px_rgba(2,132,199,0.35)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-sky-400/60 hover:bg-white/[0.06]'
                  }`}
                  dir="rtl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-white font-persian group-hover:text-sky-300 transition-colors">
                      فارسی
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      /fa/ · راست‌چین
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-persian leading-relaxed">
                    ورود به پلتفرم تخصصی سهند
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-400/90 font-medium font-persian">
                    <span>ورود به پایگاه فنی</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </div>
                </button>

                {/* English en-US */}
                <button
                  onClick={() => handleSelectLanguage('en')}
                  onMouseEnter={() => setHoveredLang('en')}
                  onMouseLeave={() => setHoveredLang(null)}
                  className={`group relative p-5 rounded-xl border text-left transition-all duration-300 backdrop-blur-md cursor-pointer ${
                    selectedLang === 'en'
                      ? 'bg-sky-950/40 border-sky-400 shadow-[0_0_25px_rgba(2,132,199,0.35)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-sky-400/60 hover:bg-white/[0.06]'
                  }`}
                  dir="ltr"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-white font-latin group-hover:text-sky-300 transition-colors">
                      English
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      /en/ · LTR
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-latin leading-relaxed">
                    Technology & Systems Engineering Hub
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-400/90 font-medium font-latin">
                    <span>Enter Hub</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>

                {/* Turkish tr-TR */}
                <button
                  onClick={() => handleSelectLanguage('tr')}
                  onMouseEnter={() => setHoveredLang('tr')}
                  onMouseLeave={() => setHoveredLang(null)}
                  className={`group relative p-5 rounded-xl border text-left transition-all duration-300 backdrop-blur-md cursor-pointer ${
                    selectedLang === 'tr'
                      ? 'bg-sky-950/40 border-sky-400 shadow-[0_0_25px_rgba(2,132,199,0.35)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-sky-400/60 hover:bg-white/[0.06]'
                  }`}
                  dir="ltr"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-white font-latin group-hover:text-sky-300 transition-colors">
                      Türkçe
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      /tr/ · LTR
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-latin leading-relaxed">
                    Teknoloji ve Mühendislik Platformu
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-400/90 font-medium font-latin">
                    <span>Platforma Giriş</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </div>
            </div>

            {/* Direct Quick Enter Button */}
            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={() => setInPortalMode(true)}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm transition-all duration-200 shadow-[0_0_20px_rgba(2,132,199,0.4)] hover:shadow-[0_0_30px_rgba(2,132,199,0.6)] cursor-pointer"
              >
                <span>{previewContent.introCta}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </main>

          {/* Telemetry Footer */}
          <footer className="relative z-10 w-full px-6 py-4 sm:px-12 border-t border-white/[0.06] backdrop-blur-md bg-[#070b14]/50 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/40 gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400/90">
                <Lock className="w-3 h-3" />
                <span>DEFENSE-IN-DEPTH SECURITY ARCHITECTURE</span>
              </span>
              <span className="hidden md:inline text-white/20">|</span>
              <span className="hidden md:inline">DOMAIN: SAHANDHAGHI.SITE</span>
            </div>

            <div className="flex items-center gap-4">
              <span>{previewContent.coordinates}</span>
              <span className="text-white/20">|</span>
              <span>© {new Date().getFullYear()} {previewContent.brandWordmark}</span>
            </div>
          </footer>
        </div>
      ) : (
        /* ============================================================== */
        /* REDESIGNED INTERNAL WEBSITE WITH FULL PROFESSIONAL LOCALIZATION */
        /* ============================================================== */
        <div className="min-h-screen bg-[#0A0E17] text-gray-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
          
          {/* Top Precision Engineering Header */}
          <header className="sticky top-0 z-50 bg-[#070A11]/90 backdrop-blur-xl border-b border-white/[0.08]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
              
              {/* Brand Logo with Mount Sahand Identity */}
              <button
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-3 text-left cursor-pointer group"
              >
                <SahandLogo size="sm" variant="horizontal" lang={selectedLang} showSubtitle={false} />
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* Navigation Tabs (100% Localized, zero English leaking in Persian/Turkish) */}
              <nav className="hidden xl:flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl">
                {currentContent.navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-[0_0_12px_rgba(2,132,199,0.2)]'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-[9px] font-mono opacity-50">{item.num}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Language Switcher & Controls */}
              <div className="flex items-center gap-2.5">
                
                {/* Trilingual Switcher Dropdown */}
                <div className="flex items-center bg-white/[0.04] p-1 rounded-lg border border-white/[0.08]">
                  <button
                    onClick={() => setSelectedLang('fa')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                      selectedLang === 'fa'
                        ? 'bg-sky-500 text-white font-semibold shadow-[0_0_10px_rgba(2,132,199,0.4)]'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    فا
                  </button>
                  <button
                    onClick={() => setSelectedLang('en')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                      selectedLang === 'en'
                        ? 'bg-sky-500 text-white font-semibold shadow-[0_0_10px_rgba(2,132,199,0.4)]'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setSelectedLang('tr')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                      selectedLang === 'tr'
                        ? 'bg-sky-500 text-white font-semibold shadow-[0_0_10px_rgba(2,132,199,0.4)]'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    TR
                  </button>
                </div>

                {/* WordPress Edition Modal Trigger */}
                <button
                  onClick={() => setIsWpModalOpen(true)}
                  title="WordPress Production CMS Edition & Manifest"
                  className="px-3 py-1.5 text-xs font-mono text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/30 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                >
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">
                    {selectedLang === 'fa' ? 'نسخه وردپرس' : selectedLang === 'tr' ? 'WordPress Sürümü' : 'WordPress Edition'}
                  </span>
                </button>

                {/* SVG Logo System Inspector Trigger */}
                <button
                  onClick={() => setShowLogoInspector(true)}
                  title="Inspect Mount Sahand SVG Logo System"
                  className="px-3 py-1.5 text-xs font-mono text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">
                    {selectedLang === 'fa' ? 'سیستم لوگوی سهند' : selectedLang === 'tr' ? 'SVG Logo Sistemi' : 'SVG Logo System'}
                  </span>
                </button>

                {/* Return to Intro Portal */}
                <button
                  onClick={() => setInPortalMode(false)}
                  title="Return to Full-screen Intro"
                  className="px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline">{currentContent.footerReturnPortal}</span>
                </button>

                {/* Mobile Drawer Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white/80 hover:text-white"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
              <div className="xl:hidden bg-[#070A11] border-b border-white/[0.1] px-6 py-4 animate-in slide-in-from-top">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {currentContent.navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-3 rounded-lg text-left flex items-center justify-between border ${
                        activeTab === item.id
                          ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/70'
                      }`}
                    >
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="text-[10px] font-mono text-white/40">{item.num}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* ============================================================== */}
          {/* TAB CONTENT SWITCHER                                           */}
          {/* ============================================================== */}
          <main className="flex-1">
            
            {activeTab === 'home' && (
              <>
                {/* -------------------------------------------------------- */}
                {/* 1. HERO BLUEPRINT SECTION                                */}
                {/* -------------------------------------------------------- */}
                <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/[0.08]">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

                  <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
                    
                    {/* Top Identity Ribbon */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 font-mono text-xs text-sky-400">
                        <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                        <span>{currentContent.heroBadge}</span>
                      </div>
                      <div className="font-mono text-xs text-white/40 flex items-center gap-3">
                        <span>{currentContent.coordinates}</span>
                      </div>
                    </div>

                    {/* Editorial Main Headline & Node Architecture */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      {/* Left: Headline & Bio */}
                      <div className="lg:col-span-7">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.18] mb-6">
                          {currentContent.heroHeadline}
                        </h1>

                        <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl font-light">
                          {currentContent.heroSub}
                        </p>

                        {/* Interactive CTAs */}
                        <div className="flex flex-wrap items-center gap-4">
                          <button
                            onClick={() => setActiveTab('projects')}
                            className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm transition-all shadow-[0_0_25px_rgba(2,132,199,0.4)] flex items-center gap-2 cursor-pointer"
                          >
                            <span>{currentContent.ctaExplore}</span>
                            {selectedLang === 'fa' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => setActiveTab('ai-lab')}
                            className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-white font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Cpu className="w-4 h-4 text-sky-400" />
                            <span>{currentContent.ctaAiLab}</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Technical Systems Node Visual Artwork (100% Localized) */}
                      <div className="lg:col-span-5">
                        <div className="relative rounded-2xl bg-gradient-to-b from-[#0F1626] to-[#0A0E17] border border-white/[0.12] p-6 shadow-2xl overflow-hidden">
                          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] font-mono text-xs">
                            <span className="text-sky-400 flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5" />
                              {currentContent.nodeMatrixTitle}
                            </span>
                            <span className="text-emerald-400 text-[10px]">{currentContent.nodeMatrixStatus}</span>
                          </div>

                          <div className="space-y-3 font-mono text-xs">
                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                                <span className="text-white/80">{currentContent.node1Title}</span>
                              </div>
                              <span className="text-sky-400 text-[11px]">{currentContent.node1Sub}</span>
                            </div>

                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-white/80">{currentContent.node2Title}</span>
                              </div>
                              <span className="text-emerald-400 text-[11px]">{currentContent.node2Sub}</span>
                            </div>

                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-purple-400" />
                                <span className="text-white/80">{currentContent.node3Title}</span>
                              </div>
                              <span className="text-purple-400 text-[11px]">{currentContent.node3Sub}</span>
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/50">
                            <span>{currentContent.telemetrySession}</span>
                            <span className="text-sky-400 font-semibold">{currentContent.telemetryTick}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KPI Metric Ribbon */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {currentContent.stats.map((stat, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
                          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
                            <span>{stat.value}</span>
                            {stat.unit && <span className="text-xs text-sky-400 font-normal">{stat.unit}</span>}
                          </div>
                          <div className="text-xs text-white/50 mt-1 font-mono">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* 2. CORE DOMAINS & ENGINEERING (CONTRAST ARCHITECTURAL LIGHT) */}
                {/* -------------------------------------------------------- */}
                <section className="py-20 bg-[#FAFAFB] text-gray-950 border-b border-gray-200 relative overflow-hidden">
                  {/* Subtle, Low-Impact Engineering Pipeline Data-Flow Background */}
                  <NeuralDataFlowBackground
                    variant="engineering"
                    theme="light"
                    isRtl={selectedLang === 'fa'}
                    reducedMotion={reducedMotion}
                  />

                  <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-gray-200 pb-8">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider mb-2">
                          <span>{currentContent.domainsHeader}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                          {currentContent.domainsTitle}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-600 max-w-md mt-4 md:mt-0 font-light leading-relaxed">
                        {currentContent.domainsSub}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {currentContent.domains.map((dom, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-sky-500/50 hover:shadow-lg transition-all group">
                          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                            {i === 0 && <Cpu className="w-6 h-6" />}
                            {i === 1 && <Zap className="w-6 h-6" />}
                            {i === 2 && <ShieldCheck className="w-6 h-6" />}
                            {i === 3 && <Layers className="w-6 h-6" />}
                          </div>
                          <h3 className="text-lg font-bold text-gray-950 mb-2">
                            {dom.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed mb-4">
                            {dom.desc}
                          </p>
                          <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-sky-800">
                            {dom.tags.map((t, ti) => (
                              <span key={ti} className="px-2 py-0.5 rounded bg-sky-50 border border-sky-100">{t}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* 3. CASE STUDIES & REAL IMPLEMENTATIONS                   */}
                {/* -------------------------------------------------------- */}
                <section className="py-24 bg-[#070A11] text-white border-b border-white/[0.08]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/[0.08] pb-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>{currentContent.projectsHeader}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                          {currentContent.projectsTitle}
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab('projects')}
                        className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1.5 mt-4 md:mt-0 cursor-pointer"
                      >
                        <span>{currentContent.viewAllProjects}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Case Study 1: MicroMap */}
                    <div className="mb-16 rounded-2xl bg-gradient-to-br from-[#0F1626] to-[#0A0E17] border border-white/[0.1] overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 lg:p-12 items-center">
                        <div className="lg:col-span-7">
                          <div className="flex items-center gap-2 mb-4 font-mono text-xs">
                            <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                              {currentContent.caseStudy1.status}
                            </span>
                            <span className="text-white/40">{currentContent.caseStudy1.category}</span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                            {currentContent.caseStudy1.title}
                          </h3>

                          <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
                            {currentContent.caseStudy1.description}
                          </p>

                          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs mb-6">
                            {currentContent.caseStudy1.metrics.map((m, mi) => (
                              <div key={mi}>
                                <span className="text-white/40 block text-[10px]">{m.label}</span>
                                <span className="text-sky-400 font-bold">{m.value}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {currentContent.caseStudy1.tags.map((tg, tgi) => (
                              <span key={tgi} className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-white/70">
                                {tg}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Simulated Terminal in Active Language */}
                        <div className="lg:col-span-5 bg-[#05080E] rounded-xl border border-white/[0.1] p-5 font-mono text-xs shadow-inner">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-white/40 text-[10px]">
                            <span>micromap_core_execution.log</span>
                            <span className="text-emerald-400">● LIVE</span>
                          </div>
                          <div className="space-y-2 text-[11px]">
                            {currentContent.caseStudy1.terminalLogs.map((log, li) => (
                              <div key={li} className={li === 2 ? 'text-emerald-400' : li === 3 ? 'text-white' : 'text-sky-300'}>
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Case Study 2: Decoupled Multilingual Architecture */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#0F1626] to-[#0A0E17] border border-white/[0.1] overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 lg:p-12 items-center">
                        <div className="lg:col-span-7">
                          <div className="flex items-center gap-2 mb-4 font-mono text-xs">
                            <span className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
                              {currentContent.caseStudy2.status}
                            </span>
                            <span className="text-white/40">{currentContent.caseStudy2.category}</span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                            {currentContent.caseStudy2.title}
                          </h3>

                          <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
                            {currentContent.caseStudy2.description}
                          </p>

                          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs mb-6">
                            {currentContent.caseStudy2.metrics.map((m, mi) => (
                              <div key={mi}>
                                <span className="text-white/40 block text-[10px]">{m.label}</span>
                                <span className="text-emerald-400 font-bold">{m.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Architecture Flow Display */}
                        <div className="lg:col-span-5 bg-[#05080E] rounded-xl border border-white/[0.1] p-5 font-mono text-xs">
                          <div className="text-white/40 text-[10px] pb-2 mb-3 border-b border-white/[0.06]">
                            DECOUPLED ARCHITECTURE STACK
                          </div>
                          <div className="space-y-2">
                            {currentContent.caseStudy2.terminalLogs.map((log, li) => (
                              <div key={li} className="p-2 rounded bg-white/[0.02] border border-white/[0.05] text-sky-200">
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* 4. AI RESEARCH LAB SANDBOX                               */}
                {/* -------------------------------------------------------- */}
                <section className="py-24 bg-[#0A0E17] text-white border-b border-white/[0.08] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-600/10 blur-[120px] pointer-events-none" />

                  {/* Subtle, Low-Impact Animated SVG Neural Network Data-Flow Background */}
                  <NeuralDataFlowBackground
                    variant="ai-lab"
                    theme="dark"
                    isRtl={selectedLang === 'fa'}
                    isGenerating={aiGenerating}
                    reducedMotion={reducedMotion}
                  />

                  <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/[0.08] pb-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-2">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>{currentContent.aiLabHeader}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                          {currentContent.aiLabTitle}
                        </h2>
                      </div>
                      <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mt-4 md:mt-0">
                        {currentContent.aiLabBadge}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-[#070A11] border border-white/[0.12] p-6 lg:p-8 shadow-2xl">
                      
                      {/* Model Selector Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-white/50">{currentContent.aiModelLabel}</span>
                          <div className="flex items-center gap-2">
                            {['gemini-2.5-flash', 'gemini-2.5-pro'].map((model) => (
                              <button
                                key={model}
                                onClick={() => setAiModel(model)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                  aiModel === model
                                    ? 'bg-sky-500 text-white font-semibold shadow-[0_0_12px_rgba(2,132,199,0.4)]'
                                    : 'bg-white/[0.04] text-white/60 hover:text-white'
                                }`}
                              >
                                {model}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                          <span>{currentContent.aiDefenseLabel}</span>
                          <span>{currentContent.aiRateLabel}</span>
                        </div>
                      </div>

                      {/* Interactive Prompt & Input */}
                      <div className="mb-6">
                        <label className="block text-xs font-mono text-white/60 mb-2">
                          {currentContent.aiPromptLabel}
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-hidden focus:border-sky-400 transition-colors"
                          />
                          <button
                            onClick={() => handleRunAiInference()}
                            disabled={aiGenerating}
                            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-medium text-sm font-mono flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(2,132,199,0.3)] shrink-0"
                          >
                            {aiGenerating ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{currentContent.aiBtnExecuting}</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span>{currentContent.aiBtnExecute}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Model Output */}
                      {aiOutput && (
                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] font-mono text-xs text-sky-200 leading-relaxed animate-in fade-in">
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06] text-white/40 text-[10px]">
                            <span>{currentContent.aiOutputHeader}</span>
                            <span className="text-emerald-400">{currentContent.aiOutputTag}</span>
                          </div>
                          {aiOutput}
                        </div>
                      )}

                    </div>

                    {/* Integrated Build Status Dashboard & AI Gateway Diagnostic Telemetry */}
                    <div className="mt-8 space-y-8">
                      <BuildStatusDashboard
                        lang={selectedLang}
                        onOpenWpModal={() => setIsWpModalOpen(true)}
                      />
                      <AiGatewayDiagnosticTool
                        lang={selectedLang}
                        lastInferenceTelemetry={inferenceTelemetry}
                        onRunTestInference={(model, prompt) => handleRunAiInference(prompt, model)}
                      />
                    </div>

                  </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* 5. CONTACT & COLLABORATION TERMINAL                      */}
                {/* -------------------------------------------------------- */}
                <section className="py-24 bg-[#070B14] text-white border-t border-white/[0.08]">
                  <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
                    
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-sky-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(2,132,199,0.3)]">
                      <Terminal className="w-7 h-7" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                      {currentContent.contactTitle}
                    </h2>

                    <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-8 font-light">
                      {currentContent.contactSub}
                    </p>

                    <div className="p-6 sm:p-8 rounded-2xl bg-[#0B101C] border border-white/[0.1] text-start max-w-xl mx-auto shadow-2xl">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono text-white/50 mb-1">{currentContent.contactNameLabel}</label>
                          <input 
                            type="text" 
                            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-white/50 mb-1">{currentContent.contactEmailLabel}</label>
                          <input 
                            type="email" 
                            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-white/50 mb-1">{currentContent.contactMsgLabel}</label>
                          <textarea 
                            rows={3} 
                            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-hidden focus:border-sky-400"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setContactStatus('submitting');
                            setTimeout(() => setContactStatus('success'), 600);
                          }}
                          className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-mono font-medium text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(2,132,199,0.4)] cursor-pointer"
                        >
                          {contactStatus === 'success' ? currentContent.contactSuccess : currentContent.contactBtn}
                        </button>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/30">
                        <span>{currentContent.contactPgp}</span>
                        <span>RATE-LIMIT: 5 REQ/10M</span>
                      </div>
                    </div>

                  </div>
                </section>
              </>
            )}

            {/* Dedicated Interior Tabs (Full Native Translations) */}
            {activeTab === 'about' && (
              <section className="py-20 max-w-4xl mx-auto px-4 sm:px-8">
                <div className="p-8 sm:p-12 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                  <span className="font-mono text-xs text-sky-400">{currentContent.aboutTab.badge}</span>
                  <h2 className="text-3xl font-extrabold text-white mt-3 mb-6">{currentContent.aboutTab.title}</h2>
                  <p className="text-gray-300 leading-relaxed text-base mb-8 font-light">{currentContent.aboutTab.bio}</p>
                  
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <h3 className="text-lg font-bold text-white mb-2">{currentContent.aboutTab.experienceTitle}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{currentContent.aboutTab.experienceText}</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'projects' && (
              <section className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
                <span className="font-mono text-xs text-sky-400">{currentContent.projectsHeader}</span>
                <h2 className="text-3xl font-extrabold text-white mt-2 mb-8">{currentContent.projectsTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                    <div className="text-xs font-mono text-emerald-400 mb-2">{currentContent.caseStudy1.status}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{currentContent.caseStudy1.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">{currentContent.caseStudy1.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentContent.caseStudy1.tags.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-sky-300">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                    <div className="text-xs font-mono text-sky-400 mb-2">{currentContent.caseStudy2.status}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{currentContent.caseStudy2.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">{currentContent.caseStudy2.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentContent.caseStudy2.tags.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-sky-300">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'launchpad' && (
              <section className="py-20 max-w-5xl mx-auto px-4 sm:px-8">
                <span className="font-mono text-xs text-sky-400">{currentContent.launchpadTab.badge}</span>
                <h2 className="text-3xl font-extrabold text-white mt-2 mb-4">{currentContent.launchpadTab.title}</h2>
                <p className="text-sm text-gray-400 mb-8">{currentContent.launchpadTab.desc}</p>
                <div className="space-y-4">
                  {currentContent.launchpadTab.items.map((it, idx) => (
                    <div key={idx} className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{it.name}</h3>
                        <div className="text-xs font-mono text-sky-400 mt-0.5">{it.ver}</div>
                        <p className="text-xs text-gray-400 mt-2">{it.desc}</p>
                      </div>
                      <button className="px-5 py-2.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-mono shrink-0 cursor-pointer flex items-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        <span>{it.btn}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'ai-lab' && (
              <section className="py-20 max-w-5xl mx-auto px-4 sm:px-8 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
                {/* Subtle Neural Network SVG Data-Flow Background */}
                <NeuralDataFlowBackground
                  variant="ai-lab"
                  theme="dark"
                  isRtl={selectedLang === 'fa'}
                  isGenerating={aiGenerating}
                  reducedMotion={reducedMotion}
                />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="font-mono text-xs text-sky-400">{currentContent.aiLabHeader}</span>
                      <h2 className="text-3xl font-extrabold text-white mt-1">{currentContent.aiLabTitle}</h2>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
                      {currentContent.aiLabBadge}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[#070A11]/90 backdrop-blur-md border border-white/[0.12] p-6 sm:p-8 shadow-2xl space-y-6">
                    {/* Model Selector Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/50">{currentContent.aiModelLabel}</span>
                        <div className="flex items-center gap-2">
                          {['gemini-2.5-flash', 'gemini-2.5-pro'].map((model) => (
                            <button
                              key={model}
                              onClick={() => setAiModel(model)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                aiModel === model
                                  ? 'bg-sky-500 text-white font-semibold shadow-[0_0_12px_rgba(2,132,199,0.4)]'
                                  : 'bg-white/[0.04] text-white/60 hover:text-white'
                              }`}
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                        <span>{currentContent.aiDefenseLabel}</span>
                        <span>{currentContent.aiRateLabel}</span>
                      </div>
                    </div>

                    {/* Interactive Prompt Runner */}
                    <div>
                      <label className="block text-xs font-mono text-white/60 mb-2">
                        {currentContent.aiPromptLabel}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder={currentContent.aiDefaultPrompt}
                          className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-hidden focus:border-sky-400 transition-colors"
                        />
                        <button
                          onClick={() => handleRunAiInference()}
                          disabled={aiGenerating}
                          className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-medium text-sm font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(2,132,199,0.3)] shrink-0"
                        >
                          {aiGenerating ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>{currentContent.aiBtnExecuting}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>{currentContent.aiBtnExecute}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Model Output Console */}
                    {aiOutput ? (
                      <div className="p-5 rounded-xl bg-black/40 border border-emerald-500/30 font-mono text-xs text-sky-200 leading-relaxed animate-in fade-in">
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06] text-white/40 text-[10px]">
                          <span>{currentContent.aiOutputHeader}</span>
                          <span className="text-emerald-400">{currentContent.aiOutputTag}</span>
                        </div>
                        {aiOutput}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-gray-300 font-light leading-relaxed">
                        {currentContent.aiSimulatedResult}
                      </div>
                    )}
                  </div>

                  {/* Build Status Dashboard & AI Gateway Diagnostic Tool in Dedicated Tab */}
                  <div className="mt-8 space-y-8">
                    <BuildStatusDashboard
                      lang={selectedLang}
                      onOpenWpModal={() => setIsWpModalOpen(true)}
                    />
                    <AiGatewayDiagnosticTool
                      lang={selectedLang}
                      lastInferenceTelemetry={inferenceTelemetry}
                      onRunTestInference={(model, prompt) => handleRunAiInference(prompt, model)}
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'engineering' && (
              <section className="py-20 max-w-5xl mx-auto px-4 sm:px-8 relative overflow-hidden min-h-[550px] flex flex-col justify-center">
                {/* Engineering DAG Data-Flow Conduit Background */}
                <NeuralDataFlowBackground
                  variant="engineering"
                  theme="dark"
                  isRtl={selectedLang === 'fa'}
                  reducedMotion={reducedMotion}
                />

                <div className="relative z-10">
                  <span className="font-mono text-xs text-sky-400">06 // {currentContent.navItems[5].label}</span>
                  <h2 className="text-3xl font-extrabold text-white mt-2 mb-8">{currentContent.domainsTitle}</h2>
                  <div className="p-6 sm:p-8 rounded-2xl bg-[#05080E]/90 backdrop-blur-md border border-white/[0.12] font-mono text-xs shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
                      <div className="text-sky-400 font-semibold">{currentContent.nodeMatrixStatus}</div>
                      <span className="text-[10px] text-emerald-400 font-mono">FLOW: CONTINUOUS ACTIVE</span>
                    </div>
                    <pre className="text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{selectedLang === 'fa' 
  ? `[ساختار خط لوله مهندسی و جریان داده سهند]:
  درخواست کاربر -> فایروال لبه کلودفلر (Cloudflare Edge WAF)
  -> لایه کش Nginx FastCGI Micro-Cache
  -> هسته پردازشی sahand-theme (قالب مستقل PHP 8.2+)
  -> پلاگین منطق محاسباتی sahand-core (پست‌تایپ‌ها، متاداده‌ها، نانس‌ها)
  -> درگاه امن استنتاج سروری هوش مصنوعی Gemini 2.5`
  : `[SAHAND Engineering Pipeline & Data Flow Architecture]:
  Client Request -> Cloudflare Edge WAF -> Nginx Micro-Cache
  -> PHP 8.2-FPM (sahand-theme Presentation Engine)
  -> sahand-core (Custom Post Types, Taxonomies, Transient Rate Limiters)
  -> Server-Side Gemini API Gateway`}
                    </pre>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'insights' && (
              <section className="py-20 max-w-5xl mx-auto px-4 sm:px-8">
                <span className="font-mono text-xs text-sky-400">07 // {currentContent.navItems[6].label}</span>
                <h2 className="text-3xl font-extrabold text-white mt-2 mb-8">{currentContent.navItems[6].label}</h2>
                <div className="space-y-4">
                  {[
                    selectedLang === 'fa' ? 'تحلیل جریان سفارشات و رفتار نقدینگی در معاملات فرکانس‌بالا' : 'Sub-Millisecond Order Flow Analysis in Algorithmic Trading',
                    selectedLang === 'fa' ? 'طراحی معماری اعتماد صفر در سامانه‌های میزبانی وب' : 'Zero-Trust Architecture on Scalable Infrastructure',
                    selectedLang === 'fa' ? 'مسیریابی چندزبانه بدون سربار اضافی در پایگاه داده' : 'High-Performance Multilingual Routing Without Database Bloat'
                  ].map((title, i) => (
                    <article key={i} className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-sky-400/40 transition-colors">
                      <div className="text-[10px] font-mono text-sky-400 mb-1">
                        {selectedLang === 'fa' ? 'یادداشت فنی // ۸ دقیقه مطالعه' : 'RESEARCH NOTE // 8 MIN READ'}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                      <p className="text-xs text-gray-400">
                        {selectedLang === 'fa' ? 'بررسی تجربی، سنجش تاخیر و ارزیابی معماری سیستم‌ها.' : 'Empirical analysis, latency benchmarks, and architectural verification.'}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'contact' && (
              <section className="py-20 max-w-3xl mx-auto px-4 sm:px-8">
                <span className="font-mono text-xs text-sky-400">08 // {currentContent.navItems[7].label}</span>
                <h2 className="text-3xl font-extrabold text-white mt-2 mb-6">{currentContent.contactTitle}</h2>
                <div className="p-8 rounded-2xl bg-[#070B14] border border-white/[0.1]">
                  <p className="text-sm text-gray-300 mb-6 font-light">{currentContent.contactSub}</p>
                  <div className="space-y-4 font-mono text-xs">
                    <input type="text" placeholder={currentContent.contactNameLabel} className="w-full bg-white/[0.04] border border-white/[0.1] p-3 rounded-lg text-white" />
                    <input type="email" placeholder={currentContent.contactEmailLabel} className="w-full bg-white/[0.04] border border-white/[0.1] p-3 rounded-lg text-white" />
                    <textarea rows={4} placeholder={currentContent.contactMsgLabel} className="w-full bg-white/[0.04] border border-white/[0.1] p-3 rounded-lg text-white" />
                    <button className="px-6 py-3 rounded-lg bg-sky-500 text-white font-bold cursor-pointer">{currentContent.contactBtn}</button>
                  </div>
                </div>
              </section>
            )}

          </main>

          {/* Precision Architectural System Footer */}
          <footer className="border-t border-white/[0.08] bg-[#05080E] py-10 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-white/50 gap-6">
              <div className="flex items-center gap-3">
                <SahandLogo size="sm" variant="horizontal" lang={selectedLang} showSubtitle={false} />
              </div>

              <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
                <span className="text-emerald-400">● {currentContent.footerSla}</span>
                <span>{currentContent.footerArch}</span>
                <span>VAZIRMATN · INTER · JETBRAINS MONO</span>
                <button
                  onClick={() => setShowLogoInspector(true)}
                  className="text-sky-400 hover:text-sky-300 underline cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  {selectedLang === 'fa' ? 'سیستم وکتور لوگو' : selectedLang === 'tr' ? 'SVG Logo Sistemi' : 'SVG Logo System'}
                </button>
                <button
                  onClick={() => setInPortalMode(false)}
                  className="text-sky-400 hover:text-sky-300 underline cursor-pointer"
                >
                  {currentContent.footerReturnPortal}
                </button>
              </div>

              <div className="text-[11px] font-mono text-white/30">
                © {new Date().getFullYear()} {currentContent.brandWordmark}
              </div>
            </div>
          </footer>

        </div>
      )}

      {/* SVG Logo System Modal Inspector */}
      {showLogoInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-[#070B14] border border-sky-500/30 rounded-2xl p-4 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <button
              onClick={() => setShowLogoInspector(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer z-10"
              title="Close Inspector"
              aria-label="Close Logo Inspector"
            >
              <X className="w-5 h-5" />
            </button>
            <SahandLogoSystemInspector />
          </div>
        </div>
      )}

      {/* WordPress Edition Modal */}
      <WordPressEditionModal
        isOpen={isWpModalOpen}
        onClose={() => setIsWpModalOpen(false)}
        lang={selectedLang}
      />
    </div>
  );
}
