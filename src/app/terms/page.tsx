import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Brett Lechtenberg",
  description: "Terms of Service for Brett Lechtenberg's coaching, speaking, and consulting services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-black mb-4">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last Updated: April 4, 2026</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to Brett Lechtenberg&apos;s website and services. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website brettlechtenberg.com (&quot;Website&quot;) and all related services, including coaching, speaking, consulting, and training services (&quot;Services&quot;) provided by Brett Lechtenberg (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                </p>
                <p className="text-gray-700 mb-4">
                  By accessing our Website or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Website or Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">2. Services Description</h2>
                <p className="text-gray-700 mb-4">We provide the following services:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li><strong>Peak Performance Coaching:</strong> One-on-one and group coaching sessions</li>
                  <li><strong>Speaking & Training:</strong> Keynote presentations, workshops, and corporate training</li>
                  <li><strong>AI Advisory:</strong> Strategic AI implementation consulting through Total Success AI</li>
                  <li><strong>The Master&apos;s Edge Methodology:</strong> Proprietary peak performance systems and training</li>
                  <li><strong>Books & Educational Materials:</strong> Publications and digital resources</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">3. User Responsibilities</h2>
                <p className="text-gray-700 mb-4">By using our Website and Services, you agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Provide accurate and complete information when required</li>
                  <li>Maintain the confidentiality of any account credentials</li>
                  <li>Use our Services only for lawful purposes</li>
                  <li>Not reproduce, distribute, or create derivative works without permission</li>
                  <li>Not interfere with or disrupt our Website or Services</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">4. Coaching and Consulting Services</h2>
                <h3 className="text-xl font-semibold text-black mb-3">Nature of Services</h3>
                <p className="text-gray-700 mb-4">
                  Our coaching and consulting services are designed to provide guidance, strategies, and support for personal and professional development. These services are educational and informational in nature and do not constitute therapy, medical advice, legal advice, or financial advice.
                </p>

                <h3 className="text-xl font-semibold text-black mb-3">Client Responsibility</h3>
                <p className="text-gray-700 mb-4">
                  You are solely responsible for your own decisions, actions, and results. The effectiveness of our Services depends on your active participation, effort, and implementation of the strategies and techniques discussed.
                </p>

                <h3 className="text-xl font-semibold text-black mb-3">No Guarantees</h3>
                <p className="text-gray-700 mb-4">
                  While we strive to provide valuable insights and strategies, we do not guarantee specific outcomes or results. Individual results vary based on numerous factors including personal effort, circumstances, and market conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">5. Payment Terms</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>All fees for Services are due as specified in your service agreement or at the time of booking</li>
                  <li>Prices are subject to change without notice, but changes will not affect existing agreements</li>
                  <li>All payments are non-refundable unless otherwise specified in writing</li>
                  <li>We accept major credit cards and other payment methods as indicated at checkout</li>
                  <li>You are responsible for any applicable taxes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">6. Cancellation and Rescheduling</h2>
                <h3 className="text-xl font-semibold text-black mb-3">Coaching Sessions</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Cancellations must be made at least 24 hours before the scheduled session</li>
                  <li>Sessions cancelled with less than 24 hours notice may be forfeited or charged in full</li>
                  <li>Rescheduling requests are subject to availability</li>
                </ul>

                <h3 className="text-xl font-semibold text-black mb-3">Speaking Engagements</h3>
                <p className="text-gray-700 mb-4">
                  Cancellation terms for speaking engagements are outlined in individual service agreements. Generally, cancellations within 30 days of the event may result in partial or full payment of the agreed fee.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on our Website and in our Services, including but not limited to text, graphics, logos, images, audio, video, The Master&apos;s Edge methodology, and other materials, is the property of Brett Lechtenberg and is protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 mb-4">You may not:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Copy, reproduce, or distribute our content without written permission</li>
                  <li>Modify or create derivative works based on our content</li>
                  <li>Use our trademarks or branding without authorization</li>
                  <li>Record coaching sessions or training without express consent</li>
                  <li>Share proprietary materials with third parties</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">8. Confidentiality</h2>
                <p className="text-gray-700 mb-4">
                  We respect the confidentiality of information shared during coaching sessions and consulting engagements. We will not disclose your personal information to third parties without your consent, except as required by law.
                </p>
                <p className="text-gray-700 mb-4">
                  Similarly, you agree to keep confidential any proprietary methods, strategies, or materials shared with you during our Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">9. Testimonials and Success Stories</h2>
                <p className="text-gray-700 mb-4">
                  Testimonials and success stories displayed on our Website represent individual experiences and results. They are not intended to represent or guarantee that current or future clients will achieve the same or similar results.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">10. Disclaimer of Warranties</h2>
                <p className="text-gray-700 mb-4">
                  OUR WEBSITE AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-gray-700 mb-4">
                  We do not warrant that our Website will be uninterrupted, error-free, or free of viruses or other harmful components.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  TO THE FULLEST EXTENT PERMITTED BY LAW, BRETT LECHTENBERG SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                  <li>Your use or inability to use our Website or Services</li>
                  <li>Any conduct or content of any third party</li>
                  <li>Unauthorized access, use, or alteration of your content</li>
                  <li>Any decisions or actions you take based on information from our Services</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  Our total liability for any claims arising from these Terms or your use of our Services shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">12. Indemnification</h2>
                <p className="text-gray-700 mb-4">
                  You agree to indemnify, defend, and hold harmless Brett Lechtenberg and our affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys&apos; fees) arising out of or related to your use of our Website or Services, your violation of these Terms, or your violation of any rights of another.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">13. Governing Law and Dispute Resolution</h2>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Utah, United States, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700 mb-4">
                  Any dispute arising from these Terms or your use of our Services shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, the dispute shall be resolved through binding arbitration in Salt Lake County, Utah, in accordance with the rules of the American Arbitration Association.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">14. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on our Website and updating the &quot;Last Updated&quot; date. Your continued use of our Website or Services after any changes indicates your acceptance of the updated Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">15. Severability</h2>
                <p className="text-gray-700 mb-4">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">16. Entire Agreement</h2>
                <p className="text-gray-700 mb-4">
                  These Terms, together with our Privacy Policy and any service agreements you enter into with us, constitute the entire agreement between you and Brett Lechtenberg regarding your use of our Website and Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">17. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms, please contact us:
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
