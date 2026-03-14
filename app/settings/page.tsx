"use client";

import dynamic from "next/dynamic";

const SettingsPage = dynamic(() => import("@/Settings"), {
    ssr: false,
});

export default function Page() {
    return <SettingsPage />;
}
