import { WelcomeGuideTemplate } from '@/types/welcomeGuide';

const WELCOME_GUIDE_STORAGE_KEY = 'welcome-guide-templates';

const isInlineDataUrl = (value?: string) => typeof value === 'string' && value.startsWith('data:');

const stripInlineMedia = (template: WelcomeGuideTemplate): WelcomeGuideTemplate => ({
  ...template,
  steps: template.steps.map((step) => ({
    ...step,
    imageUrl: isInlineDataUrl(step.imageUrl) ? '' : step.imageUrl,
  })),
  upsells: template.upsells.map((upsell) => ({
    ...upsell,
    imageUrl: isInlineDataUrl(upsell.imageUrl) ? '' : upsell.imageUrl,
  })),
  landingConfig: template.landingConfig
    ? {
        ...template.landingConfig,
        heroImage: isInlineDataUrl(template.landingConfig.heroImage)
          ? ''
          : template.landingConfig.heroImage,
      }
    : template.landingConfig,
});

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

  try {
    window.localStorage.setItem(WELCOME_GUIDE_STORAGE_KEY, JSON.stringify(templates));
    return;
  } catch (error) {
    const sanitizedTemplates = templates.map(stripInlineMedia);

    try {
      window.localStorage.setItem(WELCOME_GUIDE_STORAGE_KEY, JSON.stringify(sanitizedTemplates));
      console.warn('Storage saturé: médias inline supprimés pour préserver la sauvegarde.', error);
    } catch (sanitizedError) {
      console.warn('Impossible de sauvegarder les templates du livret.', sanitizedError);
    }
  }
};

export const getWelcomeGuideTemplateByToken = (token: string) => {
  const templates = loadWelcomeGuideTemplates([]);
  return templates.find((template) => template.id === token) || null;
};
