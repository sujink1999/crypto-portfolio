"use client";

import { useState } from "react";
import HomeScreen from "@/components/showcase/society/HomeScreen";
import StreakDetail from "@/components/showcase/society/StreakDetail";

/** Society mobile app, frameless - StoryOpening supplies the phone shell. */
export default function SocietyDemo() {
  const [streakOpen, setStreakOpen] = useState(false);
  return (
    <div className="relative h-full w-full">
      <HomeScreen onOpenStreak={() => setStreakOpen(true)} />
    <StreakDetail visible={streakOpen} onDismiss={() => setStreakOpen(false)} />
    </div>
  );
}
