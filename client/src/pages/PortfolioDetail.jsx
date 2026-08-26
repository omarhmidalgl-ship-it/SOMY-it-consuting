import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import api from "../api/client";

export default function PortfolioDetail() {
  const { slug } = useParams();
  const { t } = useI18n();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/portfolio/${slug}`);
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-somy-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-somy-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-somy-navy flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Project not found.</p>
          <Link to="/" className="text-somy-accent hover:text-somy-accent-light">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-somy-navy text-white">
      <nav className="fixed top-0 w-full z-50 bg-somy-navy/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="SOMY" className="h-9 w-auto" />
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition">← Home</Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{item.title}</h1>
          {item.client && (
            <p className="text-gray-400 text-lg mb-6">{t("portfolio.client")}: {item.client}</p>
          )}

          <div className="bg-somy-surface rounded-2xl p-8 border border-white/5 mb-8">
            <h2 className="font-display text-xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="bg-somy-surface rounded-2xl p-8 border border-white/5 mb-8">
            <h2 className="font-display text-xl font-bold mb-4">{t("portfolio.techUsed")}</h2>
            <div className="flex flex-wrap gap-2">
              {item.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-somy-accent/10 text-somy-accent-light text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-somy-accent hover:bg-somy-accent-light transition font-semibold"
            >
              {t("portfolio.viewProject")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
