import Link from "next/link";
import { FileText, FileImage, FileSpreadsheet, Presentation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Material } from "@/lib/supabase/types";
import Image from "next/image";

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

const CATEGORY_STYLES: Record<string, { iconColor: string, iconBg: string, borderColor: string, borderHover: string, bgImage: string }> = {
  infografia: {
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-100/50 dark:bg-rose-500/10",
    borderColor: "border-rose-200/50 dark:border-rose-500/20",
    borderHover: "group-hover:border-rose-300 dark:group-hover:border-rose-500/40",
    bgImage: "/brand/materials/1.webp"
  },
  documento: {
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100/50 dark:bg-blue-500/10",
    borderColor: "border-blue-200/50 dark:border-blue-500/20",
    borderHover: "group-hover:border-blue-300 dark:group-hover:border-blue-500/40",
    bgImage: "/brand/materials/2.webp"
  },
  guia: {
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100/50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200/50 dark:border-emerald-500/20",
    borderHover: "group-hover:border-emerald-300 dark:group-hover:border-emerald-500/40",
    bgImage: "/brand/materials/3.webp"
  },
};

const DEFAULT_STYLE = {
  iconColor: "text-purple-600 dark:text-purple-400",
  iconBg: "bg-purple-100/50 dark:bg-purple-500/10",
  borderColor: "border-purple-200/50 dark:border-purple-500/20",
  borderHover: "group-hover:border-purple-300 dark:group-hover:border-purple-500/40",
  bgImage: "/brand/materials/4.webp"
};

export function MaterialCard({
  material,
  className,
}: {
  material: Material;
  className?: string;
}) {
  const Icon = iconForMime(material.mime_type);
  const style = material.category && CATEGORY_STYLES[material.category] 
    ? CATEGORY_STYLES[material.category] 
    : DEFAULT_STYLE;

  return (
    <Link href={`/materiales/${material.slug}`} className={cn("group block outline-none h-full", className)}>
      <Card className={cn(
        "relative flex h-full flex-col overflow-hidden border transition-all duration-500 ease-out bg-background/20",
        "hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50",
        style.borderColor,
        style.borderHover
      )}>

        {/* Textured/Porous Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={style.bgImage}
            alt="Textura de fondo"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110 shadow-sm",
              style.iconBg,
              style.iconColor,
              "backdrop-blur-xl bg-white/70 dark:bg-black/50"
            )}>
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
            {material.category && (
              <Badge 
                // @ts-ignore
                tone="neutral"
                className={cn(
                  "capitalize bg-background/80 backdrop-blur-md border shadow-sm",
                  style.borderColor,
                  style.iconColor
                )}
              >
                {CATEGORY_LABEL[material.category] ?? material.category}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col flex-grow gap-2.5">
            <h3 className="text-lg font-semibold tracking-tight text-foreground line-clamp-2 transition-colors duration-300">
              {material.title}
            </h3>
            <p className="text-sm font-normal leading-relaxed text-muted-foreground line-clamp-3">
              {material.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
