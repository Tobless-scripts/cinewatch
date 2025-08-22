import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavFooterComp/Navbar";
import Footer from "@/components/NavFooterComp/Footer";

export const metadata: Metadata = {
    title: "CineWatch | Stream and Book Tickets in one place",
    description:
        "Your one-stop destination for movies, trailers, and cinema tickets.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
