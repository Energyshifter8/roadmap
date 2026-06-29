import Image from "next/image";

export default function Footer() {
  return (
    <div className="fixed bottom-5 left-5 sm:bottom-8 sm:left-8 z-50">
      <a
        href="https://nextjs.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 sm:gap-3 rounded-full border border-zinc-800 bg-[#141414]/90 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:text-white shadow-lg backdrop-blur-sm"
      >
        <Image
          src="/next.svg"
          alt="Next.js"
          width={14}
          height={14}
          className="sm:w-4 sm:h-4 invert"
        />
        <span className="font-mono tracking-wide whitespace-nowrap">
          Built with Next.js
        </span>
      </a>
    </div>
  );
}
