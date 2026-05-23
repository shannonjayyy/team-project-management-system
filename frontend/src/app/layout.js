import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "TeamPM — Project Management System",
  description: "Manage your team's projects and tasks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
