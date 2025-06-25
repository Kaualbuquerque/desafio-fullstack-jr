import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/header/header";

import styles from "./layout.module.scss";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <div className={styles.layout}>
          <aside><Sidebar /></aside>
          <header><Header /></header>
          <main className={styles.content}>{children}</main>
        </div>
      </body>
    </html>
  );
}
