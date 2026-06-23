export const sampleImages = {
  blog: "/samples/blog.svg",
  community: "/samples/community.svg",
  contact: "/samples/contact.svg",
  education: "/uploads/education_hero.png",
  health: "/samples/health.svg",
  livelihood: "/samples/livelihood.svg",
  products: "/samples/products.svg",
  relief: "/samples/relief.svg",
} as const;

export const galleryImages = [
  sampleImages.community,
  sampleImages.education,
  sampleImages.health,
  sampleImages.livelihood,
  sampleImages.relief,
  sampleImages.blog,
] as const;
