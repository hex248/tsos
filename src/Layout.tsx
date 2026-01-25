import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Home, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({
    children,
    sidebarContent,
}: {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
}) {
    const location = useLocation();

    return (
        <div className="flex h-screen w-full">
            {/* sidebar - fixed width */}
            <div className="w-80 border-r bg-card p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <img src="/icon.png" alt="" aria-hidden="true" className="size-8" />
                    <h1 className="text-2xl font-semibold">The Shape of Sound</h1>
                </div>
                <div className="flex-1">{sidebarContent || null}</div>

                <div className="flex items-center gap-4">
                    <ThemeToggle className="rounded-lg" />
                    {location.pathname !== "/settings" && (
                        <Link to="/settings">
                            <Button variant="ghost" size="icon" className="rounded-lg">
                                <Settings className="size-6" />
                            </Button>
                        </Link>
                    )}
                    {location.pathname !== "/" && (
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="rounded-lg">
                                <Home className="size-6" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* canvas area - flex-1 */}
            <main className="flex-1 flex items-center justify-center bg-background">{children}</main>
        </div>
    );
}
