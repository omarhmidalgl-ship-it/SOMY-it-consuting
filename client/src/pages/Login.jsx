import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, user } = useAuthStore();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "filled_black",
        size: "large",
        width: "100%",
        text: "continue_with",
        shape: "rectangular",
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(response.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-somy-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="SOMY" className="h-14 w-auto" />
        </Link>

        <div className="bg-somy-surface rounded-2xl p-8 border border-white/5">
          <h1 className="font-display text-2xl font-bold text-center mb-2">Welcome</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Sign in to access the dashboard</p>

          {error && (
            <div className="bg-somy-coral/10 border border-somy-coral/30 rounded-lg px-4 py-3 mb-6 text-sm text-somy-coral">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <div className="mb-6">
            <div ref={googleBtnRef} className="w-full" />
            {!window.google && (
              <div className="w-full py-3 rounded-lg bg-white text-gray-700 font-medium text-center text-sm border border-gray-300">
                Google Sign-In (add VITE_GOOGLE_CLIENT_ID to .env)
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email / Password — Staff */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent transition"
                placeholder="partner@somy.dev"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-somy-navy border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-somy-accent transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-somy-accent hover:bg-somy-accent-light transition font-semibold disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
