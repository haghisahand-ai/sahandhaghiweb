import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Code,
  FileText,
  Check,
  Copy,
  Server,
  Shield,
  Cpu,
  Database,
  Terminal,
  ExternalLink,
  Layers,
  Lock,
  RefreshCw,
  Folder,
} from 'lucide-react';

interface WordPressEditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fa' | 'en' | 'tr';
}

interface WpStatusData {
  platform: string;
  version: string;
  phpRequirement: string;
  wpRequirement: string;
  theme: {
    name: string;
    textDomain: string;
    fileCount: number;
    files: string[];
    zipSize: string;
    downloadUrl: string;
  };
  plugin: {
    name: string;
    textDomain: string;
    fileCount: number;
    files: string[];
    zipSize: string;
    downloadUrl: string;
    customPostTypes: Array<{
      slug: string;
      name: string;
      meta: string[];
    }>;
    security: Record<string, string>;
    restEndpoints: Array<{
      route: string;
      method: string;
      description: string;
    }>;
  };
}

export const WordPressEditionModal: React.FC<WordPressEditionModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'cpts' | 'source' | 'runbook'>('overview');
  const [selectedFile, setSelectedFile] = useState<string>('plugins/sahand-core/sahand-core.php');
  const [fileContent, setFileContent] = useState<string>('// Loading source file...');
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [wpStatus, setWpStatus] = useState<WpStatusData | null>(null);

  const isRtl = lang === 'fa';

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/wordpress/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWpStatus(data);
        }
      })
      .catch((err) => console.error('Failed to load WP status:', err));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeSubTab !== 'source') return;
    setIsLoadingFile(true);
    fetch(`/api/wordpress/file?path=${encodeURIComponent(selectedFile)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFileContent(data.content);
        } else {
          setFileContent(`// Error loading file: ${data.error || 'Unknown error'}`);
        }
      })
      .catch((err) => {
        setFileContent(`// Network error loading file: ${err.message}`);
      })
      .finally(() => setIsLoadingFile(false));
  }, [isOpen, activeSubTab, selectedFile]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const codeFiles = [
    { label: 'sahand-core.php (Main Plugin Entry)', path: 'plugins/sahand-core/sahand-core.php' },
    { label: 'class-rate-limiter.php (Atomic MySQL Limiter)', path: 'plugins/sahand-core/includes/class-rate-limiter.php' },
    { label: 'class-security.php (STRIDE Hardening & CSP)', path: 'plugins/sahand-core/includes/class-security.php' },
    { label: 'class-ai-gateway.php (Server Gemini 3.8 Gateway)', path: 'plugins/sahand-core/includes/class-ai-gateway.php' },
    { label: 'class-post-types.php (4 CPT Registrations)', path: 'plugins/sahand-core/includes/class-post-types.php' },
    { label: 'class-meta-fields.php (Object-Level Authorization)', path: 'plugins/sahand-core/includes/class-meta-fields.php' },
    { label: 'class-seo.php (Dynamic Multilingual SEO & JSON-LD)', path: 'plugins/sahand-core/includes/class-seo.php' },
    { label: 'functions.php (Theme Setup & Bootstrap)', path: 'themes/sahand-theme/functions.php' },
    { label: 'front-page.php (Editorial Architectural Front-Page)', path: 'themes/sahand-theme/front-page.php' },
    { label: 'page-ai-lab.php (AI Research Lab Dynamic Template)', path: 'themes/sahand-theme/page-ai-lab.php' },
    { label: 'rtl.css (Native Persian RTL Stylesheet)', path: 'themes/sahand-theme/rtl.css' },
  ];

  const sqlBootstrapSnippet = `-- =========================================================================
-- SAHAND Production MySQL Rate-Limiting & Concurrency Table
-- Run in MySQL / phpMyAdmin prior to activating sahand-core on live server
-- =========================================================================

CREATE TABLE IF NOT EXISTS \`wp_sahand_rate_limits\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`action_key\` VARCHAR(64) NOT NULL,
  \`ip_hash\` CHAR(64) NOT NULL,
  \`hits\` INT UNSIGNED NOT NULL DEFAULT 1,
  \`window_start\` INT UNSIGNED NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`uniq_action_ip\` (\`action_key\`, \`ip_hash\`),
  KEY \`idx_window\` (\`window_start\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const wpConfigSnippet = `// =========================================================================
// SAHAND Security Hardening & Zero-Trust Constants for wp-config.php
// Place before "/* That's all, stop editing! Happy publishing. */"
// =========================================================================

// 1. Server-Side Gemini AI API Key (Never exposed to client bundles)
define('SAHAND_GEMINI_API_KEY', 'your-google-gemini-api-key-here');

// 2. High-Capacity Atomic Rate Limiting
define('SAHAND_RATE_LIMIT_ENABLED', true);

// 3. Trusted Reverse Proxies (Cloudflare IPv4/IPv6 CIDR ranges)
define('SAHAND_TRUSTED_PROXIES', '173.245.48.0/20,103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,141.101.64.0/18,108.162.192.0/18,190.93.240.0/20,188.114.96.0/20,197.234.240.0/22,198.41.128.0/17,162.158.0.0/15,104.16.0.0/13,104.24.0.0/14,172.64.0.0/13,131.0.72.0/22');

// 4. Content Security Policy (Defaults to Report-Only; set true to strictly enforce)
define('SAHAND_CSP_REPORT_ONLY', false);

// 5. Disable File Editing from WordPress Admin Panel
define('DISALLOW_FILE_EDIT', true);`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#090D16] border border-white/10 shadow-2xl text-gray-200 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {lang === 'fa'
                    ? 'نسخه اختصاصی وردپرس سهند (WordPress Production Edition)'
                    : lang === 'tr'
                    ? 'SAHAND WordPress Üretim Sürümü'
                    : 'SAHAND WordPress Production Edition'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded font-semibold">
                  PHP 8.2+ · WP 6.7
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                {lang === 'fa'
                  ? 'معماری تفکیک‌شده: قالب اختصاصی sahand-theme + افزونه منطق تجاری sahand-core'
                  : 'Decoupled Architecture: sahand-theme (Presentation) + sahand-core (Business Logic)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-6 py-2.5 border-b border-white/10 bg-white/[0.01] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'overview'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'نمای کلی و بسته‌های دانلودی' : 'Overview & Packages'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cpts')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'cpts'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'پست‌تایپ‌ها و وب‌سرویس‌های REST' : 'CPTs & REST APIs'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('source')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'source'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'مشاهده‌گر کدهای PHP مخزن' : 'Source Code Inspector'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('runbook')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'runbook'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{lang === 'fa' ? 'راهنمای استقرار و اسکریپت SQL' : 'Staging Runbook & SQL'}</span>
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW & DOWNLOADS */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Architecture Highlight Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-sky-950/20 to-transparent border border-emerald-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
                      <span>DECOUPLED WORDPRESS ARCHITECTURE</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'fa'
                        ? 'معماری صددرصد بومی و مستقل بدون نیاز به سرور دائمی نودجی‌اس'
                        : 'Pure Decoupled PHP 8.2+ Architecture — Zero Node.js Daemon Overhead'}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                      {lang === 'fa'
                        ? 'این نسخه کاملاً استاندارد برای اجرا بر روی هاست‌های اشتراکی بهینه (مانند cPanel، دایرکت‌ادمین یا سرورهای لینوکس) طراحی شده است. لایه فرانت‌اند و قالب (sahand-theme) کاملاً از لایه هسته و منطق تجاری (sahand-core) تفکیک گردیده تا پایداری و امنیت چندلایه تضمین شود.'
                        : 'Designed to deploy seamlessly on standard optimized shared hosting or Linux VPS without any persistent background Node.js processes. Presentation is strictly decoupled from business logic.'}
                    </p>
                  </div>
                  
                  <div className="shrink-0 flex flex-col gap-2">
                    <span className="text-[11px] font-mono text-gray-400">
                      {lang === 'fa' ? 'دامنه هدف:' : 'Target Domain:'}{' '}
                      <strong className="text-sky-300">sahandhaghi.site</strong>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      ● STRIDE Hardened & Tested
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Download Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. sahand-theme package */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-sky-400" />
                        <h4 className="text-sm font-bold text-white">sahand-theme</h4>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                        {wpStatus?.theme.zipSize || '48.4 KB'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      {lang === 'fa'
                        ? 'پوسته اختصاصی وردپرس شامل کنترلر front-page.php، هدر و فوتر بهینه‌سازی شده، الگوهای پویا برای هر ۸ صفحه، استایل‌های راست‌چین بومی rtl.css و نمودارهای تعاملی SVG.'
                        : 'Custom presentation theme featuring front-page.php, full dynamic page templates for all 8 hub sections, native RTL stylesheet, and lightweight SVG data flows.'}
                    </p>

                    <div className="text-[11px] font-mono text-gray-400 space-y-1 mb-5">
                      <div>📁 مسیر استقرار: <code className="text-sky-300">wp-content/themes/sahand-theme/</code></div>
                      <div>📄 تعداد فایل‌ها: <span className="text-white font-semibold">{wpStatus?.theme.fileCount || 18} فایل</span></div>
                      <div>🌐 چندزبانه: <span className="text-emerald-300">فارسی (RTL) / انگلیسی / ترکی</span></div>
                    </div>
                  </div>

                  <a
                    href="/downloads/sahand-theme.zip"
                    download="sahand-theme.zip"
                    className="w-full py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'دانلود بسته قالب (sahand-theme.zip)' : 'Download sahand-theme.zip'}</span>
                  </a>
                </div>

                {/* 2. sahand-core package */}
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">sahand-core</h4>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {wpStatus?.plugin.zipSize || '22.9 KB'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      {lang === 'fa'
                        ? 'پلاگین مستقل منطق تجاری شامل تعریف ۴ پست‌تایپ، متاباکس‌ها با بررسی مجوز شیء (Object-level Capability)، محدودساز اتمیک نرخ MySQL، درگاه امن سروری Gemini 3.8 و هدرهای CSP.'
                        : 'Independent core functionality plugin handling 4 Custom Post Types, object-level capability checks, atomic MySQL rate limiting, server-side Gemini 3.8 gateway, and CSP.'}
                    </p>

                    <div className="text-[11px] font-mono text-gray-400 space-y-1 mb-5">
                      <div>📁 مسیر استقرار: <code className="text-emerald-300">wp-content/plugins/sahand-core/</code></div>
                      <div>📄 تعداد فایل‌ها: <span className="text-white font-semibold">{wpStatus?.plugin.fileCount || 11} فایل</span></div>
                      <div>🛡️ استاندارد امنیت: <span className="text-emerald-300">STRIDE Defense-in-Depth</span></div>
                    </div>
                  </div>

                  <a
                    href="/downloads/sahand-core.zip"
                    download="sahand-core.zip"
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'fa' ? 'دانلود بسته پلاگین (sahand-core.zip)' : 'Download sahand-core.zip'}</span>
                  </a>
                </div>

              </div>

              {/* Technical Specifications Matrix */}
              <div className="p-5 rounded-xl bg-white/[0.01] border border-white/[0.08]">
                <h4 className="text-xs font-mono font-bold text-sky-400 mb-3 uppercase tracking-wider">
                  {lang === 'fa' ? 'ماتریس مشخصات فنی پلتفرم وردپرس' : 'Technical Specifications Matrix'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">PHP VERSION</span>
                    <strong className="text-white text-sm">8.2 / 8.3+</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">WORDPRESS CORE</span>
                    <strong className="text-white text-sm">6.4 to 6.7</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">RATE LIMITER</span>
                    <strong className="text-emerald-400 text-sm">Atomic MySQL</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-gray-400 block text-[10px]">AI GATEWAY</span>
                    <strong className="text-sky-400 text-sm">Gemini 3.8 Server</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CPTS & REST APIS */}
          {activeSubTab === 'cpts' && (
            <div className="space-y-6">
              
              {/* 4 Custom Post Types */}
              <div>
                <h4 className="text-xs font-mono font-bold text-sky-400 mb-3 uppercase tracking-wider">
                  {lang === 'fa' ? 'انواع پست‌های اختصاصی تعریف‌شده در sahand-core' : 'Registered Custom Post Types in sahand-core'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wpStatus?.plugin.customPostTypes.map((cpt, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-sm font-bold text-white">{cpt.name}</strong>
                        <code className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {cpt.slug}
                        </code>
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        <span className="text-gray-400 block mb-1">متاداده‌های ثبت‌شده (Object-Level Verified):</span>
                        <div className="flex flex-wrap gap-1">
                          {cpt.meta.map((m, mIdx) => (
                            <span key={mIdx} className="bg-white/5 px-1.5 py-0.5 rounded text-gray-300">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REST API Endpoints */}
              <div>
                <h4 className="text-xs font-mono font-bold text-emerald-400 mb-3 uppercase tracking-wider">
                  {lang === 'fa' ? 'مسیرهای وب‌سرویس REST اختصاصی (Namespaced REST Routes)' : 'Namespaced REST Routes (/wp-json/sahand/v1/)'}
                </h4>
                <div className="space-y-3">
                  {wpStatus?.plugin.restEndpoints.map((ep, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                            {ep.method}
                          </span>
                          <code className="text-xs font-mono text-white font-semibold">{ep.route}</code>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{ep.description}</p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                        🔒 Guarded by Rate Limiter & Nonce
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SOURCE CODE INSPECTOR */}
          {activeSubTab === 'source' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400 shrink-0">
                    {lang === 'fa' ? 'انتخاب فایل سورس:' : 'Select PHP Source:'}
                  </span>
                  <select
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.value)}
                    className="bg-black/60 border border-white/20 text-white text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    {codeFiles.map((cf, idx) => (
                      <option key={idx} value={cf.path}>
                        {cf.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(fileContent, 'source-viewer')}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode === 'source-viewer' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{lang === 'fa' ? 'کپی شد' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>{lang === 'fa' ? 'کپی کل فایل' : 'Copy Full File'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code viewer box */}
              <div className="relative rounded-xl bg-black/80 border border-white/10 overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02] text-gray-400 text-[11px]">
                  <span>{selectedFile}</span>
                  {isLoadingFile && <span className="text-sky-400 animate-pulse">Loading...</span>}
                </div>
                <pre
                  className="p-4 text-emerald-200/90 overflow-x-auto max-h-[50vh] leading-relaxed whitespace-pre font-mono"
                  dir="ltr"
                >
                  {fileContent}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: RUNBOOK & SQL BOOTSTRAP */}
          {activeSubTab === 'runbook' && (
            <div className="space-y-6">
              
              {/* 1. Database Table Bootstrap */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                    {lang === 'fa' ? '۱. اسکریپت ساخت جدول محدودسازی نرخ اتمیک در MySQL' : '1. Atomic Rate-Limiter MySQL Table DDL'}
                  </h4>
                  <button
                    onClick={() => copyToClipboard(sqlBootstrapSnippet, 'sql-snippet')}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode === 'sql-snippet' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    <span>{copiedCode === 'sql-snippet' ? 'کپی شد' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-sky-200 overflow-x-auto leading-relaxed" dir="ltr">
                  {sqlBootstrapSnippet}
                </pre>
              </div>

              {/* 2. wp-config.php constants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    {lang === 'fa' ? '۲. ثوابت امنیتی و کلید هوش مصنوعی در wp-config.php' : '2. Hardening & API Constants for wp-config.php'}
                  </h4>
                  <button
                    onClick={() => copyToClipboard(wpConfigSnippet, 'wpconfig-snippet')}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode === 'wpconfig-snippet' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    <span>{copiedCode === 'wpconfig-snippet' ? 'کپی شد' : 'Copy Config'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed" dir="ltr">
                  {wpConfigSnippet}
                </pre>
              </div>

              {/* 3. Staging Checklist */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <h4 className="text-xs font-mono font-bold text-amber-400 mb-3 uppercase tracking-wider">
                  {lang === 'fa' ? '۳. چک‌لیست استقرار نهایی در هاست اشتراکی' : '3. Live Hosting Deployment Checklist'}
                </h4>
                <ul className="text-xs space-y-2 text-gray-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>آپلود و فعال‌سازی <code className="text-emerald-300">sahand-core.zip</code> از طریق مدیریت افزونه‌های وردپرس.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>آپلود و فعال‌سازی پوسته <code className="text-sky-300">sahand-theme.zip</code> از طریق بخش نمایش &gt; پوسته‌ها.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>بررسی فعال بودن افزونه Polylang جهت مدیریت ساختار چندزبانه (/fa/, /en/, /tr/).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>مسدودسازی اجرای مستقیم فایل‌های PHP در پوشه <code className="text-amber-300">wp-content/uploads/</code> (خودکار توسط sahand-core انجام می‌پذیرد).</span>
                  </li>
                </ul>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02] gap-3">
          <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PRODUCTION PACKAGES READY IN /public/downloads/</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="/downloads/sahand-theme.zip"
              download="sahand-theme.zip"
              className="px-3.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>sahand-theme.zip</span>
            </a>

            <a
              href="/downloads/sahand-core.zip"
              download="sahand-core.zip"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>sahand-core.zip</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors cursor-pointer"
            >
              {lang === 'fa' ? 'بستن' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
