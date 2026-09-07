import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  src: string;
  alt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageLightbox({ src, alt, open, onOpenChange }: ImageLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={() => onOpenChange(false)}
    >
      <Button
        type="button"
        onClick={() => onOpenChange(false)}
        variant="secondary"
        size="icon"
        className="absolute end-4 top-4 h-11 w-11 rounded-full shadow-lg transition-transform hover:scale-105"
        aria-label="إغلاق الصورة"
        title="إغلاق"
      >
        <X className="h-5 w-5" />
      </Button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90svh] max-w-[94vw] object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>,
    document.body,
  );
}

export function ImageZoomHint() {
  return (
    <span className="absolute bottom-3 end-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
      <ZoomIn className="h-4 w-4" />
    </span>
  );
}