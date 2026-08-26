import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import api from "../api/client";

export default function BlogPost() {
  const { slug } = useParams();
  const { t } = useI18n();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/blog/${slug}`);
        setPost(data);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-somy-navy flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Post not found.</p>
          <Link to="/blog" className="text-somy-accent hover:text-somy-accent-light">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const renderContent = (md) => {
    return md.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="font-display text-xl font-bold mt-6 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith("```")) return null;
      if (line.startsWith("- ")) return <li key={i} className="text-gray-300 ml-4 mb-1">{line.slice(2)}</li>;
      if (line.trim() === "") return <br key={i} />;
      if (line.includes("**")) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        return (
          <p key={i} className="text-gray-300 leading-relaxed mb-2">
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      }
      if (line.includes("`")) {
        const parts = line.split(/(`.*?`)/);
        return (
          <p key={i} className="text-gray-300 leading-relaxed mb-2">
            {parts.map((part, j) =>
              part.startsWith("`") && part.endsWith("`")
                ? <code key={j} className="bg-somy-navy px-1.5 py-0.5 rounded text-somy-accent-light text-sm">{part.slice(1, -1)}</code>
                : part
            )}
          </p>
        );
      }
      return <p key={i} className="text-gray-300 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-somy-navy text-white">
      <nav className="fixed top-0 w-full z-50 bg-somy-navy/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="SOMY" className="h-9 w-auto" />
          </Link>
          <Link to="/blog" className="text-sm text-gray-400 hover:text-white transition">{t("blog.backToBlog")}</Link>
        </div>
      </nav>

      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex items-center gap-3 mb-8 text-sm text-gray-500">
            {post.author && (
              <span className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: post.author.avatarColor || "#6366f1" }}
                >
                  {post.author.name.charAt(0)}
                </span>
                {t("blog.by")} {post.author.name}
              </span>
            )}
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>

          <div className="prose-somy">
            {renderContent(post.content)}
          </div>
        </div>
      </article>
    </div>
  );
}
