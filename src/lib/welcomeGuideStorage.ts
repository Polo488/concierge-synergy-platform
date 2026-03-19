import { WelcomeGuideTemplate } from '@/types/welcomeGuide';

const WELCOME_GUIDE_STORAGE_KEY = 'welcome-guide-templates';

const reviveTemplateDates = (template: WelcomeGuideTemplate): WelcomeGuideTemplate => ({
  ...template,
  createdAt: new Date(template.createdAt),
  updatedAt: new Date(template.updatedAt),
});

export const loadWelcomeGuideTemplates = (fallback: WelcomeGuideTemplate[]): WelcomeGuideTemplate[] => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(WELCOME_GUIDE_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as WelcomeGuideTemplate[];
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;

    return parsed.map(reviveTemplateDates);
  } catch {
    return fallback;
  }
};

export const saveWelcomeGuideTemplates = (templates: WelcomeGuideTemplate[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WELCOME_GUIDE_STORAGE_KEY, JSON.stringify(templates));
};

export const getWelcomeGuideTemplateByToken = (token: string) => {
  const templates = loadWelcomeGuideTemplates([]);
  return templates.find((template) => template.id === token) || null;
};
