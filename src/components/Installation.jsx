import './Installation.css';

const steps = [
  { num: '01', title: 'Peel & Stick', desc: 'Attach the magnetic mount to your windshield using the 3M adhesive pad.' },
  { num: '02', title: 'Snap the Cam', desc: 'Click the DriveCam onto the magnetic mount. It locks in place with a satisfying snap.' },
  { num: '03', title: 'Plug & Go', desc: 'Connect to your car\'s USB port. Scan the QR code to pair with the ACKO app.' },
];

export default function Installation() {
  return (
    <section className="fold-install">
      <h2>Setup in 3 steps.</h2>
      <p>No tools. No wiring. Under 2 minutes.</p>
      <div className="install-steps">
        {steps.map((s) => (
          <div className="install-step" key={s.num}>
            <div className="install-video">
              <span className="step-num">STEP {s.num}</span>
              <div className="play-btn">▶</div>
            </div>
            <div className="install-step-info">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
