"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-brand-700">
          FundingPortal
        </Link>

        <button
          className="sm:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        <div className="hidden sm:flex items-center gap-4">
          <NavLinks session={session} status={status} />
        </div>
      </nav>

      {open && (
        <div className="sm:hidden border-t border-gray-200 px-4 py-3 flex flex-col gap-3">
          <NavLinks session={session} status={status} mobile />
        </div>
      )}
    </header>
  );
}

function NavLinks({
  session,
  status,
  mobile,
}: {
  session: any;
  status: string;
  mobile?: boolean;
}) {
  const linkClass = mobile
    ? "text-sm font-medium text-gray-700"
    : "text-sm font-medium text-gray-700 hover:text-brand-600";

  if (status === "loading") return null;

  if (!session) {
    return (
      <>
        <Link href="/login" className={linkClass}>
          Log in
        </Link>
        <Link href="/register" className="btn-primary">
          Get started
        </Link>
      </>
    );
  }

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <>
      <Link href="/dashboard" className={linkClass}>
        Dashboard
      </Link>
      <Link href="/apply" className={linkClass}>
        New application
      </Link>
      {isAdmin && (
        <Link href="/admin" className={linkClass}>
          Admin
        </Link>
      )}
      <span className="text-sm text-gray-500 hidden sm:inline">
        {session.user?.name}
      </span>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary">
        Log out
      </button>
    </>
  );
}
