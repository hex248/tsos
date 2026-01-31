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
}: {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
    waveformColor?: string;
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

                {/* Coming Soon Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-4 right-4 rounded-full px-4"
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
                                <h4 className="font-medium">Information Tooltips</h4>
                                <p className="text-sm text-muted-foreground">
                                    Will be displayed on each setting explaining what it does and how it
                                    affects the sound.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium">Wobble Controls</h4>
                                <p className="text-sm text-muted-foreground">
                                    Wobble will modulate the pitch of the sound, adding vibrato and subtle
                                    frequency variations for a more organic, "human" feel. The more "random"
                                    the wobble, the more imperfect and natural-sounding it will be.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium">Physical Control Points</h4>
                                <p className="text-sm text-muted-foreground">
                                    Interactive handles on the shape that let you directly manipulate size,
                                    roundness, and wobble by dragging, giving tactile control over the
                                    sound-visual relationship. This will make the sound design more intuitive
                                    and engaging.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium">Key Selection</h4>
                                <p className="text-sm text-muted-foreground">
                                    Allow users to select a musical key (e.g. C Major, A Minor) so the
                                    keyboard will follow a key, making it easier to create succinct melodies.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium">Export Sound</h4>
                                <p className="text-sm text-muted-foreground">
                                    Users will be able to export their generated sounds as .wav or .mp3. This
                                    can then be sampled into other audio software or used in projects.
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
