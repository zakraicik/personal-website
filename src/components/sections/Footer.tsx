import { contactMethods } from "@/data/contact";
import { HiMail, HiPhone } from "react-icons/hi";
import { FaXTwitter } from "react-icons/fa6";
import React from "react";

type IconComponent = React.ComponentType<{ className?: string }>;

const icons: Record<string, IconComponent> = { HiMail, HiPhone, FaXTwitter };

const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.012-1.243-.017-2.252-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

GitHubIcon.displayName = "GitHubIcon";

export function Footer() {
  return (
    <footer className="w-full h-full flex items-center justify-center px-4">
      <div className="flex gap-6 items-center">
        {contactMethods.map((method) => {
          let IconComponent = icons[method.icon];
          if (method.icon === "GitHub") {
            IconComponent = GitHubIcon;
          }

          const colorClass =
            method.label === "GitHub"
              ? "text-cyber-pink"
              : method.label === "Phone"
              ? "text-cyber-purple"
              : "text-cyber-blue";

          const glowColor =
            method.label === "GitHub"
              ? "#FF1493"
              : method.label === "Phone"
              ? "#8A2BE2"
              : "#00BFFF";

          const isExternal =
            method.icon === "GitHub" || method.icon === "FaXTwitter";

          return (
            <span key={method.label}>
              {method.link ? (
                <a
                  href={method.link}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`${colorClass} hover:scale-110 transition-all duration-200`}
                  title={method.label === "GitHub" ? "GitHub" : method.value}
                >
                  <span
                    style={{ "--glow-color": glowColor } as React.CSSProperties}
                  >
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 techy-glow" />
                    )}
                  </span>
                </a>
              ) : (
                <span className={colorClass} title={method.value}>
                  <span
                    style={{ "--glow-color": glowColor } as React.CSSProperties}
                  >
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 techy-glow" />
                    )}
                  </span>
                </span>
              )}
            </span>
          );
        })}
      </div>
    </footer>
  );
}
