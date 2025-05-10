"use client";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useRef, useState } from "react";
import twemoji from "twemoji";
import * as emoji from "node-emoji";
import { debounce } from "lodash";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .twemoji {
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
  }
`;

interface TwemojiWrapperProps {
  children: React.ReactNode;
}

export default function TwemojiWrapper({ children }: TwemojiWrapperProps) {
  const isParsing = useRef<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  const parseEmojis = debounce(() => {
    if (isParsing.current || !isMounted) return;
    isParsing.current = true;

    try {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );
      const nodes: Node[] = [];
      let node: Node | null;

      while ((node = walker.nextNode())) {
        if (node.textContent?.trim()) {
          nodes.push(node);
        }
      }

      nodes.forEach((node) => {
        if (node.textContent) {
          node.textContent = emoji.emojify(node.textContent);
        }
      });

      twemoji.parse(document.body, {
        folder: "svg",
        ext: ".svg",
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/",
        className: "twemoji",
        attributes: () => ({}),
      });
    } finally {
      isParsing.current = false;
    }
  }, 100);

  useEffect(() => {
    // Mark component as mounted to ensure parsing only happens after hydration
    setIsMounted(true);

    parseEmojis();

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      if (mutations.some((m) => m.addedNodes.length || m.removedNodes.length)) {
        parseEmojis();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      parseEmojis.cancel();
    };
  }, [parseEmojis]);

  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
}
