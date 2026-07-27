"use client";

import { useState } from "react";
import PhoneFrame from "./PhoneFrame";
import HomeScreen from "./HomeScreen";
import StreakDetail from "./StreakDetail";

export default function SocietyShowcase() {
  const [streakOpen, setStreakOpen] = useState(false);

  return (
    <PhoneFrame
      overlay={
        <StreakDetail
          visible={streakOpen}
          onDismiss={() => setStreakOpen(false)}
        />
      }
    >
      <HomeScreen onOpenStreak={() => setStreakOpen(true)} />
    </PhoneFrame>
  );
}
