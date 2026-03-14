import LoginForm from "@/components/auth/LoginForm";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { getServerSession } from "@/lib/auth/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface LoginPageProps {
    searchParams: Promise<{
        next?: string;
    }>;
}

export default async function Page({ searchParams }: LoginPageProps) {
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
                    <h1 className="text-2xl font-semibold">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to manage and edit your ideas.</p>
                </div>
                <div className="mt-6">
                    <LoginForm nextPath={nextPath} />
                </div>
                <div className="mt-4 text-sm">
                    <Link
                        href={`/register?next=${encodeURIComponent(nextPath)}`}
                        className="text-primary hover:underline"
                    >
                        Create account
                    </Link>
                </div>
            </div>
        </main>
    );
}
