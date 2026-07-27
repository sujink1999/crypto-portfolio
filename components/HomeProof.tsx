"use client";

import RoleMatch from "@/components/story/RoleMatch";
import { GENERIC_REQUIREMENTS } from "@/companies/generic";
import { EVIDENCE } from "@/companies/evidence";

/** The JD chapter on the home page, wired to hand scroll back to the page
 *  scroller when the rail runs out of requirements. */
export default function HomeProof() {
  return (
    <RoleMatch
      requirements={GENERIC_REQUIREMENTS}
      evidenceMap={EVIDENCE}
      heading=""
      showAllStack
      onOverscroll={(dir) => {
        const doc = document.getElementById("home-doc");
        if (!doc) return;
        doc.scrollBy({ top: dir * doc.clientHeight, behavior: "smooth" });
      }}
    />
  );
}
