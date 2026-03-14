"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm({ nextPath }: { nextPath: string }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        const { error } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: nextPath,
        });

        if (error) {
            setErrorMessage(error.message || "We could not create your account.");
            setIsSubmitting(false);
            return;
        }

        router.replace(nextPath);
        router.refresh();
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label htmlFor="register-name" className="text-sm font-medium">
                    Name
                </label>
                <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    autoComplete="name"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="register-email" className="text-sm font-medium">
                    Email
                </label>
                <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    autoComplete="email"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="register-password" className="text-sm font-medium">
                    Password
                </label>
                <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>

            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
        </form>
    );
}
