import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import api from "../api/client";

export default function Blog() {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/blog");
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t("blog.title")}</h1>
          <p className="text-gray-400 text-lg mb-12">{t("blog.subtitle")}</p>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-somy-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No posts yet.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block bg-somy-surface rounded-2xl p-8 border border-white/5 hover:border-somy-accent/30 transition"
                >
                  <h2 className="font-display text-2xl font-bold mb-3 hover:text-somy-accent-light transition">{post.title}</h2>
                  <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {post.author && (
                      <span className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
