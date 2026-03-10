import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function TutorialDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-md font-semibold"
                    aria-label="Open tutorial"
                >
                    <span aria-hidden="true">?</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Quick tutorial</DialogTitle>
                    <DialogDescription>
                        Play notes, shape the sound, switch modes, then export what you make.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                    <section className="rounded-md border bg-muted/20 p-3">
                        <h3 className="text-md font-medium">Keyboard input</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Use your computer keyboard to play notes live. The mapped keys climb upward in
                            pitch from the lower letter rows to the number row.
                        </p>
                    </section>

                    <section className="rounded-md border bg-muted/20 p-3">
                        <h3 className="text-md font-medium">Sidebar controls</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            The controls in the sidebar change how the shape sounds. Shape, colour, octave,
                            size, roundness, sound shape, and wobble all affect the result you hear.
                        </p>
                    </section>

                    <section className="rounded-md border bg-muted/20 p-3">
                        <h3 className="text-md font-medium">Edit mode vs view mode</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Use the mode button in the bottom left, or press{" "}
                            <span className="font-mono border px-1 py-0.5">Tab</span>, to switch modes.{" "}
                            <span className="underline underline-offset-2">Edit</span> mode shows the size and
                            roundness handles. <span className="underline underline-offset-2">View</span> mode
                            hides them and lets you rotate the shape.
                        </p>
                    </section>

                    <section className="rounded-md border bg-muted/20 p-3">
                        <h3 className="text-md font-medium">Export sound</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            When you are happy with the result, use Export Audio in the bottom right to
                            download a <span className="underline underline-offset-2">WAV</span> or{" "}
                            <span className="underline underline-offset-2">MP3</span>.
                        </p>
                    </section>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Start exploring</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
