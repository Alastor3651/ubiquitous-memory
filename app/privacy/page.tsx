export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-sm">
      <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
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

      <p>
        This Privacy Policy explains what information FundingPortal (&quot;we&quot;, &quot;us&quot;)
        collects when you use this site, how we use it, and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Account information: your name, email address, and phone number.</li>
        <li>
          Application information: the details you submit in a funding application, including
          location, requested amount, and purpose of funding.
        </li>
        <li>Documents you choose to upload in support of an application.</li>
        <li>Basic technical data such as login timestamps, used to keep your account secure.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To create and secure your account.</li>
        <li>To process, review, and communicate with you about your application.</li>
        <li>To maintain records required for auditing and compliance.</li>
      </ul>

      <h2>How we protect your information</h2>
      <p>
        Passwords are hashed and never stored in plain text. Uploaded documents are stored in a
        private storage bucket and are only accessible to you and authorized reviewers. Access to
        application data is restricted to the applicant and administrators.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain application data for as long as your account is active or as needed to comply
        with legal obligations. You may request deletion of your account and associated data by
        contacting an administrator.
      </p>

      <h2>Your choices</h2>
      <p>
        You may review, update, or request deletion of your personal information at any time by
        contacting us.
      </p>

      <h2>Contact</h2>
      <p>Questions about this policy can be directed to the site administrator.</p>
    </div>
  );
}
