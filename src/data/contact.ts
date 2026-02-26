export interface ContactMethod {
  icon: string;
  label: string;
  value: string;
  link?: string;
  colorClass: string;
}

export const contactMethods: ContactMethod[] = [
  {
    icon: "HiMail",
    label: "Email",
    value: "raicik.zach@gmail.com",
    link: "mailto:raicik.zach@gmail.com",
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
    icon: "GitHub",
    label: "GitHub",
    value: "https://github.com/zakraicik",
    link: "https://github.com/zakraicik",
    colorClass: "bg-cyber-pink/20 border-cyber-pink/30 text-cyber-pink",
  },
  {
    icon: "FaXTwitter",
    label: "X",
    value: "@zraic",
    link: "https://x.com/zraic",
    colorClass: "bg-cyber-blue/20 border-cyber-blue/30 text-cyber-blue",
  },
];
