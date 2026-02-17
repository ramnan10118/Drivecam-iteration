import { useRef, useEffect, useState, useCallback } from 'react';
import { useScrollProgress, clamp01, easeInCubic, easeInQuad, remap } from '../hooks/useScrollProgress';
import './CameraChipSequence.css';

const TOTAL_FRAMES = 57;
const START_INDEX = 206;
const framePath = (i) => `/frames/camera_not_connected (00253)_${String(i).padStart(5, '0')}.png`;

const PHASE = {
  framesEnd: 0.35,
  zoomEnd: 0.50,
  chipReveal: 0.55,
};

export default function CameraChipSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const progress = useScrollProgress(sectionRef);

  // Load frames
  useEffect(() => {
    let count = 0;
    const imgs = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = img.onerror = () => {
        count++;
        setLoadPct(Math.round((count / TOTAL_FRAMES) * 100));
        if (count === TOTAL_FRAMES) {
          framesRef.current = imgs;
          setLoaded(true);
        }
      };
      img.src = framePath(START_INDEX + i);
      imgs[i] = img;
    }
  }, []);

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const frame = framesRef.current[index];
    if (!canvas || !frame || !frame.complete || !frame.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1920, 1920);
    ctx.drawImage(frame, 0, 0, 1920, 1920);
  }, []);

  // Draw first frame once loaded
  useEffect(() => {
    if (loaded) drawFrame(0);
  }, [loaded, drawFrame]);

  // Scroll-driven animation
  useEffect(() => {
    if (!loaded) return;
    const p = progress;

    const canvas = canvasRef.current;
    const vignette = document.getElementById('seqVignette');
    const darkOverlay = document.getElementById('seqDarkOverlay');
    const seqProgress = document.getElementById('seqProgress');
    const chipImgEl = document.getElementById('chipBgImg');
    const chipOverlayEl = document.getElementById('chipDarkOverlay');
    const chipContentEl = document.getElementById('chipContent');
    const chipLeftEl = document.getElementById('chipLeft');
    const chipRightEl = document.getElementById('chipRight');
    const chipDividerEl = document.getElementById('chipDivider');

    if (!canvas || !vignette || !darkOverlay) return;

    if (p <= PHASE.framesEnd) {
      // Phase 1: Frames
      const frameNorm = remap(p, 0, PHASE.framesEnd);
      const target = Math.min(TOTAL_FRAMES - 1, Math.floor(frameNorm * (TOTAL_FRAMES - 1)));
      if (target !== currentFrameRef.current) {
        currentFrameRef.current = target;
        drawFrame(target);
      }
      canvas.style.transform = 'translate(-50%, -50%) scale(1)';
      canvas.style.opacity = 1;
      darkOverlay.style.opacity = 0;
      vignette.style.opacity = 0;
      seqProgress.style.opacity = 1;
      chipImgEl.style.opacity = 0;
      chipOverlayEl.style.opacity = 0;
      chipContentEl.style.opacity = 0;
    } else if (p <= PHASE.zoomEnd) {
      // Phase 2: Zoom into lens
      if (currentFrameRef.current !== TOTAL_FRAMES - 1) {
        currentFrameRef.current = TOTAL_FRAMES - 1;
        drawFrame(TOTAL_FRAMES - 1);
      }
      const zoomNorm = remap(p, PHASE.framesEnd, PHASE.zoomEnd);
      const scale = 1 + easeInCubic(zoomNorm) * 29;
      canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
      canvas.style.opacity = 1;
      vignette.style.opacity = clamp01(easeInQuad(zoomNorm) * 1.5);
      const darkNorm = remap(zoomNorm, 0.25, 1.0);
      darkOverlay.style.opacity = easeInQuad(darkNorm);
      seqProgress.style.opacity = clamp01(1 - zoomNorm * 4);
      chipImgEl.style.opacity = 0;
      chipOverlayEl.style.opacity = 0;
      chipContentEl.style.opacity = 0;
    } else if (p <= PHASE.chipReveal) {
      // Phase 3: PCB reveal
      const revealNorm = remap(p, PHASE.zoomEnd, PHASE.chipReveal);
      canvas.style.opacity = 0;
      darkOverlay.style.opacity = 1;
      vignette.style.opacity = 0;
      seqProgress.style.opacity = 0;
      chipImgEl.style.opacity = revealNorm;
      const zoomIn = 1 + 0.06 * (1 - revealNorm);
      chipImgEl.style.transform = `scaleX(-1) scale(${zoomIn})`;
      chipOverlayEl.style.opacity = revealNorm * 0.5;
      chipContentEl.style.opacity = 0;
    } else {
      // Phase 4: Chip text
      const textNorm = remap(p, PHASE.chipReveal, 0.75);
      canvas.style.opacity = 0;
      darkOverlay.style.opacity = 0;
      vignette.style.opacity = 0;
      seqProgress.style.opacity = 0;
      chipImgEl.style.opacity = 1;
      chipImgEl.style.transform = 'scaleX(-1) scale(1)';
      chipOverlayEl.style.opacity = 0.5;
      chipContentEl.style.opacity = 1;
      chipLeftEl.style.opacity = clamp01(textNorm * 2);
      chipLeftEl.style.transform = `translateY(${(1 - clamp01(textNorm * 2)) * 20}px)`;
      chipDividerEl.style.opacity = clamp01((textNorm - 0.2) * 3);
      chipRightEl.style.opacity = clamp01((textNorm - 0.3) * 2.5);
      chipRightEl.style.transform = `translateY(${(1 - clamp01((textNorm - 0.3) * 2.5)) * 20}px)`;
    }

    // Progress bar
    const fillPct = clamp01(p / PHASE.framesEnd) * 100;
    document.getElementById('seqFill').style.width = `${fillPct}%`;
    const displayFrame = Math.min(TOTAL_FRAMES, currentFrameRef.current + 1);
    document.getElementById('seqCount').textContent =
      `${String(displayFrame).padStart(2, '0')} / ${TOTAL_FRAMES}`;
  }, [progress, loaded, drawFrame]);

  return (
    <section className="fold-camera-chip" ref={sectionRef}>
      <div className="fold-camera-chip-sticky">
        <canvas ref={canvasRef} id="seqCanvas" width={1920} height={1920} />
        <div id="seqVignette" />
        <div id="seqDarkOverlay" />

        <img src="/chip-bg.png" alt="" id="chipBgImg" />
        <div id="chipDarkOverlay" />
        <div id="chipContent">
          <div className="chip-info" id="chipLeft">
            <div className="stat">2.4GHz</div>
            <h3>Dual-Core Processor</h3>
            <p>Real-time video processing with AI-powered scene detection and instant incident capture.</p>
          </div>
          <div className="chip-divider" id="chipDivider" />
          <div className="chip-info" id="chipRight">
            <div className="stat">40%</div>
            <h3>More Efficient</h3>
            <p>Advanced ISP with hardware-accelerated encoding. Lower power draw, zero frame drops.</p>
          </div>
        </div>

        <div className="seq-progress" id="seqProgress">
          <div className="seq-progress-bar"><div className="seq-progress-fill" id="seqFill" /></div>
          <span className="seq-frame-count" id="seqCount">01 / 57</span>
        </div>

        {!loaded && (
          <div className="seq-loader">
            <div className="seq-loader-ring" />
            <p>Loading frames... {loadPct}%</p>
          </div>
        )}
      </div>
    </section>
  );
}
