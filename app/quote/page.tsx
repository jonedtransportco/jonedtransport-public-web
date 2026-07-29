import { PublicDetailPage } from "../public-shell";

export default function QuotePage() {
  return (
    <PublicDetailPage
      eyebrow="Quotation"
      title="Request a transportation quote."
      introduction="Provide the lane and service information needed for a commercial review. This public form does not expose or activate private operations."
    >
      <form className="joned-quote-form" action="mailto:commercialmanager@jonedtransport.com" method="post">
        <label>Company<input name="company" required /></label>
        <label>Contact name<input name="contact" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Phone<input name="phone" type="tel" /></label>
        <label>Origin<input name="origin" required /></label>
        <label>Destination<input name="destination" required /></label>
        <label className="wide">Shipment details<textarea name="details" rows={5} required /></label>
        <button className="joned-yellow-btn" type="submit">Send request</button>
      </form>
    </PublicDetailPage>
  );
}
