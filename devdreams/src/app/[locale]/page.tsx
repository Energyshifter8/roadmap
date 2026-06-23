"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { RoadmapType } from "@/lib/roadmapSources";

const RoadmapCanvas = dynamic(() => import("@/components/RoadmapCanvas"), {
  ssr: false,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<RoadmapType>("frontend");
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locale={locale}
      />
      <div className="flex-1">
        <RoadmapCanvas key={activeTab} type={activeTab} />
      </div>
    </main>
  );
}
