import type { Metadata } from "next";
import "@/App.css";

export const metadata: Metadata = {
    title: "The Shape of Sound",
    description: "A tactile and educational interface for music and audio synthesis.",
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
