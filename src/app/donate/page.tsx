import { prisma } from "@/lib/prisma";
import DonateView from "./DonateView";

export const metadata = {
  title: "Donate - Flarelap Foundation",
  description: "Support the Flarelap Foundation's initiatives for education and skill development.",
};

export default async function DonatePage() {
  // Fetch gallery images on the server for the dynamic banner
  const galleryImages = await prisma.galleryImage.findMany({
    where: { pageName: "donate" },
    orderBy: { sequence: "asc" },
    take: 5, // Just take top 5 for the banner
  });

  return <DonateView galleryImages={galleryImages} />;
}
