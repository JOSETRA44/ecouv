import Link from "next/link";
import { Sun } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="mesh" aria-hidden>
        <i /><i /><i />
      </div>
      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-guinda-600 text-white shadow-z1">
            <Sun className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="display text-[15px] font-bold tracking-tight text-navy">
            BRIGADA AMBIENTAL FEC
          </span>
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
