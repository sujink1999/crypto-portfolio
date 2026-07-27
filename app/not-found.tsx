import type { Metadata } from "next";
import WrongDoor from "@/components/WrongDoor";

export const metadata: Metadata = {
  title: "Wrong door",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <WrongDoor />;
}
