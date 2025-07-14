import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CineWatch | Stream and Book Tickets in one place",
    description:
        "Your one-stop destination for movies, trailers, and cinema tickets.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
