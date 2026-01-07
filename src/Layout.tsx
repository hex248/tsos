import ThemeToggle from "@/components/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full">
            {/* sidebar - fixed width */}
            <aside className="w-80 border-r bg-card p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">The Shape of Sound</h1>
                    <ThemeToggle />
                </div>
                <div className="flex-1">{/* controls will go here in later phases */}</div>
            </aside>

            {/* canvas area - flex-1 */}
            <main className="flex-1 flex items-center justify-center bg-background">{children}</main>
        </div>
    );
}
