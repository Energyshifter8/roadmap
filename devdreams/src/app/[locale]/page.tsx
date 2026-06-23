"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { RoadmapType } from "@/lib/roadmapSources";
import { useParams } from "next/navigation";

const RoadmapCanvas = dynamic(() => import("@/components/RoadmapCanvas"), {
  ssr: false,
});

export default function Home() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "mn";
  const [activeTab, setActiveTab] = useState<RoadmapType>("frontend");

  return (
    <main className="min-h-screen bg-black flex flex-col">
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
