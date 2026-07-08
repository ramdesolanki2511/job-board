import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "RemoteLaunch - Remote Jobs Aggregator",
  description: "Find your next remote job opportunity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            <a href="/" style={styles.logo}>
              RemoteLaunch
            </a>
            <div style={styles.navLinks}>
              <a href="/jobs" style={styles.navLink}>
                Browse Jobs
              </a>
              <a href="/companies" style={styles.navLink}>
                Companies
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer style={styles.footer}>
          <div style={styles.footerContainer}>
            <p>&copy; 2026 RemoteLaunch. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

const styles = {
  nav: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
  } as React.CSSProperties,
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    textDecoration: "none",
  } as React.CSSProperties,
  navLinks: {
    display: "flex",
    gap: "24px",
  } as React.CSSProperties,
  navLink: {
    color: "#6b7280",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.2s",
  } as React.CSSProperties,
  footer: {
    backgroundColor: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    padding: "32px 20px",
    marginTop: "60px",
  } as React.CSSProperties,
  footerContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  } as React.CSSProperties,
};
