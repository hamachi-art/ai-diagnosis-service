export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  customImage: string | null;
  emailVerified: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export function getDisplayImage(
  profile: Pick<UserProfile, 'customImage' | 'image'>
): string | null {
  return profile.customImage ?? profile.image;
}
