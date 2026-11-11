/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Multilingual SEO & Metadata Engine
 * Pure logic for generating dynamic, localized titles, meta descriptions,
 * Open Graph, Twitter Cards, and Schema.org JSON-LD across custom post types.
 */

export type PostType = 'sahand_project' | 'sahand_product' | 'sahand_ai_tool' | 'sahand_insight';
export type SupportedLang = 'fa' | 'en' | 'tr';

export interface SeoPostInput {
  id: number | string;
  type: PostType;
  lang: SupportedLang;
  title: string;
  excerpt?: string;
  content?: string;
  slug: string;
  featuredImageUrl?: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
  meta?: {
    // Custom post meta
    projectStatus?: string;
    projectTimeline?: string;
    projectProblem?: string;
    projectSolution?: string;
    projectGithub?: string;
    productVersion?: string;
    productStatus?: string;
    aiModel?: string;
    aiRateLimit?: string;
    // SEO overrides
    seoTitle?: string;
    seoDescription?: string;
    seoOgImage?: string;
    seoNoindex?: boolean;
  };
}

export interface SeoOutput {
  title: string;
  description: string;
  canonicalUrl: string;
  locale: string;
  alternateLocales: string[];
  hreflangs: { lang: string; url: string }[];
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogSiteName: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schemaJsonLd: Record<string, unknown>;
  robots: string;
}

const BRAND_NAMES: Record<SupportedLang, { brand: string; siteTitle: string; defaultOgImage: string }> = {
  fa: {
    brand: 'سهند',
    siteTitle: 'سهند | پلتفرم تخصصی فناوری و مهندسی سیستم‌ها',
    defaultOgImage: 'https://sahandhaghi.site/assets/brand/sahand-logo-persian.svg',
  },
  en: {
    brand: 'SAHAND',
    siteTitle: 'SAHAND | Technology & Systems Engineering Hub',
    defaultOgImage: 'https://sahandhaghi.site/assets/brand/sahand-logo-horizontal-dark.svg',
  },
  tr: {
    brand: 'SAHAND',
    siteTitle: 'SAHAND | Teknoloji ve Mühendislik Platformu',
    defaultOgImage: 'https://sahandhaghi.site/assets/brand/sahand-logo-horizontal-dark.svg',
  },
};

const LOCALE_MAP: Record<SupportedLang, { primary: string; alternates: string[] }> = {
  fa: { primary: 'fa_IR', alternates: ['en_US', 'tr_TR'] },
  en: { primary: 'en_US', alternates: ['fa_IR', 'tr_TR'] },
  tr: { primary: 'tr_TR', alternates: ['fa_IR', 'en_US'] },
};

/**
 * Truncates text cleanly at word boundaries and adds ellipsis if over maxLength.
 */
export function truncateClean(text: string, maxLength: number = 155): string {
  const cleaned = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  const substr = cleaned.slice(0, maxLength);
  const lastSpace = substr.lastIndexOf(' ');
  return (lastSpace > 0 ? substr.slice(0, lastSpace) : substr).trim() + '...';
}

/**
 * Formats a localized page title based on CPT and target language.
 */
export function generateSeoTitle(input: SeoPostInput): string {
  if (input.meta?.seoTitle) {
    return input.meta.seoTitle.trim();
  }

  const { title, type, lang, meta } = input;
  const brand = BRAND_NAMES[lang].brand;

  switch (type) {
    case 'sahand_project': {
      if (lang === 'fa') return `${title} | پروژه مهندسی ${brand}`;
      if (lang === 'tr') return `${title} — Mühendislik Projesi | ${brand}`;
      return `${title} — Engineering Project | ${brand}`;
    }
    case 'sahand_product': {
      const ver = meta?.productVersion ? ` v${meta.productVersion}` : '';
      if (lang === 'fa') return `${title}${ver ? ` نسخه ${meta?.productVersion}` : ''} | سکوی محصولات ${brand}`;
      if (lang === 'tr') return `${title}${ver} — Ürün Lansmanı | ${brand}`;
      return `${title}${ver} — Launchpad Product | ${brand}`;
    }
    case 'sahand_ai_tool': {
      if (lang === 'fa') return `${title} | ابزار و مدل هوش مصنوعی ${brand}`;
      if (lang === 'tr') return `${title} — Yapay Zekâ Modeli | ${brand}`;
      return `${title} — AI Research Tool | ${brand}`;
    }
    case 'sahand_insight': {
      if (lang === 'fa') return `${title} | دیدگاه‌ها و تحلیل‌های فنی ${brand}`;
      if (lang === 'tr') return `${title} — Teknik İnceleme ve Analiz | ${brand}`;
      return `${title} — Technical Insights & Architecture | ${brand}`;
    }
  }
}

/**
 * Formats a localized, high-ranking meta description based on CPT and meta fields.
 */
export function generateSeoDescription(input: SeoPostInput): string {
  if (input.meta?.seoDescription) {
    return truncateClean(input.meta.seoDescription, 160);
  }

  const { type, lang, excerpt, content, meta } = input;

  if (type === 'sahand_project' && (meta?.projectProblem || meta?.projectSolution)) {
    const combined = [meta.projectProblem, meta.projectSolution].filter(Boolean).join(' — ');
    return truncateClean(combined, 155);
  }

  if (type === 'sahand_product' && meta?.productVersion) {
    const statusText = meta.productStatus ? ` [${meta.productStatus.toUpperCase()}]` : '';
    const desc = excerpt || content || '';
    const prefix =
      lang === 'fa'
        ? `نگارش ${meta.productVersion}${statusText}: `
        : `Release v${meta.productVersion}${statusText}: `;
    return truncateClean(prefix + desc, 155);
  }

  if (excerpt && excerpt.trim().length > 0) {
    return truncateClean(excerpt, 155);
  }

  if (content && content.trim().length > 0) {
    return truncateClean(content, 155);
  }

  // Fallback defaults
  if (lang === 'fa') {
    return `مستندات و مشخصات فنی ${input.title} در پلتفرم مهندسی و فناوری سهند.`;
  } else if (lang === 'tr') {
    return `SAHAND platformunda ${input.title} projesine ait teknik dökümantasyon ve mimari analiz.`;
  }
  return `Technical documentation, architecture specifications, and implementation details for ${input.title} on SAHAND.`;
}

/**
 * Generates Schema.org JSON-LD structured data tailored to CPT.
 */
export function generateSchemaJsonLd(input: SeoPostInput, url: string, ogImage: string, title: string, desc: string): Record<string, unknown> {
  const baseSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    inLanguage: input.lang === 'fa' ? 'fa-IR' : input.lang === 'tr' ? 'tr-TR' : 'en-US',
    mainEntityOfPage: url,
    publisher: {
      '@type': 'Organization',
      name: 'SAHAND',
      url: 'https://sahandhaghi.site',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sahandhaghi.site/assets/brand/sahand-emblem-color.svg',
      },
    },
  };

  switch (input.type) {
    case 'sahand_project':
      return {
        ...baseSchema,
        '@type': 'SoftwareSourceCode',
        name: title,
        description: desc,
        codeRepository: input.meta?.projectGithub || undefined,
        programmingLanguage: 'Python / PHP / TypeScript',
        author: {
          '@type': 'Person',
          name: input.authorName || 'Sahand Haghi',
          url: 'https://sahandhaghi.site',
        },
      };

    case 'sahand_product':
      return {
        ...baseSchema,
        '@type': 'SoftwareApplication',
        name: title,
        description: desc,
        softwareVersion: input.meta?.productVersion || '1.0.0',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform / Web / Linux',
        image: ogImage,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      };

    case 'sahand_ai_tool':
      return {
        ...baseSchema,
        '@type': 'WebApplication',
        name: title,
        description: desc,
        applicationCategory: 'ArtificialIntelligenceApplication',
        browserRequirements: 'Requires modern web browser with ECMAScript 2022+ support',
        image: ogImage,
      };

    case 'sahand_insight':
      return {
        ...baseSchema,
        '@type': 'TechArticle',
        headline: title,
        description: desc,
        image: ogImage,
        datePublished: input.datePublished || '2026-01-01T00:00:00Z',
        dateModified: input.dateModified || input.datePublished || '2026-01-01T00:00:00Z',
        author: {
          '@type': 'Person',
          name: input.authorName || 'Sahand Haghi',
          url: 'https://sahandhaghi.site',
        },
      };
  }
}

/**
 * Master SEO metadata generator.
 */
export function buildSeoMetadata(input: SeoPostInput, baseUrl: string = 'https://sahandhaghi.site'): SeoOutput {
  const title = generateSeoTitle(input);
  const description = generateSeoDescription(input);
  const brand = BRAND_NAMES[input.lang];
  const locales = LOCALE_MAP[input.lang];

  // Canonical URL structure: /{lang}/{cpt-slug}/{post-slug}/
  const cptSlugs: Record<PostType, string> = {
    sahand_project: 'projects',
    sahand_product: 'launchpad',
    sahand_ai_tool: 'ai-lab',
    sahand_insight: 'insights',
  };

  const canonicalUrl = `${baseUrl}/${input.lang}/${cptSlugs[input.type]}/${input.slug}/`;
  const ogImage = input.meta?.seoOgImage || input.featuredImageUrl || brand.defaultOgImage;

  const hreflangs = (['fa', 'en', 'tr'] as SupportedLang[]).map((l) => ({
    lang: l,
    url: `${baseUrl}/${l}/${cptSlugs[input.type]}/${input.slug}/`,
  }));

  const schemaJsonLd = generateSchemaJsonLd(input, canonicalUrl, ogImage, title, description);

  return {
    title,
    description,
    canonicalUrl,
    locale: locales.primary,
    alternateLocales: locales.alternates,
    hreflangs,
    ogType: input.type === 'sahand_insight' ? 'article' : input.type === 'sahand_product' ? 'product' : 'website',
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage,
    ogSiteName: brand.siteTitle,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    schemaJsonLd,
    robots: input.meta?.seoNoindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large',
  };
}
