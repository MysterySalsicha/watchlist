
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watchlist Premium",
  description: "Gerencie sua lista de animes e filmes com estilo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
