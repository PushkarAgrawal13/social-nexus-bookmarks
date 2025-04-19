
export type SocialPlatform = 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  platform: SocialPlatform;
  description?: string;
  createdAt: Date;
}
