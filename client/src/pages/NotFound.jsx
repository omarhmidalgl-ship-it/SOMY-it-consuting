import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-somy-navy flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display text-8xl font-bold text-somy-accent/20 mb-4">{t("notFound.title")}</p>
        <h1 className="font-display text-2xl font-bold mb-2">{t("notFound.subtitle")}</h1>
        <p className="text-gray-400 mb-8 max-w-md">{t("notFound.desc")}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-somy-accent hover:bg-somy-accent-light transition font-semibold"
        >
          {t("notFound.back")}
        </Link>
      </div>
    </div>
  );
}
