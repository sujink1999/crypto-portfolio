// Ported from beans-ui WebsiteIconWithFallback.js + FallbackImage.js.
// Fetches the site favicon from Google; on error falls back to a black rounded
// square with the domain's first letter (offline-safe).

"use client";

import { useState } from "react";
import { concatClasses } from "./helpers";
import styles from "./beans.module.css";

const WebsiteIcon = ({
  domainName,
  size,
  fallbackClassName,
}: {
  domainName: string;
  size: number;
  fallbackClassName?: string;
}) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
        className={concatClasses([
          "bg-black rounded-md flex items-center justify-center text-xs text-white",
          fallbackClassName,
        ])}
      >
        {domainName?.[0]?.toUpperCase() || "$"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={domainName}
      style={{ width: size, height: size }}
      className={concatClasses(["rounded-md", fallbackClassName])}
      src={`https://www.google.com/s2/favicons?domain=${domainName}&sz=64`}
      onError={() => setErrored(true)}
    />
  );
};

export default WebsiteIcon;
