"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Sign in to your RemoteLaunch account</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>Don't have an account?</span>
        </div>

        <Link href="/auth/signup" className={styles.signupLink}>
          Create an account
        </Link>

        <div className={styles.footer}>
          <Link href="/jobs" className={styles.backToJobs}>
            ← Back to Browse Jobs
          </Link>
        </div>
      </div>

      <div className={styles.imageSection}>
        <div className={styles.imagePlaceholder}>
          <h2>Find Your Next Remote Job</h2>
          <p>Explore thousands of opportunities from companies around the world</p>
        </div>
      </div>
    </main>
  );
}
