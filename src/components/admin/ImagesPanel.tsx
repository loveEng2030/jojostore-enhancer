import { useState } from "react";
import { Loader2, RotateCcw, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { signedImageUrl } from "@/lib/catalog-store";
import { imageFallback, siteImages } from "@/lib/site-assets";
import { useSiteContent } from "@/lib/site-content";

export function ImagesPanel() {
  const { images, reload } = useSiteContent();
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");

  const upload = async (key: string, file: File) => {
    setBusyKey(key);
    setError("");
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `site/${key.replace(/\./g, "-")}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "31536000" });
      if (upErr) throw upErr;
      const url = await signedImageUrl(path);
      const { error: dbErr } = await supabase
        .from("site_images")
        .upsert({ key, url }, { onConflict: "key" });
      if (dbErr) throw dbErr;
      await reload();
    } catch {
      setError("حصلت مشكلة أثناء رفع الصورة، جرّب تاني");
    }
    setBusyKey("");
  };

  const reset = async (key: string) => {
    setBusyKey(key);
    await supabase.from("site_images").delete().eq("key", key);
    await reload();
    setBusyKey("");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        اختار صورة جديدة لأي مكان في الموقع، والتغيير يظهر فورًا لكل الزوار.
      </p>
      {error && <p className="text-sm font-bold text-destructive">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {siteImages.map((img) => {
          const current = images[img.key] ?? imageFallback(img.key);
          const custom = Boolean(images[img.key]);
          return (
            <div key={img.key} className="rounded-3xl bg-card p-4 ring-1 ring-border">
              <img
                src={current}
                alt={img.label}
                className="h-40 w-full rounded-2xl object-cover"
                loading="lazy"
              />
              <p className="mt-3 text-sm font-bold">{img.label}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                  {busyKey === img.key ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  تغيير الصورة
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void upload(img.key, f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {custom && (
                  <button
                    type="button"
                    onClick={() => reset(img.key)}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> الأصلية
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
