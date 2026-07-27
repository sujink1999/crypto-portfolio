import HomeHeader from "./HomeHeader";
import DateSelectorWidget from "./DateSelectorWidget";
import CharacterStateSection from "./CharacterStateSection";
import BeaconWidget from "./BeaconWidget";
import DaytimeTasksWidget from "./DaytimeTasksWidget";
import styles from "./society.module.css";

export default function HomeScreen({
  onOpenStreak,
}: {
  onOpenStreak: () => void;
}) {
  return (
    <div
      className={styles.noScroll}
      style={{
        flex: 1,
        height: "100%",
        backgroundColor: "#000000",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div style={{ paddingBottom: 96 }}>
        {/* Status-bar breathing room (translucent) */}
        <div style={{ height: 44 }} />
        <HomeHeader onOpenStreak={onOpenStreak} />
        <div style={{ height: 16 }} />
        <DateSelectorWidget />
        <div style={{ height: 40 }} />
        <CharacterStateSection />
        <div style={{ height: 40 }} />
        <BeaconWidget />
        <DaytimeTasksWidget />
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
