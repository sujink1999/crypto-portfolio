import Image from "next/image";
import styles from "./society.module.css";
import { CHARACTER_IMAGE_INDEX } from "./data";

export default function CharacterStateSection() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <div className={styles.float}>
        <Image
          src={`/showcase/society/character/${CHARACTER_IMAGE_INDEX}.png`}
          alt="Character state"
          width={200}
          height={200}
          style={{ objectFit: "contain", width: 200, height: 200 }}
          priority
        />
      </div>
    </div>
  );
}
