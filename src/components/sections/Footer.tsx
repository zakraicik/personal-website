import { contactMethods } from "@/data/contact";
import { HiEnvelope, HiPhone, HiArrowUpRight } from "react-icons/hi2";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const icons = { HiMail: HiEnvelope, HiPhone, GitHub: FaGithub, FaXTwitter };

export function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-note">Good work starts with a conversation.</span>
      <nav aria-label="Contact and social links">{contactMethods.map(method => {
        const Icon = icons[method.icon as keyof typeof icons];
        const isExternal = method.link?.startsWith("https://");
        return <a key={method.label} href={method.link} aria-label={`${method.label}: ${method.value}${isExternal ? " (opens in a new tab)" : ""}`}
          title={method.value} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
          <Icon aria-hidden="true" /><span>{method.label}</span>{method.label === "Email" && <HiArrowUpRight aria-hidden="true" className="footer-arrow" />}
        </a>;
      })}</nav>
    </footer>
  );
}
