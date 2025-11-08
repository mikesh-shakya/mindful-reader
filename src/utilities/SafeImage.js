"use client";

import Image from "next/image";
import { useState, useMemo } from "react";

export default function SafeImage({
  src,
  fallbackSrc,
  alt,
  width,
  height,
  className = "",
  unoptimized = true,
}) {
  // 🧩 Detect invalid or mock URLs (like example.com)
  const isMockUrl = useMemo(() => {
    if (!src) return true;
    try {
      const url = new URL(src);
      // Add more mock domains here if needed
      return url.hostname === "example.com";
    } catch {
      return true;
    }
  }, [src]);

  // Initial source — fallback immediately if mock
  const [imgSrc, setImgSrc] = useState(isMockUrl ? fallbackSrc : src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
      unoptimized={unoptimized}
    />
  );
}
