import {
  Calendar,
  Instagram,
  Phone,
  MapPin,
  MessageCircle,
  Video,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface LinkConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  variant: "primary" | "secondary";
}

export const profileConfig = {
  name: "Casa Del Soul",
  title: "Tattoo Studio Essen",
  description: "Professionelle Tattoos von talentierten Artists",
  address: "Holsterhauser Str. 79, 45147 Essen",
  image: "/profile.jpg", // Platziere dein Bild im public Ordner
};

export const socialLinks: LinkConfig[] = [
  {
    label: "Termin buchen",
    href: "/booking",
    icon: Calendar,
    variant: "primary",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/casa.del.soul.tattoostudio",
    icon: Instagram,
    variant: "secondary",
  },
  {
    label: "Unsere Artists",
    href: "/artists",
    icon: Instagram,
    variant: "secondary",
  },
  {
    label: "Route zu uns (Google Maps)",
    href: "https://www.google.com/maps/dir/?api=1&destination=Holsterhauser+Str.+79,+45147+Essen",
    icon: MapPin,
    variant: "secondary",
  },
  {
    label: "E-Mail schreiben",
    href: "mailto:info@casadelsoul.de",
    icon: Mail,
    variant: "secondary",
  },
  {
    label: "Anrufen",
    href: "tel:+49201123456",
    icon: Phone,
    variant: "secondary",
  },
];

export const siteConfig = {
  name: "Casa Del Soul - Link in Bio",
  description: "Professionelles Tattoo Studio in Essen - Online Termin buchen bei Casa Del Soul",
  url: "https://tattoo.runasp.net",
};
