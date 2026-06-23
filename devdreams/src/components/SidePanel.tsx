"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
  node: { label: string; level: string; description?: string } | null;
};

export default function SidePanel({ open, onClose, node }: Props) {
  const t = useTranslations("panel");
  const tLevels = useTranslations("levels");

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="bg-zinc-900 border-zinc-700 text-white w-80"
      >
        <SheetHeader>
          <SheetTitle className="text-white font-mono text-sm">
            {node?.label}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {node?.level && (
            <span className="text-xs text-zinc-400 font-mono">
              {tLevels(node.level as 'beginner' | 'intermediate' | 'advanced' | 'recommended') ?? node.level}
            </span>
          )}
          {node?.description ? (
            <p className="text-zinc-300 text-sm leading-relaxed">
              {node.description}
            </p>
          ) : (
            <p className="text-zinc-600 text-sm italic">
              No description available.
            </p>
          )}
          {node?.label && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-800 font-mono text-xs"
              onClick={() => window.open(`https://roadmap.sh`, "_blank")}
            >
              {t("learnMore")} →
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
