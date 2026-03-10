import AudioWaveform from "@/components/AudioWaveform";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Home, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({
    children,
    sidebarContent,
    waveformColor,
    viewportTopLeftOverlay,
    viewportLeftOverlay,
    viewportRightOverlay,
}: {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
    waveformColor?: string;
    viewportTopLeftOverlay?: React.ReactNode;
    viewportLeftOverlay?: React.ReactNode;
    viewportRightOverlay?: React.ReactNode;
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
                <div className="flex-1 overflow-y-auto">{sidebarContent || null}</div>

                {/* Audio Waveform Visualization */}
                <AudioWaveform color={waveformColor} />

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
            <main className="flex-1 flex items-center justify-center bg-background relative">
                {children}

                {viewportTopLeftOverlay ? (
                    <div className="absolute top-4 left-4 z-10">{viewportTopLeftOverlay}</div>
                ) : null}
                {viewportLeftOverlay ? (
                    <div className="absolute bottom-4 left-4 z-10">{viewportLeftOverlay}</div>
                ) : null}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-4 right-4 rounded-full px-4"
                        >
                            <Clock className="size-4 mr-1" />
                            Coming Soon
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Coming Soon</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <h4 className="font-medium">Key Selection</h4>
                                <p className="text-sm text-muted-foreground">
                                    Allow users to select a musical key (e.g. C Major, A Minor) so the
                                    keyboard will follow a key, making it easier to create succinct melodies.
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {viewportRightOverlay ? (
                    <div className="absolute bottom-4 right-4 z-10">{viewportRightOverlay}</div>
                ) : null}
            </main>
        </div>
    );
}
