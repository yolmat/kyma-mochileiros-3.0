import "./globals.css";

export const metadata = {
  title: "Mochileiros 3.0 - A Maior Expedição",
  description: "Mochileiros 3.0 - A Maior Expedição",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}