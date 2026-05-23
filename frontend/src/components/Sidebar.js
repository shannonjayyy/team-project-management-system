"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 4a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8l3 3 7-7" />
        <rect x="1" y="1" width="14" height="14" rx="2" />
      </svg>
    ),
  },
  {
    href: "/users",
    label: "Users",
    icon: (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="5" r="3" />
        <path d="M1 14c0-3 2-5 5-5s5 2 5 5" />
        <path d="M12 7c1.5 0 3 1 3 3.5" strokeLinecap="round" />
        <circle cx="12" cy="4.5" r="2" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Shannon PM</h1>
        <span>// project system</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "DM Mono, monospace" }}>
          api: localhost:5000
        </p>
      </div>
    </aside>
  );
}
