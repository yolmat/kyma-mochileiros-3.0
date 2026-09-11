import "./globals.css";

export const metadata = {
    title: "Pre Order Ticket Checkout",
    description: "Pré-reserva da Expedição 3.0",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR" className="dark">
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
                />
            </head>

            <body>{children}</body>
        </html>
    );
}