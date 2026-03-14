"use client";

import dynamic from "next/dynamic";

const IndexPage = dynamic(() => import("@/Index"), {
    ssr: false,
});

export default function Page() {
    return <IndexPage />;
}
