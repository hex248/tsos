import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle({ className }: { className?: string }) {
    const [theme, setTheme] = useState<string | null>();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    function updateTheme(newTheme: string) {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        document.documentElement.classList.toggle("dark");
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("", className)}
            onClick={() => {
                if (!theme || theme === "light") updateTheme("dark");
                else updateTheme("light");
            }}
        >
            {theme === "dark" ? <Sun className="size-6" /> : <Moon className="size-6" />}
        </Button>
    );
}

export default ThemeToggle;
