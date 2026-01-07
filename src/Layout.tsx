import ThemeToggle from "@/components/theme-toggle";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useLocation();

    return (
        <div className="flex flex-col h-[100vh] items-center">
            <header className="w-full flex items-center justify-between border-b h-12 p-4">
                <ThemeToggle />
                <h1 className="text-3xl font-bold">The Shape of Sound</h1>
                {router.pathname !== "/settings" && (
                    <Link to="/settings" className="">
                        <Settings className="size-6" />
                    </Link>
                )}
                {router.pathname !== "/" && (
                    <Link to="/" className="">
                        <Home className="size-6" />
                    </Link>
                )}
            </header>
            <main className="w-full flex-1 p-4 flex items-center justify-center">{children}</main>
        </div>
    );
}
