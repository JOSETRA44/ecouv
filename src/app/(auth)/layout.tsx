import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-white">
      <div className="pattern-graph" aria-hidden />
      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/brand/logo-unsa.svg"
            alt="Universidad Nacional de San Agustín de Arequipa"
            width={32}
            height={32}
            unoptimized
          />
          <Image
            src="/brand/logo-fec.svg"
            alt="Facultad de Economía"
            width={32}
            height={32}
            unoptimized
          />
          <span className="text-sm font-medium tracking-tight text-navy">
            Brigada Ambiental FEC
          </span>
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
