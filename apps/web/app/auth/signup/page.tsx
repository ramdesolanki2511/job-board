"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";
import styles from "./page.module.css";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signup(firstName, lastName, email, password);
      router.push("/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Join RemoteLaunch</h1>
          <p>Create your account and start exploring remote jobs</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                disabled={loading}
                className={styles.input}
              />
            </div>
          </div>

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
            <p className={styles.hint}>At least 8 characters</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className={styles.input}
            />
          </div>

          <div className={styles.termsCheckbox}>
            <input id="terms" type="checkbox" required disabled={loading} />
            <label htmlFor="terms">
              I agree to the <Link href="/terms">Terms of Service</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>Already have an account?</span>
        </div>

        <Link href="/auth/login" className={styles.loginLink}>
          Sign in instead
        </Link>

        <div className={styles.footer}>
          <Link href="/jobs" className={styles.backToJobs}>
            ← Back to Browse Jobs
          </Link>
        </div>
      </div>

      <div className={styles.imageSection}>
        <div className={styles.imagePlaceholder}>
          <h2>Start Your Remote Journey</h2>
          <p>Discover remote opportunities tailored for your skills and goals</p>
        </div>
      </div>
    </main>
  );
}
