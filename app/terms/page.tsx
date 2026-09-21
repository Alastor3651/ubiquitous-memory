export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-sm">
      <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="not-prose rounded-md border border-amber-300 bg-amber-50 px-4 py-3 my-4">
        <p className="text-sm font-semibold text-amber-800">
          ⚠ Template — not legal advice
        </p>
        <p className="text-sm text-amber-800 mt-1">
          This page is a starting-point template only. It has not been reviewed by a lawyer
          and must not be relied on as-is. Have it reviewed by a qualified legal professional
          for your jurisdiction and use case before publishing it to real applicants.
        </p>
      </div>

      <p>These Terms of Service govern your use of FundingPortal.</p>

      <h2>Eligibility</h2>
      <p>
        You must provide accurate and complete information when creating an account and
        submitting an application. Submitting false or misleading information may result in
        rejection of your application or termination of your account.
      </p>

      <h2>No guarantee of funding</h2>
      <p>
        Submitting an application does not guarantee approval or funding. Decisions are made at
        the sole discretion of the reviewing organization.
      </p>

      <h2>Account responsibility</h2>
      <p>
        You are responsible for maintaining the confidentiality of your password and for all
        activity under your account.
      </p>

      <h2>Acceptable use</h2>
      <p>
        You agree not to misuse this site, including attempting to access another user&apos;s
        application, uploading malicious files, or submitting fraudulent information.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.</p>

      <h2>Contact</h2>
      <p>Questions about these terms can be directed to the site administrator.</p>
    </div>
  );
}
