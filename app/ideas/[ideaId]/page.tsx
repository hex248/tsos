import Index from "@/Index";
import { getIdeaById } from "@/lib/ideas/repository";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface IdeaPageProps {
    params: Promise<{
        ideaId: string;
    }>;
}

export async function generateMetadata({ params }: IdeaPageProps): Promise<Metadata> {
    const { ideaId } = await params;
    const record = await getIdeaById(ideaId);

    if (!record) {
        return {
            title: "Idea Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return {
        title: `${record.title} | The Shape of Sound`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function Page({ params }: IdeaPageProps) {
    const { ideaId } = await params;
    const record = await getIdeaById(ideaId);

    if (!record) {
        notFound();
    }

    return (
        <Index
            pageMode="public"
            initialConfig={record.config}
            initialTitle={record.title}
            ideaId={record.id}
        />
    );
}
