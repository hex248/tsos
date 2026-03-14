import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function ThemeToggle({ className }: { className?: string }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
            return;
        }

        document.documentElement.classList.toggle("dark", false);
    }, []);

    function updateTheme(newTheme: string) {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        document.documentElement.classList.toggle("dark", newTheme === "dark");
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("", className)}
            onClick={() => {
                if (theme === "light") updateTheme("dark");
                else updateTheme("light");
            }}
        >
            {theme === "dark" ? <Sun className="size-6" /> : <Moon className="size-6" />}
        </Button>
    );
}

export default ThemeToggle;
