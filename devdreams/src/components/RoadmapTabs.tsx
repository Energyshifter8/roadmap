"use client";

import { useTranslations } from "next-intl";

export type RoadmapTabId = "frontend" | "backend" | "devops" | "mobile";

export interface TabDef {
  id: RoadmapTabId;
  disabled?: boolean;
}

interface RoadmapTabsProps {
  tabs: TabDef[];
  activeTab: RoadmapTabId;
  onTabChange: (id: RoadmapTabId) => void;
}

export default function RoadmapTabs({
  tabs,
  activeTab,
  onTabChange,
}: RoadmapTabsProps) {
  const t = useTranslations("tabs");

  return (
    <div className="flex flex-wrap justify-center gap-5 mb-16">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const isDisabled = tab.disabled;

        if (isDisabled) {
          return (
            <div key={tab.id} className="relative group">
              <button
                disabled
                className="
                  px-8 py-3.5 text-base font-black tracking-wide rounded-lg
                  border-2 border-zinc-900
                  bg-white text-zinc-500
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  cursor-not-allowed
                  transition-all
                "
              >
                {t(tab.id)}
              </button>

              {/* Coming soon tooltip */}
              <div
                className="absolute -top-2 right-0 translate-x-1/4 -translate-y-full
                px-2.5 py-1 bg-zinc-900 text-white text-[10px] font-semibold
                rounded-md shadow-lg whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none z-50"
              >
                {t("coming-soon")}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full
                  w-0 h-0 border-l-4 border-r-4 border-t-4
                  border-l-transparent border-r-transparent border-t-zinc-900"
                />
              </div>
            </div>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-8 py-3.5 text-base font-black tracking-wide rounded-lg
              border-2 border-zinc-900
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              transition-all cursor-pointer
              active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              ${
                isActive
                  ? "bg-[#ffd000] text-zinc-900"
                  : "bg-white text-zinc-500 hover:bg-zinc-100"
              }
            `}
          >
            {t(tab.id)}
          </button>
        );
      })}
    </div>
  );
}
