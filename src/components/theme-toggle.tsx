import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
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
            variant="dummy"
            size="none"
            className="rounded cursor-pointer"
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
