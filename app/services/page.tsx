import { PublicDetailPage } from "../public-shell";

const services = [
  ["Ground transportation", "Regional and cross-border capacity coordinated around committed service windows."],
  ["Dispatch support", "Operational coordination for timing, exceptions, and customer communication."],
  ["Protected tracking", "High-level public status with detailed operational visibility reserved for authorized roles."],
  ["Carrier solutions", "Dedicated routes for qualified drivers and owner operators."],
];

export default function ServicesPage() {
  return (
    <PublicDetailPage
      eyebrow="Services"
      title="Transportation designed around control and reliability."
      introduction="Joned Transpor Co combines responsive coordination with a protected enterprise operating model."
    >
      <div className="joned-page-grid">
        {services.map(([title, body]) => (
          <article className="joned-page-card" key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <div className="joned-page-action">
        <h2>Tell us what needs to move.</h2>
        <a href="/quote/" className="joned-yellow-btn">Request quote</a>
      </div>
    </PublicDetailPage>
  );
}
