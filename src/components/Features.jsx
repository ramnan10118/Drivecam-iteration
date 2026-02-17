import './Features.css';

const features = [
  { icon: '☁️', title: 'Cloud Backup', desc: 'Footage automatically syncs to your ACKO account. Access clips anytime from the app.' },
  { icon: '⚡', title: 'Instant Alerts', desc: 'AI detects incidents in real-time and sends instant notifications to your phone.' },
  { icon: '📍', title: 'GPS Tracking', desc: 'Every clip is geotagged. Route history and speed data logged automatically.' },
  { icon: '🌙', title: 'Night Vision', desc: 'F1.8 aperture with infrared LEDs. Crystal clear footage even in complete darkness.' },
  { icon: '🔄', title: 'Loop Recording', desc: 'Continuous recording with smart storage management. Never runs out of space.' },
  { icon: '🛡️', title: 'Parking Mode', desc: 'Motion-activated recording when parked. 24/7 surveillance with minimal power draw.' },
];

export default function Features() {
  return (
    <section className="fold-features">
      <h2>Everything else<br />you need.</h2>
      <p>Packed with smart features that work together to keep you protected.</p>
      <div className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
