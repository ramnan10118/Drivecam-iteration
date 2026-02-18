import { useRef, useEffect } from 'react';
import { useScrollProgress, remap } from '../hooks/useScrollProgress';
import './WideAngleVideo.css';

export default function WideAngleVideo() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);

  const clipRef = useRef(null);
  const flipCardRef = useRef(null);
  const frostedRef = useRef(null);
  const roadTextRef = useRef(null);
  const prefixRef = useRef(null);
  const badgeRef = useRef(null);
  const bracketsRef = useRef(null);
  const subRef = useRef(null);
  const cabinTextRef = useRef(null);

  useEffect(() => {
    const clip = clipRef.current;
    const flipCard = flipCardRef.current;
    const frosted = frostedRef.current;
    const roadText = roadTextRef.current;
    const prefix = prefixRef.current;
    const badge = badgeRef.current;
    const brackets = bracketsRef.current;
    const sub = subRef.current;
    const cabinText = cabinTextRef.current;
    if (!clip || !flipCard || !roadText || !prefix) return;

    /* ---- Phase 1: "2K QHD" text fades in (0.02 → 0.12) ---- */
    const textFade = remap(progress, 0.02, 0.12);
    roadText.style.opacity = progress < 0.45 ? textFade : Math.max(0, 1 - remap(progress, 0.45, 0.55));
    roadText.style.transform = `translateY(calc(-50% + ${(1 - textFade) * 20}px))`;

    /* ---- Phase 2: sides expand + "Wider" slides in (0.12 → 0.38) ---- */
    const expand = remap(progress, 0.12, 0.38);

    const startWidth = 70;
    const widthPct = startWidth + expand * (100 - startWidth);
    const borderOp = Math.max(0, 1 - expand * 3);

    clip.style.width = `${widthPct}%`;
    clip.style.borderColor = `rgba(255,255,255,${0.12 * borderOp})`;

    if (frosted) {
      frosted.style.opacity = Math.max(0, 1 - expand);
    }

    const prefixReveal = remap(progress, 0.14, 0.35);
    prefix.style.maxWidth = `${prefixReveal * 500}px`;
    prefix.style.opacity = progress < 0.45 ? prefixReveal : Math.max(0, 1 - remap(progress, 0.45, 0.55));

    if (brackets) {
      const bracketOp = Math.max(0, 1 - expand * 2.5);
      brackets.style.opacity = bracketOp;
    }

    /* ---- Phase 3: subtitle + badge fade in then out (0.38 → 0.50, out 0.45 → 0.55) ---- */
    if (sub) {
      const subIn = remap(progress, 0.38, 0.48);
      const subOut = remap(progress, 0.48, 0.55);
      sub.style.opacity = progress < 0.48 ? subIn : Math.max(0, 1 - subOut);
    }

    if (badge) {
      const badgeIn = remap(progress, 0.40, 0.48);
      const badgeOut = remap(progress, 0.48, 0.55);
      const badgeOp = progress < 0.48 ? badgeIn : Math.max(0, 1 - badgeOut);
      badge.style.opacity = badgeOp;
      badge.style.transform = `translateX(-50%) translateY(${(1 - badgeIn) * -15}px)`;
    }

    /* ---- Phase 4: flip the card (0.55 → 0.75) ---- */
    const flipProgress = remap(progress, 0.55, 0.75);
    const flipAngle = flipProgress * 180;

    // Scale pulse: peaks at 90° (mid-flip), returns to 1.0 at 0° and 180°
    const scalePulse = 1 + 0.08 * Math.sin(flipProgress * Math.PI);

    flipCard.style.transform = `rotateY(${flipAngle}deg) scale(${scalePulse})`;

    // Dynamic shadow on the clip container (not the 3D element)
    const shadowIntensity = Math.sin(flipProgress * Math.PI);
    const shadowX = Math.cos(flipProgress * Math.PI) * 40;
    clip.style.boxShadow = shadowIntensity > 0.01
      ? `${shadowX}px 0 ${60 * shadowIntensity}px rgba(0,0,0,${0.7 * shadowIntensity}),
         ${shadowX * 0.5}px 0 ${20 * shadowIntensity}px rgba(255,255,255,${0.05 * shadowIntensity})`
      : 'none';

    /* ---- Phase 5: cabin text fades in (0.78 → 0.90) ---- */
    if (cabinText) {
      const cabinFade = remap(progress, 0.78, 0.90);
      cabinText.style.opacity = cabinFade;
      cabinText.style.transform = `translateY(calc(-50% + ${(1 - cabinFade) * 20}px))`;
    }
  }, [progress]);

  return (
    <section className="fold-wideangle" ref={sectionRef}>
      <div className="fold-wideangle-sticky">

        {/* Frosted blurred background — visible on the sides */}
        <div className="wideangle-frosted" ref={frostedRef}>
          <video
            className="wideangle-video-bg"
            src="/road-video.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <div className="wideangle-clip" ref={clipRef}>
          <div className="flip-card" ref={flipCardRef}>
            {/* Front: road-facing camera */}
            <div className="flip-face flip-front">
              <div ref={bracketsRef}>
                <span className="wideangle-bracket bracket-tl" />
                <span className="wideangle-bracket bracket-tr" />
                <span className="wideangle-bracket bracket-bl" />
                <span className="wideangle-bracket bracket-br" />
              </div>
              <video
                className="wideangle-video"
                src="/road-video.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Back: cabin-facing camera */}
            <div className="flip-face flip-back">
              <video
                className="wideangle-video"
                src="/cabin-video.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>

        <span className="wideangle-badge" ref={badgeRef}>2K QHD · 2560×1440</span>

        {/* Road-facing text */}
        <div className="wideangle-text" ref={roadTextRef}>
          <h2>
            <span className="wa-prefix" ref={prefixRef}>Wider&#8201;</span>
            <span className="wa-core">2K QHD</span>
          </h2>
          <p className="wideangle-sub" ref={subRef}>140° field of view · Crystal clear, always</p>
        </div>

        {/* Cabin-facing text — appears after flip */}
        <div className="wideangle-text cabin-text" ref={cabinTextRef}>
          <h2>360° Flip Camera</h2>
          <p className="wideangle-sub" style={{ opacity: 1 }}>Cabin view · IR night vision · Always watching</p>
        </div>

      </div>
    </section>
  );
}
