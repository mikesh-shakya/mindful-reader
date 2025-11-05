import React, { useEffect, useRef } from "react";
// Simple focus trap — no external libs. Works for simple modal-like components.
// Props:
// - active: boolean to enable trap
// - onClose: function called on Escape
// - children: focusable content
export default function FocusTrap({ active, onClose, children }) {
  const containerRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    previouslyFocusedRef.current = document.activeElement;

    const node = containerRef.current;
    if (!node) return;

    // find focusable elements
    const focusableSelector = [
      "a[href]",
      "area[href]",
      "input:not([disabled]):not([type=hidden])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "object",
      "embed",
      "[tabindex]:not([tabindex='-1'])",
      "[contenteditable]",
    ].join(",");

    const focusable = Array.from(node.querySelectorAll(focusableSelector));

    if (focusable.length) {
      focusable[0].focus();
    } else {
      // fallback: focus the container so keyboard users are inside
      node.setAttribute("tabindex", "-1");
      node.focus();
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (typeof onClose === "function") onClose();
        return;
      }

      if (e.key === "Tab") {
        // re-query focusable each Tab in case DOM changed
        const list = Array.from(
          node.querySelectorAll(focusableSelector)
        ).filter(
          (el) =>
            !el.hasAttribute("disabled") && el.getAttribute("tabindex") !== "-1"
        );
        if (list.length === 0) {
          e.preventDefault();
          return;
        }
        const first = list[0];
        const last = list[list.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      if (previouslyFocusedRef.current && previouslyFocusedRef.current.focus) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [active, onClose]);

  return <div ref={containerRef}>{children}</div>;
}
