"use client";

import React, { useEffect, useRef } from "react";
import styles from "./ScrollingBanner.module.css";

function HorizontalScrollText() {
  const textRef = useRef<HTMLDivElement | null>(null);
  const previousScrollY = useRef<number | null>(null);
  const previousDirection = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (textRef.current) {
        const scrollSpeed = 2;
        let currentScrollY = window.scrollY;
        let direction;

        if (previousScrollY.current !== null) {
          direction = currentScrollY > previousScrollY.current ? -1 : 1;

          if (previousDirection.current == -1 && direction == 1) {
            currentScrollY = 0;
          }
          console.info({
            currentScrollY,
            previousScrollY: previousScrollY.current,
          });
          textRef.current.style.transform = `translateX(${direction * currentScrollY * scrollSpeed}px)`;
        }

        previousScrollY.current = currentScrollY;
        previousDirection.current = direction!;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <p ref={textRef} className={styles.scrollableText}>
        Your scrolling text here. Your scrolling text here. Your scrolling text
        here. Your scrolling text here. Your scrolling text here. Your scrolling
        text here. Your scrolling text here. Your scrolling text here. Your
        scrolling text here. Your scrolling text here. Your scrolling text here.
        Your scrolling text here. Your scrolling text here. Your scrolling text
        here. Your scrolling text here. Your scrolling text here. Your scrolling
        text here. Your scrolling text here. Your scrolling text here. Your
        scrolling text here. Your scrolling text here. Your scrolling text here.
        Your scrolling text here. Your scrolling text here. Your scrolling text
        here. Your scrolling text here. Your scrolling text here. Your scrolling
        text here. Your scrolling text here. Your scrolling text here. Your
        scrolling text here. Your scrolling text here. Your scrolling text here.
        Your scrolling text here. Your scrolling text here. Your scrolling text
        here. Your scrolling text here. Your scrolling text here. Your scrolling
        text here. Your scrolling text here. Your scrolling text here. Your
        scrolling text here. Your scrolling text here. Your scrolling text here.
        Your scrolling text here. Your scrolling text here. Your scrolling text
        here. Your scrolling text here. Your scrolling text here. Your scrolling
        text here. Your scrolling text here. Your scrolling text here. Your
        scrolling text here. Your scrolling text here. Your scrolling text here.
        Your scrolling text here. Your scrolling text here. Your scrolling text
        here. Your scrolling text here. Your scrolling text here. Your scrolling
        text here. Your scrolling text here. Your scrolling text here. Your
        scrolling text here. Your scrolling text here. Your scrolling text here.
        Your scrolling text here. Your scrolling text here. Your scrolling text
        here. Your scrolling text here. Your scrolling text here. Your scrolling
        text here.
      </p>
    </div>
  );
}

export default HorizontalScrollText;
