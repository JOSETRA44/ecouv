import Link from "next/link";
import { FileText, FileImage, FileSpreadsheet, Presentation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Material } from "@/lib/supabase/types";

export const CATEGORY_LABEL: Record<string, string> = {
  infografia: "Infografía",
  documento: "Documento",
  guia: "Guía",
};

export function iconForMime(mime: string) {
  if (mime.startsWith("image/")) return FileImage;
  if (mime.includes("spreadsheet")) return FileSpreadsheet;
  if (mime.includes("presentation")) return Presentation;
  return FileText;
}

export function MaterialCard({
  material,
  className,
}: {
  material: Material;
  className?: string;
}) {
  const Icon = iconForMime(material.mime_type);

  return (
    <Link href={`/materiales/${material.slug}`} className={className}>
      <Card className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-granate-50 text-granate-600">
            <Icon className="h-5 w-5" strokeWidth={1.6} />
          </div>
          {material.category && (
            <Badge tone="neutral">
              {CATEGORY_LABEL[material.category] ?? material.category}
            </Badge>
          )}
        </div>
        <div>
          <h3 className={cn("text-base font-medium leading-snug text-navy", "line-clamp-2")}>
            {material.title}
          </h3>
          <p className="mt-2 text-sm font-light leading-relaxed text-muted line-clamp-3">
            {material.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
