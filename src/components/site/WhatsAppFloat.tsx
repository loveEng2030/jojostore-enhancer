import { MessageCircle } from "lucide-react";
import { WA_DEFAULT } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function WhatsAppFloat() {
  const { t } = useI18n();
  return (
    <a
      href={WA_DEFAULT}
      target="_blank"
      rel="noreferrer"
      aria-label={t("common.whatsapp")}
      className="fixed bottom-5 start-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-xl shadow-green-900/20 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      {t("common.whatsapp")}
    </a>
  );
}
