import RegisterForm from "@/components/auth/RegisterForm";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { getServerSession } from "@/lib/auth/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface RegisterPageProps {
    searchParams: Promise<{
        next?: string;
    }>;
}

export default async function Page({ searchParams }: RegisterPageProps) {
    const session = await getServerSession();
    const { next } = await searchParams;
    const nextPath = getSafeRedirectPath(next);

    if (session) {
        redirect(nextPath);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md rounded-md border bg-card p-6 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">Start saving ideas</h1>
                    <p className="text-sm text-muted-foreground">
                        Registration is optional, but it unlocks persistent saved ideas.
                    </p>
                </div>
                <div className="mt-6">
                    <RegisterForm nextPath={nextPath} />
                </div>
                <div className="mt-4 text-sm">
                    <Link
                        href={`/login?next=${encodeURIComponent(nextPath)}`}
                        className="text-primary hover:underline"
                    >
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}
