import { useRef, useEffect } from 'react';
import { useScrollProgress, clamp01 } from '../hooks/useScrollProgress';
import './VideoFlip.css';

export default function VideoFlip() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);

  useEffect(() => {
    const vp = progress;
    const flipAngle = Math.min(180, Math.max(0, (vp - 0.35) / 0.3 * 180));
    const front = document.getElementById('videoFront');
    const back = document.getElementById('videoBack');
    const topL = document.getElementById('videoTopLabel');
    const botL = document.getElementById('videoBottomLabel');

    if (!front) return;

    front.style.transform = `rotateY(${flipAngle}deg)`;
    back.style.transform = `rotateY(${180 + flipAngle}deg)`;
    topL.style.opacity = vp < 0.3 ? 1 : Math.max(0, 1 - (vp - 0.3) / 0.15);

    if (vp > 0.65) {
      botL.style.opacity = clamp01((vp - 0.65) / 0.15);
      botL.querySelector('p').textContent = 'Cabin view. IR night vision. Always watching.';
    } else {
      botL.style.opacity = vp > 0.1 ? 1 : 0;
      botL.querySelector('p').textContent = 'See everything. Inside and out.';
    }
  }, [progress]);

  return (
    <section className="fold-video" ref={sectionRef}>
      <div className="fold-video-sticky">
        <div className="video-label top-label" id="videoTopLabel">
          <h2>Crystal Clear. <span className="hl">Always.</span></h2>
        </div>
        <div className="video-container">
          <div className="video-face video-front" id="videoFront">
            <div className="road-lines" />
            <div className="video-face-content">
              <span className="spec-badge">2K QHD · 2560×1440</span>
              <span className="icon">🛣️</span>
              <h3>Road-Facing Camera</h3>
              <p>30fps · HDR · Wide Angle Lens</p>
            </div>
          </div>
          <div className="video-face video-back" id="videoBack">
            <div className="cabin-grid" />
            <div className="video-face-content">
              <span className="spec-badge ir">IR Night Vision · 1080p</span>
              <span className="icon">🎥</span>
              <h3>Cabin-Facing Camera</h3>
              <p>Infrared LEDs · 140° Wide Angle</p>
            </div>
          </div>
        </div>
        <div className="video-label bottom-label" id="videoBottomLabel">
          <p>See everything. Inside and out.</p>
        </div>
      </div>
    </section>
  );
}
