"use client";

import {
  Component,
  type ReactNode,
  type RefObject,
  useEffect,
  useState,
} from "react";

export function useVisualSupport(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
  allowReduced = false,
) {
  const [state, setState] = useState({
    capable: false,
    unavailable: false,
    visible: false,
    active: false,
    compact: false,
  });
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 760px)");
    let visible = false;
    let supported: boolean | undefined;
    function update() {
      const allowed = allowReduced || !reduced.matches;
      if (allowed && visible && supported === undefined) {
        try {
          const gl = document
            .createElement("canvas")
            .getContext("webgl2", { failIfMajorPerformanceCaveat: false });
          supported = Boolean(gl);
          gl?.getExtension("WEBGL_lose_context")?.loseContext();
        } catch {
          supported = false;
        }
      }
      setState({
        capable: allowed && Boolean(supported),
        unavailable: allowed && supported === false,
        visible,
        compact: compact.matches,
        active: visible && !document.hidden && !reduced.matches,
      });
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    compact.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      compact.removeEventListener("change", update);
    };
  }, [ref, enabled, allowReduced]);
  return state;
}

export class SceneBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
