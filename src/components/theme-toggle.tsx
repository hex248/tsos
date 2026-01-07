import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

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
        <button
            type="button"
            className="rounded cursor-pointer"
            onClick={() => {
                if (!theme || theme === "light") updateTheme("dark");
                else updateTheme("light");
            }}
        >
            {theme === "dark" ? <Sun /> : <Moon />}
        </button>
    );
}

export default ThemeToggle;
