// Ported from beans-ui src/components/Trade/FlyingBeans.js.
// Renders the transient bean sprites returned by useFlyingBeans in a
// viewport-fixed overlay (positions are getBoundingClientRect-based).

"use client";

import { BeanWithCoin, DeadBean } from "./svgs";
import {
  FLYING_BEANS_ANIMATION_DURATION,
  type FlyingBean,
} from "./useFlyingBeans";
import styles from "./beans.module.css";

const FlyingBeans = ({ flyingBeans }: { flyingBeans: FlyingBean[] }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2]">
      {flyingBeans.map((flyingBean) => {
        const { top, left } = flyingBean;
        return (
          <div
            key={flyingBean.id}
            style={
              {
                animationDuration: `${FLYING_BEANS_ANIMATION_DURATION}ms`,
                top,
                left,
                "--random-x": `${flyingBean.randomX}%`,
              } as React.CSSProperties
            }
            className={flyingBean.isPositive ? styles.droppingBean : styles.flyingBean}
          >
            {flyingBean.isPositive ? (
              <BeanWithCoin className="w-6" />
            ) : (
              <DeadBean className="w-8" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FlyingBeans;
