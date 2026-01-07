import ThemeToggle from "./components/theme-toggle";

function Index() {
    return (
        <div className="flex flex-col h-[100vh] items-center">
            <header className="w-full flex items-center justify-between border-b h-12 p-2">
                <h1 className="text-3xl font-bold">The Shape of Sound</h1>
                <ThemeToggle />
            </header>
            <main className="w-full flex-1 p-4 flex items-center justify-center">
                <div className="w-64 h-64 bg-orange-600 rounded-full" />
            </main>{" "}
        </div>
    );
}

export default Index;
