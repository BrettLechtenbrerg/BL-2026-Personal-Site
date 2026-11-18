"use client";

//==============================================================================
// Comms Hub — "Text from my phone" (Brett, 18 Nov 2026)
//==============================================================================
// No texting service yet (Telnyx comes later; never GoHighLevel or Twilio).
// Each selected lead gets a Text button that opens Messages on the iPhone or
// Mac with their number and the message (merge tags filled in). Brett presses
// Send on the phone, one person at a time, so it goes from his own number.
//==============================================================================

import { useState, useSyncExternalStore } from "react";
import { CheckCircle2, MessageSquare, Phone } from "lucide-react";
import { renderMessage, mergeVarsForLead } from "@/lib/messaging-render";
import { isApple, showPhone, smsHref, telHref, usPhone } from "@/lib/messaging/text-link";

export interface TapLead {
  contact_id: string;
  first_name: string;
  last_name: string;
  name: string;
  phone: string | null;
}

/** Most people listed at once: these are personal texts, sent one by one. */
const MAX_LISTED = 25;
const noSubscribe = () => () => {};

export default function TapToText({ leads, body, marketing }: { leads: TapLead[]; body: string; marketing: boolean }) {
  const apple = useSyncExternalStore(noSubscribe, () => isApple(navigator.userAgent), () => true);
  const [opened, setOpened] = useState<Set<string>>(new Set());

  if (marketing) {
    return (
      <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
        Marketing texts wait for the texting service, which checks each person&apos;s consent. Untick
        &ldquo;marketing&rdquo; to send a personal text from your phone.
      </p>
    );
  }
  if (!leads.length || !body.trim()) {
    return (
      <p className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-600">
        Pick people on the left and write the message. Each person then gets a Text button that opens
        Messages on your iPhone or Mac with the message filled in. You press Send.
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <p className="text-sm font-medium text-gray-900 inline-flex items-center gap-2">
        <MessageSquare className="w-4 h-4" /> Text from my phone
      </p>
      <p className="text-[11px] text-gray-500 mt-0.5 mb-2">
        Opens Messages on your iPhone or Mac. Press Send there, then come back for the next person.
      </p>
      <ul className="space-y-1.5 max-h-80 overflow-y-auto">
        {leads.slice(0, MAX_LISTED).map((l) => {
          const phone = usPhone(l.phone ?? "");
          const done = opened.has(l.contact_id);
          return (
            <li key={l.contact_id} className="flex items-center gap-2 text-sm">
              <span className="min-w-0 flex-1 truncate">
                {done && <CheckCircle2 className="inline w-4 h-4 text-emerald-600 -mt-0.5 mr-1" aria-label="Opened" />}
                <span className="font-medium text-gray-900">{l.name}</span>
                <span className="text-gray-500"> · {phone ? showPhone(phone) : "no US mobile number"}</span>
              </span>
              {phone && (
                <>
                  <a
                    href={smsHref(phone, renderMessage(body, mergeVarsForLead(l)), apple)}
                    onClick={() => setOpened((s) => new Set(s).add(l.contact_id))}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9B1B30] text-white text-xs font-medium hover:bg-[#7A1526]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Text {l.first_name || l.name.split(" ")[0]}
                  </a>
                  <a href={telHref(phone)} title={`Call ${l.name}`} aria-label={`Call ${l.name}`} className="shrink-0 p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </>
              )}
            </li>
          );
        })}
      </ul>
      {leads.length > MAX_LISTED && (
        <p className="text-[11px] text-amber-700 mt-2">
          Showing the first {MAX_LISTED} of {leads.length}. Personal texts go one at a time; group texts wait for the texting service.
        </p>
      )}
    </div>
  );
}
