import Index from "@/Index";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { getServerSession } from "@/lib/auth/server";
import { getIdeaById, getIdeaByIdForOwner } from "@/lib/ideas/repository";
import { notFound, redirect } from "next/navigation";

interface IdeaEditPageProps {
    params: Promise<{
        ideaId: string;
    }>;
}

export default async function Page({ params }: IdeaEditPageProps) {
    const { ideaId } = await params;
    const session = await getServerSession();

    if (!session) {
        redirect(`/login?next=${encodeURIComponent(getSafeRedirectPath(`/ideas/${ideaId}/edit`))}`);
    }

    const ownerRecord = await getIdeaByIdForOwner(ideaId, session.user.id);

    if (!ownerRecord) {
        const publicRecord = await getIdeaById(ideaId);

        if (!publicRecord) {
            notFound();
        }

        redirect(`/ideas/${ideaId}`);
    }

    return (
        <Index
            pageMode="edit"
            initialConfig={ownerRecord.config}
            initialTitle={ownerRecord.title}
            ideaId={ownerRecord.id}
            isAuthenticated
        />
    );
}
