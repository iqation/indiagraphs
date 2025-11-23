import IGHeader from "../components/IGHeader";
import IGFooter from "../components/IGFooter";
import Link from "next/link";
import { Mail, Phone, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Us | Indiagraphs",
  description:
    "Get in touch with Indiagraphs for business inquiries, data partnerships, and support.",
};

export default function ContactPage() {
  return (
    <>
      <IGHeader />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center">
            Contact Us
          </h1>

          <p className="text-slate-600 text-center mt-3 text-sm sm:text-base max-w-xl mx-auto">
            We’re here to help with data requests, partnerships, or general
            questions.
          </p>

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8 mt-10 space-y-6">

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Mail className="text-indigo-600" size={22} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Email us at</p>
                <a
                  href="mailto:contact@indiagraphs.com"
                  className="font-semibold text-indigo-700 text-base hover:underline"
                >
                  contact@indiagraphs.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Phone className="text-indigo-600" size={22} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Call or Sms</p>
                <a
                  href="tel:+919120031556"
                  className="font-semibold text-indigo-700 text-base hover:underline"
                >
                  +91 91200 31556
                </a>
              </div>
            </div>

            {/* LinkedIn Contact */}
<div className="flex items-center gap-4">
  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
    <MessageSquare className="text-indigo-600" size={22} />
  </div>
  <div>
    <p className="text-slate-500 text-sm">Connect on LinkedIn</p>
    <a
      href="https://www.linkedin.com/company/indiagraphs/"
      target="_blank"
      className="font-semibold text-indigo-700 text-base hover:underline"
    >
      Message us on LinkedIn →
    </a>
  </div>
</div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-slate-500 mt-8 text-xs sm:text-sm">
            Our team usually replies within 24 hours.
          </p>
        </div>
      </main>

      <IGFooter />
    </>
  );
}