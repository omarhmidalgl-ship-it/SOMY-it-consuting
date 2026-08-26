import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import { useAuthStore } from "../store/authStore";
import api from "../api/client";

const SERVICES = [
  { key: "web", icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9 9 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418", color: "from-indigo-500 to-blue-500", glow: "shadow-glow-accent" },
  { key: "mobile", icon: "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3", color: "from-purple-500 to-pink-500", glow: "shadow-glow-purple" },
  { key: "desktop", icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 7.41A2.25 2.25 0 0 1 2.25 5.496V5.25", color: "from-cyan-500 to-emerald-500", glow: "shadow-glow-cyan" },
];

const PROCESS_STEPS = [
  { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", label: "Discover" },
  { icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "Design" },
  { icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", label: "Build" },
  { icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z", label: "Ship" },
  { icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z", label: "Support" },
];

function HeroCodeBackground() {
  const codeSnippets = [
    "const app = new SomyPlatform({",
    "  web: true,",
    "  mobile: true,",
    "  desktop: true,",
    "});",
    "",
    "async function deploy() {",
    "  await build();",
    "  await test();",
    "  return ship();",
    "}",
    "",
    "import { Pipeline } from '@somy/core';",
    "export default Pipeline.create({",
    "  discover: Phase.one(),",
    "  design: Phase.two(),",
    "  build: Phase.three(),",
    "  ship: Phase.four(),",
    "});",
    "",
    "class Team {",
    "  members = 4;",
    "  platforms = ['web', 'mobile', 'desktop'];",
    "  deliver() {",
    "    return this.platforms.map(p =>",
    "      buildFor(p, { quality: 'premium' })",
    "    );",
    "  }",
    "}",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 hero-grid opacity-40" />

      {/* Floating code snippets - left side */}
      <div className="absolute left-0 top-0 w-80 h-full hidden lg:block">
        {codeSnippets.slice(0, 10).map((line, i) => (
          <div
            key={`l-${i}`}
            className="code-line absolute text-somy-accent"
            style={{
              left: `${20 + Math.random() * 60}px`,
              top: `${i * 28}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Floating code snippets - right side */}
      <div className="absolute right-0 top-0 w-80 h-full hidden lg:block">
        {codeSnippets.slice(10).map((line, i) => (
          <div
            key={`r-${i}`}
            className="code-line absolute text-somy-purple"
            style={{
              right: `${20 + Math.random() * 60}px`,
              top: `${i * 28 + 100}px`,
              animationDelay: `${i * 0.5 + 1}s`,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Floating connection nodes */}
      {[
        { x: "15%", y: "20%", size: 3, delay: 0 },
        { x: "85%", y: "30%", size: 2, delay: 1 },
        { x: "10%", y: "70%", size: 2, delay: 2 },
        { x: "90%", y: "60%", size: 3, delay: 0.5 },
        { x: "50%", y: "15%", size: 2, delay: 1.5 },
        { x: "70%", y: "80%", size: 2, delay: 2.5 },
        { x: "25%", y: "85%", size: 3, delay: 3 },
        { x: "80%", y: "10%", size: 2, delay: 0.8 },
      ].map((node, i) => (
        <div
          key={`node-${i}`}
          className="absolute rounded-full bg-somy-accent/30 animate-pulse-glow"
          style={{
            left: node.x,
            top: node.y,
            width: `${node.size * 4}px`,
            height: `${node.size * 4}px`,
            animationDelay: `${node.delay}s`,
          }}
        />
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
        <line x1="15%" y1="20%" x2="50%" y2="15%" stroke="#6366f1" strokeWidth="1" style={{ animation: "linePulse 4s ease-in-out infinite" }} />
        <line x1="50%" y1="15%" x2="85%" y2="30%" stroke="#8b5cf6" strokeWidth="1" style={{ animation: "linePulse 4s ease-in-out 1s infinite" }} />
        <line x1="10%" y1="70%" x2="25%" y2="85%" stroke="#06b6d4" strokeWidth="1" style={{ animation: "linePulse 4s ease-in-out 2s infinite" }} />
        <line x1="80%" y1="10%" x2="90%" y2="60%" stroke="#6366f1" strokeWidth="1" style={{ animation: "linePulse 4s ease-in-out 1.5s infinite" }} />
      </svg>
    </div>
  );
}

function ProcessConnector({ hidden }) {
  if (hidden) return null;
  return (
    <div className="hidden lg:flex items-center justify-center w-8">
      <div className="w-8 h-[2px] bg-gradient-to-r from-somy-accent/40 to-somy-purple/40 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-somy-accent/60" />
      </div>
    </div>
  );
}

export default function Landing() {
  const { t, lang, toggleLang, langLabel, dir } = useI18n();
  const { user, loginWithGoogle } = useAuthStore();
  const googleBtnRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          api.get("/portfolio/featured"),
          api.get("/testimonials"),
        ]);
        setPortfolio(pRes.data);
        setTestimonials(tRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential);
          } catch (err) {
            console.error(err);
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "filled_black",
        size: "large",
        width: "320",
        text: "continue_with",
        shape: "rectangular",
      });
    }
  }, [loginWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || "Something went wrong";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id) => {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const SectionTitle = ({ badge, title, subtitle, light }) => (
    <div className="text-center mb-16 md:mb-20">
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase mb-6 glass-light text-somy-accent-light border-glow">
          <span className="w-1.5 h-1.5 rounded-full bg-somy-accent animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className={`font-display text-3xl md:text-5xl font-bold mb-4 ${light ? "text-white" : ""}`}>{title}</h2>
      <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-somy-navy text-white selection:bg-somy-accent/30">
      {/* ─── Navigation ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="SOMY" className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {["services", "process", "portfolio", "pricing", "contact"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} className="relative px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 group">
                {t(`nav.${id}`)}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-somy-accent to-somy-purple group-hover:w-3/4 transition-all duration-300" />
              </button>
            ))}
            <Link to="/blog" className="relative px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 group">
              {t("nav.blog")}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-somy-accent to-somy-purple group-hover:w-3/4 transition-all duration-300" />
            </Link>
            <div className="w-px h-5 bg-white/10 mx-2" />
            <button onClick={toggleLang} className="text-xs px-2.5 py-1.5 rounded-lg glass-light text-gray-400 hover:text-white transition-all duration-300 font-mono tracking-wider">
              {langLabel}
            </button>
            <Link to="/login" className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-somy-accent to-somy-purple text-white text-sm font-semibold hover:shadow-glow-accent transition-all duration-300 hover:scale-[1.02]">
              {t("nav.signIn")}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleLang} className="text-xs px-2 py-1 rounded-lg glass-light text-gray-400 font-mono">
              {langLabel}
            </button>
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={mobileNavOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 9h16.5m-16.5 6.75h16.5"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${mobileNavOpen ? "max-h-96" : "max-h-0"}`}>
          <div className="glass-strong border-t border-white/5 px-6 py-5 space-y-1">
            {["services", "process", "portfolio", "pricing", "contact"].map((id) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-2.5 text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-300">
                {t(`nav.${id}`)}
              </button>
            ))}
            <Link to="/blog" onClick={() => setMobileNavOpen(false)} className="block py-2.5 text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-300">
              {t("nav.blog")}
            </Link>
            <div className="pt-3">
              <Link to="/login" onClick={() => setMobileNavOpen(false)} className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-somy-accent to-somy-purple text-sm font-semibold">
                {t("nav.signIn")}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: "url('/bg/hero.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/40 via-somy-navy/60 to-somy-navy" />
        <div className="absolute inset-0 hero-grid-dense opacity-30" />
        <HeroCodeBackground />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-somy-accent/8 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-somy-purple/8 rounded-full blur-[100px] animate-float-slower pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-somy-cyan/5 rounded-full blur-[80px] animate-pulse-glow pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border-glow mb-8 opacity-0 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-somy-mint animate-pulse" />
            <span className="text-xs font-medium text-gray-300 tracking-wider uppercase">Software Engineering Studio</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold mb-8 leading-[0.95] opacity-0 animate-fade-in-up-delay">
            <span className="text-white block">3 Platforms.</span>
            <span className="text-gradient block mt-2">1 Team.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in-up-delay-2">
            {t("hero.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up-delay-2">
            <button
              onClick={() => scrollTo("contact")}
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-somy-accent to-somy-purple text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-glow-accent-lg hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-somy-purple to-somy-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                {t("hero.cta")}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => scrollTo("portfolio")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass-light text-gray-300 hover:text-white font-semibold text-lg transition-all duration-300 hover:border-somy-accent/30"
            >
              View Our Work
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Platform tags */}
          <div className="flex items-center justify-center gap-3 mt-12 opacity-0 animate-fade-in-up-delay-2">
            {["Web", "Mobile", "Desktop"].map((platform, i) => (
              <span key={platform} className={`px-4 py-2 rounded-lg text-sm font-mono glass-light transition-all duration-300 hover:scale-105 cursor-default ${
                i === 0 ? "text-blue-400 hover:shadow-glow-accent" :
                i === 1 ? "text-purple-400 hover:shadow-glow-purple" :
                "text-cyan-400 hover:shadow-glow-cyan"
              }`}>
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-[10px] text-gray-500 tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-somy-accent animate-bounce" />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Services ─── */}
      <section id="services" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('/bg/code.jpg')" }} />
        <div className="absolute inset-0 bg-somy-accent/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/70 via-somy-navy/40 to-somy-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-somy-navy/50 via-transparent to-somy-navy/50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            badge="Services"
            title={t("services.title")}
            subtitle={t("services.subtitle")}
          />

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {SERVICES.map((s) => (
              <div
                key={s.key}
                className="group relative rounded-2xl p-8 glass card-hover border-glow cursor-default"
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-somy-accent/10 to-somy-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${s.glow}`}>
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>

                <h3 className="relative font-display text-xl font-bold mb-3 group-hover:text-somy-accent-light transition-colors duration-300">
                  {t(`services.${s.key}.title`)}
                </h3>
                <p className="relative text-gray-400 leading-relaxed text-sm">
                  {t(`services.${s.key}.desc`)}
                </p>

                {/* Decorative corner glow */}
                <div className="absolute -top-px -right-px w-20 h-20 bg-gradient-to-br from-somy-accent/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Process ─── */}
      <section id="process" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('/bg/dev.jpg')" }} />
        <div className="absolute inset-0 bg-somy-accent/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/70 via-somy-navy/40 to-somy-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-somy-navy/50 via-transparent to-somy-navy/50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            badge="Process"
            title={t("process.title")}
            subtitle={t("process.subtitle")}
          />

          {/* Desktop: horizontal pipeline */}
          <div className="hidden lg:flex items-center justify-center gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="group relative flex flex-col items-center text-center w-40">
                  {/* Circle with icon */}
                  <div className="relative w-16 h-16 rounded-full glass border-glow flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow-accent transition-all duration-500">
                    <svg className="w-7 h-7 text-somy-accent-light group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                    <div className="absolute inset-0 rounded-full bg-somy-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Step number */}
                  <span className="text-[10px] font-mono text-somy-accent/60 mb-1 tracking-widest">{`0${i + 1}`}</span>

                  {/* Label */}
                  <h3 className="font-display text-sm font-bold group-hover:text-somy-accent-light transition-colors duration-300">{step.label}</h3>
                </div>
                <ProcessConnector hidden={i === PROCESS_STEPS.length - 1} />
              </div>
            ))}
          </div>

          {/* Mobile: vertical pipeline */}
          <div className="lg:hidden space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full glass border-glow flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-somy-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="w-[2px] h-12 bg-gradient-to-b from-somy-accent/30 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="pt-2 pb-6">
                  <span className="text-[10px] font-mono text-somy-accent/60 tracking-widest">{`0${i + 1}`}</span>
                  <h3 className="font-display text-lg font-bold">{step.label}</h3>
                  <p className="text-sm text-gray-400 mt-1">{t(`process.steps.${i}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Portfolio ─── */}
      <section id="portfolio" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('/bg/download.jpg')" }} />
        <div className="absolute inset-0 bg-somy-purple/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/70 via-somy-navy/40 to-somy-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-somy-navy/50 via-transparent to-somy-navy/50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            badge="Portfolio"
            title={t("portfolio.title")}
            subtitle={t("portfolio.subtitle")}
          />

          <div className="grid md:grid-cols-3 gap-6">
            {portfolio.map((item, idx) => (
              <Link
                key={item.id}
                to={`/portfolio/${item.slug}`}
                className="group relative rounded-2xl overflow-hidden glass card-hover border-glow"
              >
                {/* Image area with gradient overlay */}
                <div className="h-48 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    idx === 0 ? "from-somy-accent/20 to-somy-purple/20" :
                    idx === 1 ? "from-somy-purple/20 to-somy-cyan/20" :
                    "from-somy-cyan/20 to-somy-accent/20"
                  } group-hover:scale-110 transition-transform duration-700`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-display font-bold text-white/5 group-hover:text-white/10 transition-all duration-500 group-hover:scale-125">
                      {item.title.charAt(0)}
                    </span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-somy-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-sm font-medium text-white border border-white/20">
                      {t("portfolio.viewProject")}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg font-bold mb-2 group-hover:text-somy-accent-light transition-colors duration-300">{item.title}</h3>
                  {item.client && <p className="text-xs text-gray-500 mb-3">{t("portfolio.client")}: {item.client}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {item.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 font-mono">{tech}</span>
                    ))}
                    {item.techStack.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-somy-accent/10 text-somy-accent-light font-mono">+{item.techStack.length - 4}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('/bg/code-editor.jpg')" }} />
        <div className="absolute inset-0 bg-somy-purple/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/70 via-somy-navy/40 to-somy-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-somy-navy/50 via-transparent to-somy-navy/50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            badge="Testimonials"
            title={t("testimonials.title")}
            subtitle={t("testimonials.subtitle")}
          />

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.id} className="group glass rounded-2xl p-8 border-glow card-hover relative">
                {/* Quote mark */}
                <div className="absolute top-6 right-6 text-4xl font-display text-somy-accent/10 group-hover:text-somy-accent/20 transition-colors duration-300">&ldquo;</div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < item.rating ? "text-somy-gold" : "text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed mb-6 text-sm italic">&ldquo;{item.message}&rdquo;</p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-somy-accent to-somy-purple flex items-center justify-center text-sm font-bold text-white">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('/bg/details.jpg')" }} />
        <div className="absolute inset-0 bg-somy-accent/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/70 via-somy-navy/40 to-somy-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-somy-navy/50 via-transparent to-somy-navy/50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            badge="Pricing"
            title={t("pricing.title")}
            subtitle={t("pricing.subtitle")}
          />

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
            {[0, 1, 2].map((i) => {
              const plan = t(`pricing.plans.${i}`);
              const isPopular = i === 1;
              return (
                <div
                  key={i}
                  className={`relative rounded-2xl p-8 transition-all duration-500 ${
                    isPopular
                      ? "glass-strong border-2 border-somy-accent/30 shadow-glow-accent md:-mt-4 md:mb-4"
                      : "glass border-glow card-hover"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-somy-accent to-somy-purple text-[10px] font-bold tracking-wider uppercase text-white shadow-glow-accent">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{plan.desc}</p>

                  <div className="mb-8">
                    <span className={`text-4xl font-display font-bold ${isPopular ? "text-gradient" : ""}`}>{plan.price}</span>
                    <span className="text-sm text-gray-500 ml-2">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-somy-mint/10 flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-somy-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => scrollTo("contact")}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isPopular
                        ? "bg-gradient-to-r from-somy-accent to-somy-purple text-white hover:shadow-glow-accent hover:scale-[1.02]"
                        : "glass-light text-white hover:bg-white/10 hover:border-somy-accent/20"
                    }`}
                  >
                    {t("pricing.cta")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Why SOMY ─── */}
      <section id="why" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('/bg/team.jpg')" }} />
        <div className="absolute inset-0 bg-somy-cyan/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/70 via-somy-navy/40 to-somy-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-somy-navy/50 via-transparent to-somy-navy/50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            badge="Why SOMY"
            title={t("why.title")}
            subtitle="Four founders. Zero bureaucracy. Pure engineering."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => {
              const icons = [
                "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
                "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0V6a3 3 0 013-3h1.5a3 3 0 013 3v3.349",
                "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h3.75m0 0V5.625m0 8.625H3.375m17.25 0h-3.75m0 0V5.625m0 8.625h3.75",
              ];
              return (
                <div key={i} className="group glass rounded-2xl p-8 border-glow card-hover relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-somy-accent/5 to-transparent rounded-full group-hover:from-somy-accent/10 transition-all duration-700" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-somy-accent/20 to-somy-purple/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-6 h-6 text-somy-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icons[i]} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-2 group-hover:text-somy-accent-light transition-colors duration-300">
                        {t(`why.items.${i}.title`)}
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-sm">{t(`why.items.${i}.desc`)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Contact ─── */}
      <section id="contact" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('/bg/server.jpg')" }} />
        <div className="absolute inset-0 bg-somy-accent/5 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-somy-navy/70 via-somy-navy/40 to-somy-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-somy-navy/50 via-transparent to-somy-navy/50" />

        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-somy-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-somy-purple/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <SectionTitle
            badge="Contact"
            title={t("contact.title")}
            subtitle={t("contact.subtitle")}
          />

          {submitted ? (
            <div className="glass-strong rounded-2xl p-12 border-glow text-center">
              <div className="w-16 h-16 rounded-full bg-somy-mint/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-somy-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{t("contact.success")}</h3>
              <p className="text-gray-400">{t("contact.successMsg")}</p>
            </div>
          ) : !user ? (
            <div className="glass-strong rounded-2xl p-10 md:p-12 border-glow text-center">
              <div className="w-16 h-16 rounded-full bg-somy-accent/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-somy-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Sign in to start a project</h3>
              <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
                Please sign in with your Google account to access the contact form and start collaborating with us.
              </p>
              <div className="flex justify-center">
                <div ref={googleBtnRef} />
                {!window.google && (
                  <button className="px-8 py-3 rounded-xl bg-white text-gray-700 font-medium text-sm">
                    Google Sign-In (add VITE_GOOGLE_CLIENT_ID to .env)
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-6">
                We use your Google account to keep your projects secure and organized.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 md:p-10 border-glow space-y-6">
              <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-somy-accent to-somy-purple flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t("contact.name")}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-somy-navy/80 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent/50 focus:ring-1 focus:ring-somy-accent/20 transition-all duration-300"
                    placeholder={t("contact.placeholder.name")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t("contact.email")}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-somy-navy/80 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent/50 focus:ring-1 focus:ring-somy-accent/20 transition-all duration-300"
                    placeholder={t("contact.placeholder.email")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t("contact.message")}</label>
                <textarea
                  required
                  minLength={10}
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-somy-navy/80 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent/50 focus:ring-1 focus:ring-somy-accent/20 transition-all duration-300 resize-none"
                  placeholder={t("contact.placeholder.message")}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-somy-accent to-somy-purple text-white font-semibold text-base transition-all duration-300 hover:shadow-glow-accent-lg hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("contact.sending")}
                  </span>
                ) : t("contact.send")}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative border-t border-white/5">
        <div className="absolute inset-0 bg-somy-midnight/50" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <img src="/logo.png" alt="SOMY" className="h-8 w-auto mb-4" />
              <p className="text-sm text-gray-500 leading-relaxed">
                Software engineering studio building across web, mobile, and desktop.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wider uppercase">Services</h4>
              <ul className="space-y-2.5">
                {["web", "mobile", "desktop"].map((s) => (
                  <li key={s}>
                    <button onClick={() => scrollTo("services")} className="text-sm text-gray-500 hover:text-somy-accent-light transition-colors duration-300">
                      {t(`services.${s}.title`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wider uppercase">Company</h4>
              <ul className="space-y-2.5">
                {["process", "portfolio", "pricing", "contact"].map((id) => (
                  <li key={id}>
                    <button onClick={() => scrollTo(id)} className="text-sm text-gray-500 hover:text-somy-accent-light transition-colors duration-300">
                      {t(`nav.${id}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-sm font-bold text-white mb-4 tracking-wider uppercase">Connect</h4>
              <ul className="space-y-2.5">
                <li><Link to="/blog" className="text-sm text-gray-500 hover:text-somy-accent-light transition-colors duration-300">{t("nav.blog")}</Link></li>
                <li><Link to="/login" className="text-sm text-gray-500 hover:text-somy-accent-light transition-colors duration-300">{t("nav.signIn")}</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex items-center justify-center">
            <span className="text-xs text-gray-600">© {new Date().getFullYear()} SOMY IT Consulting. {t("footer.copyright")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
