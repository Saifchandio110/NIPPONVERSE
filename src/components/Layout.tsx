import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Languages, Menu, Moon, RefreshCw, Settings as SettingsIcon, Shapes, Sun, Type, X } from 'lucide-react';
import type { Key } from '../i18n/en';
import { useApp } from '../state/AppState';
import { Button } from './ui';

// Add an entry here whenever a new page ships. Never link to a page that does not exist.
const NAV: { to: string; icon: typeof LayoutDashboard; label: Key }[] = [
  { to: '/', icon: LayoutDashboard, label: 'navDashboard' },
  { to: '/hiragana', icon: Type, label: 'hiragana' },
  { to: '/katakana', icon: Shapes, label: 'katakana' },
  { to: '/vocabulary', icon: BookOpen, label: 'navVocabulary' },
  { to: '/review', icon: RefreshCw, label: 'navReview' },
  { to: '/settings', icon: SettingsIcon, label: 'navSettings' },
];

export default function Layout() {
  const { t, data, updateSettings, saveFailed } = useApp();
  const [open, setOpen] = useState(false);
  const { language, theme } = data.settings;

  return (
    <div className="min-h-screen bg-paper text-navy dark:bg-navy dark:text-paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">
        {t('skipToContent')}
      </a>
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy/10 bg-white/90 px-4 py-3 backdrop-blur dark:bg-navy/90 dark:border-paper/10">
        <Button className="md:hidden" aria-label={open ? t('closeMenu') : t('menu')} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </Button>
        <div className="flex items-baseline gap-3">
          <span className="text-xl font-bold">
            <span className="text-vermilion" lang="ja">日</span> {t('appName')}
          </span>
          <span className="hidden text-sm opacity-70 sm:inline">{t('tagline')}</span>
        </div>
        <div className="ms-auto flex gap-2">
          <Button aria-label={t('switchLanguage')} onClick={() => updateSettings({ language: language === 'en' ? 'ur' : 'en' })}>
            <Languages size={16} /> {language === 'en' ? 'اردو' : 'English'}
          </Button>
          <Button aria-label={t('switchTheme')} onClick={() => updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' })}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </header>

      <div className="flex">
        <nav
          aria-label="Main"
          className={`${open ? 'block' : 'hidden'} fixed inset-x-0 top-[57px] z-10 bg-white p-4 shadow md:static md:block md:w-60 md:shrink-0 md:border-e md:border-navy/10 md:shadow-none dark:bg-navy dark:md:border-paper/10`}
        >
          <ul className="space-y-1">
            {NAV.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-vermilion text-white' : 'hover:bg-navy/5 dark:hover:bg-paper/10'}`
                  }
                >
                  <Icon size={18} /> {t(label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main" className="min-w-0 flex-1 p-4 md:p-8">
          {saveFailed && (
            <p role="alert" className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
              {t('saveFailed')}
            </p>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
