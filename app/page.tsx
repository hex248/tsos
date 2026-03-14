import Index from "@/Index";
import { getServerSession } from "@/lib/auth/server";

export default async function Page() {
    const session = await getServerSession();

    return <Index pageMode="root" isAuthenticated={Boolean(session)} />;
}
