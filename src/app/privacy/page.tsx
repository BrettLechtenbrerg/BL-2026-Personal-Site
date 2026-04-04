import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Brett Lechtenberg",
  description: "Privacy Policy for Brett Lechtenberg's coaching, speaking, and consulting services.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-black mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last Updated: April 4, 2026</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Brett Lechtenberg (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website brettlechtenberg.com, use our services, or interact with us.
                </p>
                <p className="text-gray-700 mb-4">
                  By using our website or services, you consent to the practices described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-black mb-3">Personal Information You Provide</h3>
                <p className="text-gray-700 mb-4">We may collect personal information that you voluntarily provide, including:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Name, email address, phone number, and mailing address</li>
                  <li>Business information and professional details</li>
                  <li>Payment and billing information</li>
                  <li>Communications you send to us</li>
                  <li>Information provided during coaching sessions or consultations</li>
                  <li>Survey responses and feedback</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3">Automatically Collected Information</h3>
                <p className="text-gray-700 mb-4">When you visit our website, we may automatically collect:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Provide, maintain, and improve our coaching, speaking, and consulting services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you newsletters, marketing communications, and promotional materials (with your consent)</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Analyze usage patterns to improve our website and services</li>
                  <li>Protect against fraudulent or illegal activity</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our business (payment processors, email services, analytics providers)</li>
                  <li><strong>Business Partners:</strong> With your consent, we may share information with partners for joint offerings</li>
                  <li><strong>Legal Requirements:</strong> When required by law, subpoena, or other legal process</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Protection:</strong> To protect our rights, privacy, safety, or property</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings. Disabling cookies may affect your experience on our website.
                </p>
                <p className="text-gray-700 mb-4">We use the following types of cookies:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">6. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">7. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">8. Your Rights and Choices</h2>
                <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  To exercise these rights, please contact us at Brett@BrettLechtenberg.com.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">9. California Privacy Rights (CCPA)</h2>
                <p className="text-gray-700 mb-4">
                  California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">10. Children&apos;s Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">11. Third-Party Links</h2>
                <p className="text-gray-700 mb-4">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. Your continued use of our services after any changes indicates your acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">13. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-gray-100 rounded-lg p-6 text-gray-700">
                  <p className="font-semibold">Brett Lechtenberg</p>
                  <p>Email: Brett@BrettLechtenberg.com</p>
                  <p>Website: brettlechtenberg.com</p>
                  <p>Location: Sandy, Utah, USA</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
