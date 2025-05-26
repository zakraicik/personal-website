// Contact data for Contact section

import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

export interface ContactMethod {
  icon: string; // Icon name as string, to be mapped in the component
  label: string;
  value: string;
  link?: string;
  colorClass: string; // Tailwind color class for icon background
}

export const contactMethods: ContactMethod[] = [
  {
    icon: "HiMail",
    label: "Email",
    value: "raicik.zak@gmail.com",
    link: "mailto:raicik.zak@gmail.com",
    colorClass: "bg-cyber-blue/20 border-cyber-blue/30 text-cyber-blue",
  },
  {
    icon: "HiPhone",
    label: "Phone",
    value: "+1 (860) 593-0476",
    link: "tel:+18605930476",
    colorClass: "bg-cyber-purple/20 border-cyber-purple/30 text-cyber-purple",
  },
  {
    icon: "HiLocationMarker",
    label: "Location",
    value: "San Diego, CA",
    colorClass: "bg-cyber-pink/20 border-cyber-pink/30 text-cyber-pink",
  },
  {
    icon: "GitHub",
    label: "GitHub",
    value: "https://github.com/zakraicik",
    link: "https://github.com/zakraicik",
    colorClass: "bg-cyber-blue/20 border-cyber-blue/30 text-cyber-blue",
  },
];
