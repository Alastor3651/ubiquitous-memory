"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 font-medium">
            Log in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input
              type="tel"
              className="input"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
            </p>
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input
              type="password"
              className="input"
              required
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-xs text-gray-500">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
