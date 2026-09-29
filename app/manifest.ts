import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Bangladesh Calendar`,
    short_name: SITE.name,
    description: SITE.description.en,
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f7f4',
    theme_color: '#006a4e',
    lang: 'bn-BD',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
