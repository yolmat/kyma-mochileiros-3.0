import "./globals.css";

export const metadata = {
  title: "Mochileiros 3.0",
  description: "Mochileiros 3.0 - Um evento Kyma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}