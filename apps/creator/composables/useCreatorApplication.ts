import type { CreatorApplicationPayload } from '@whispers/types';
import { createCreatorApi } from '@whispers/api';

export function useCreatorApplication() {
  const submitApplication = async (formValues: any) => {
    // Transform form values to API payload
    const socialMedia = Object.entries(formValues.social || {})
      .filter(([_, value]) => value && typeof value === 'string' && value.length > 0)
      .map(([platform, username]) => ({
        platform: platform as 'twitter' | 'instagram' | 'tiktok' | 'youtube' | 'facebook',
        url: `https://${platform}.com/${(username as string).replace(/^@/, '')}`
      }));

    const payload: CreatorApplicationPayload = {
      displayName: formValues.displayName,
      username: formValues.username,
      bio: formValues.bio,
      categories: formValues.categories,
      socialMedia,
      pricing: {
        amount: Number(formValues.monthlyPrice),
        models: [] // You can adjust this if you have models in your form
      },
      legal: {
        termsOfService: formValues.legal.terms,
        contentGuidelines: true, // Set this based on your form if needed
        legallyAnAdult: formValues.legal.isAdult
      }
    };

    const api = createCreatorApi();
    return api.createCreator(payload);
  };

  return { submitApplication };
} 