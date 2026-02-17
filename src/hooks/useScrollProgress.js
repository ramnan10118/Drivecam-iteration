import { useState, useEffect, useCallback } from 'react';

export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const h = ref.current.offsetHeight - window.innerHeight;
    if (h <= 0) { setProgress(0); return; }
    setProgress(Math.min(1, Math.max(0, -r.top / h)));
  }, [ref]);

  useEffect(() => {
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [update]);

  return progress;
}

export function clamp01(t) { return Math.min(1, Math.max(0, t)); }
export function easeInCubic(t) { return t * t * t; }
export function easeInQuad(t) { return t * t; }
export function remap(value, inMin, inMax) {
  return clamp01((value - inMin) / (inMax - inMin));
}
