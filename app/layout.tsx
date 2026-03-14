import type { Metadata } from "next";
import "@/App.css";
import SessionDraftImportBridge from "@/components/ideas/SessionDraftImportBridge";

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
        <html lang="en" suppressHydrationWarning>
            <body>
                <script>{`(() => {
    const theme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", theme === "dark");
})();`}</script>
                {children}
                <SessionDraftImportBridge />
            </body>
        </html>
    );
}
