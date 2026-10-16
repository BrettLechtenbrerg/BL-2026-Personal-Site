//==============================================================================
// Academy — SITE-OWNED extra top-menu links (seeded once by the Academy Forge
// installer, never overwritten). Shown after the modules link, members only.
// Runs in the browser: import icons and plain data only.
//==============================================================================
// Example:
//   import { Handshake } from "lucide-react";
//   export const extraNavLinks: ExtraNavLink[] = [
//     { href: "/academy/partners", label: "Partners", labelEs: "Socios", icon: Handshake,
//       activePrefixes: ["/academy/programs/"] },
//   ];
// activePrefixes: other paths that light this link up (a prefix claimed here
// no longer lights up the modules link).
//==============================================================================

import type { ExtraNavLink } from "@/components/academy/AcademyNav";

export const extraNavLinks: ExtraNavLink[] = [];
