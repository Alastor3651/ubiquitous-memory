import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
          Apply for funding in minutes
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Create an account, complete a short application, upload your supporting
          documents, and track your status online — no phone calls required.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/register" className="btn-primary text-base px-6 py-3">
            Create an account
          </Link>
          <Link href="/login" className="btn-secondary text-base px-6 py-3">
            Log in
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 grid sm:grid-cols-3 gap-6">
        <Step
          number="1"
          title="Create your account"
          text="Sign up securely with your email and a password."
        />
        <Step
          number="2"
          title="Submit your application"
          text="Tell us about your funding need and upload supporting documents."
        />
        <Step
          number="3"
          title="Track your status"
          text="Watch your application move from Pending to a final decision from your dashboard."
        />
      </section>
    </div>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="card">
      <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold">
        {number}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{text}</p>
    </div>
  );
}
