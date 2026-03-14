import Settings from "@/Settings";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { getServerSession } from "@/lib/auth/server";
import { listIdeasForOwner } from "@/lib/ideas/repository";
import { serializeIdeaRecord } from "@/lib/ideas/schema";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession();

    if (!session) {
        redirect(`/login?next=${encodeURIComponent(getSafeRedirectPath("/settings"))}`);
    }

    const ideas = await listIdeasForOwner(session.user.id);

    return <Settings ideas={ideas.map(serializeIdeaRecord)} />;
}
