import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-shield" />
      <div className="hero-content">
        <div className="hero-badge"><span className="dot" /> Powered by ACKO</div>
        <h1>DriveCam</h1>
        <p>Your drive. Crystal clear. A smart dashcam that sees everything, so you never have to worry about the road behind — or ahead.</p>
        <button className="cta-btn">Pre-order Now</button>
      </div>
      <div className="scroll-indicator"><span>SCROLL</span><div className="line" /></div>
    </section>
  );
}
