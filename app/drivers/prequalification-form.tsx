"use client";

import { useMemo, useState } from "react";

type Locale = "en" | "es";
type DriverLicensePath = "CDL" | "Non-CDL" | "Not sure yet";
type ApplicantKind = "Personal" | "Business" | "Not sure yet";
type PreferredLanguage = "English" | "Español";

type FormState = {
  applicantKind: ApplicantKind;
  licensePath: DriverLicensePath;
  legalName: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  city: string;
  stateRegion: string;
  preferredLanguage: PreferredLanguage;
  roleInterest: string;
  experienceSummary: string;
  availability: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpirationDate: string;
  cdlClass: string;
  endorsements: string;
  medicalCardStatus: string;
  medicalCardExpirationDate: string;
  nonCdlLicenseCategory: string;
  canDriveManual: string;
  needsTrainingReview: string;
  confirmInformationTrue: boolean;
  confirmContactPermission: boolean;
};

const initialState: FormState = {
  applicantKind: "Not sure yet",
  licensePath: "Not sure yet",
  legalName: "",
  businessName: "",
  phoneNumber: "",
  email: "",
  city: "",
  stateRegion: "",
  preferredLanguage: "English",
  roleInterest: "",
  experienceSummary: "",
  availability: "",
  licenseNumber: "",
  licenseState: "",
  licenseExpirationDate: "",
  cdlClass: "",
  endorsements: "",
  medicalCardStatus: "",
  medicalCardExpirationDate: "",
  nonCdlLicenseCategory: "",
  canDriveManual: "",
  needsTrainingReview: "",
  confirmInformationTrue: false,
  confirmContactPermission: false,
};

const text: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  sidebarTitle: string;
  sidebarStep: string;
  steps: string[];
  routeLabel: string;
  routeCaption: string;
  footerBack: string;
  footerNext: string;
  footerSubmit: string;
  currentRoute: string;
  currentRouteLabel: string;
  currentRouteSummary: string;
  noVehicleTitle: string;
  noVehicleBody: string;
  personalBusinessTitle: string;
  personalBusinessBody: string;
  step3Title: string;
  step4Title: string;
  step5Title: string;
  hiddenTitle: string;
  hiddenBody: string;
  reviewTitle: string;
  reviewBody: string;
}> = {
  en: {
    eyebrow: "Driver prequalification",
    title: "Start the driver intake and we will show the route that fits your profile.",
    intro: "Simple public intake for drivers.",
    sidebarTitle: "Driver intake",
    sidebarStep: "Step",
    steps: ["1. Route", "2. Profile", "3. License", "4. Readiness", "5. Review"],
    routeLabel: "Resolved route",
    routeCaption: "public intake",
    footerBack: "Back",
    footerNext: "Continue",
    footerSubmit: "Submit",
    currentRoute: "Route",
    currentRouteLabel: "No vehicle",
    currentRouteSummary: "This public driver path is for applicants without a self-provided vehicle.",
    noVehicleTitle: "No vehicle",
    noVehicleBody: "This public driver path is for applicants without a self-provided vehicle.",
    personalBusinessTitle: "Personal or business",
    personalBusinessBody: "Start as an individual or through a registered company.",
    step3Title: "License",
    step4Title: "Readiness",
    step5Title: "Review",
    hiddenTitle: "Not shown here",
    hiddenBody: "Vehicle registration, insurance, and unit questions stay out of the public page.",
    reviewTitle: "Final check",
    reviewBody: "Confirm the route and required items before review.",
  },
  es: {
    eyebrow: "Preevaluación de conductores",
    title: "Comienza el ingreso del conductor y te mostraremos la ruta que encaja con tu perfil.",
    intro: "Ingreso público simple para conductores.",
    sidebarTitle: "Ingreso de conductores",
    sidebarStep: "Paso",
    steps: ["1. Ruta", "2. Perfil", "3. Licencia", "4. Preparación", "5. Revisión"],
    routeLabel: "Ruta resuelta",
    routeCaption: "ingreso público",
    footerBack: "Atrás",
    footerNext: "Continuar",
    footerSubmit: "Enviar",
    currentRoute: "Ruta actual",
    currentRouteLabel: "Sin vehículo",
    currentRouteSummary: "Esta ruta pública es para solicitantes sin vehículo propio.",
    noVehicleTitle: "Sin vehículo",
    noVehicleBody: "Esta ruta pública es para solicitantes sin vehículo propio.",
    personalBusinessTitle: "Persona o empresa",
    personalBusinessBody: "Inicia como persona o mediante una empresa registrada.",
    step3Title: "Licencia",
    step4Title: "Preparación",
    step5Title: "Revisión",
    hiddenTitle: "No se muestra aquí",
    hiddenBody: "Los datos de vehículo, seguro y unidad quedan fuera de la página pública.",
    reviewTitle: "Estado del envío",
    reviewBody: "Confirma la ruta y los elementos antes de revisión.",
  },
};

function resolveRoute(state: FormState) {
  const kindPrefix = state.applicantKind === "Business" ? "B" : "P";
  let route = "Needs clarification";

  if (state.applicantKind === "Personal" && state.licensePath === "CDL") route = "P3";
  else if (state.applicantKind === "Personal" && state.licensePath === "Non-CDL") route = "P4";
  else if (state.applicantKind === "Business" && state.licensePath === "CDL") route = "B3";
  else if (state.applicantKind === "Business" && state.licensePath === "Non-CDL") route = "B4";

  const licenseLabel =
    state.licensePath === "CDL"
      ? "CDL"
      : state.licensePath === "Non-CDL"
        ? "Non-CDL"
        : "unknown license";

  return {
    route,
    summary: `${kindPrefix} · no vehicle path · ${licenseLabel}`,
  };
}

function buildChecklist(state: FormState) {
  const cdlRoute = state.licensePath === "CDL";
  const businessRoute = state.applicantKind === "Business";

  return [
    ["Profile agreement", "Required or likely"],
    ["License document", "Broad"],
    ["Medical card", "Required for all license paths"],
    ["Vehicle registration", "Not shown"],
    ["Commercial authority", businessRoute ? "Conditional" : "Not shown by default"],
    ["W-9", businessRoute ? "Conditional" : "Not shown by default"],
    ["Voided check", businessRoute ? "Conditional" : "Not shown by default"],
  ];
}

export default function DriversPrequalificationForm({ locale = "en" }: { locale?: Locale }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>(initialState);

  const route = useMemo(() => resolveRoute(state), [state]);
  const checklist = useMemo(() => buildChecklist(state), [state]);
  const copy = text[locale];
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 5));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  return (
    <section className="site-section owner-intake" id="start">
      <div className="section-head">
        <span>{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.intro}</p>
      </div>

      <div className="owner-intake-shell">
        <aside className="owner-intake-sidebar">
          <span>{locale === "es" ? "FLUJO" : "FLOW"}</span>
          <b>{copy.sidebarTitle}</b>
          <small>{copy.sidebarStep} {step} of 5</small>
          <div className="owner-step-list">
            {copy.steps.map((item, index) => (
              <div key={item} className={`owner-step-item ${step === index + 1 ? "active" : step > index + 1 ? "done" : ""}`}>
                {item}
              </div>
            ))}
          </div>
          <div className="owner-route-summary">
            <span>{copy.routeLabel}</span>
            <b>{route.route}</b>
            <small>{route.summary} · {copy.routeCaption}</small>
          </div>
        </aside>

        <div className="owner-intake-main">
          {step === 1 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 1</span>
                  <h3>{locale === "es" ? "Ruta" : "Route"}</h3>
                </div>
              </div>
              <form className="mock-form owner-form-grid">
                <label>
                  <span>How are you applying?</span>
                  <select value={state.applicantKind} onChange={(event) => update("applicantKind", event.target.value as ApplicantKind)}>
                    <option>Personal</option>
                    <option>Business</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label>
                  <span>Which license path applies to you?</span>
                  <select value={state.licensePath} onChange={(event) => update("licensePath", event.target.value as DriverLicensePath)}>
                    <option>CDL</option>
                    <option>Non-CDL</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <div className="owner-form-note full">
                  <b>{copy.noVehicleTitle}</b>
                  <p>{copy.noVehicleBody}</p>
                </div>
                <div className="owner-form-note full">
                  <b>{copy.personalBusinessTitle}</b>
                  <p>{copy.personalBusinessBody}</p>
                </div>
                <div className="owner-form-note">
                  <b>{locale === "es" ? "Ruta" : "Route"}</b>
                  <p>{route.route} · {route.summary}</p>
                </div>
              </form>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 2</span>
                  <h3>Applicant information</h3>
                </div>
              </div>
              <form className="mock-form owner-form-grid">
                <label><span>Legal name</span><input value={state.legalName} onChange={(event) => update("legalName", event.target.value)} /></label>
                <label><span>Business name</span><input value={state.businessName} onChange={(event) => update("businessName", event.target.value)} /></label>
                <label><span>Phone number</span><input value={state.phoneNumber} onChange={(event) => update("phoneNumber", event.target.value)} /></label>
                <label><span>Email address</span><input value={state.email} onChange={(event) => update("email", event.target.value)} /></label>
                <label><span>City</span><input value={state.city} onChange={(event) => update("city", event.target.value)} /></label>
                <label><span>State</span><input value={state.stateRegion} onChange={(event) => update("stateRegion", event.target.value)} /></label>
                <label>
                  <span>Preferred language</span>
                  <select value={state.preferredLanguage} onChange={(event) => update("preferredLanguage", event.target.value as PreferredLanguage)}>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </label>
                <label><span>Role interest</span><input value={state.roleInterest} onChange={(event) => update("roleInterest", event.target.value)} placeholder="Regional, local, dedicated, shuttle..." /></label>
                <div className="owner-form-note full">
                  <b>{locale === "es" ? "Nota" : "Note"}</b>
                  <p>{state.applicantKind === "Business" ? (locale === "es" ? "Usa el nombre de la empresa registrada." : "Use the registered business name.") : (locale === "es" ? "Usa tus datos legales personales." : "Use your personal legal details.")}</p>
                </div>
              </form>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 3</span>
                  <h3>{copy.step3Title}</h3>
                </div>
              </div>
              <form className="mock-form owner-form-grid">
                <label>
                  <span>License type</span>
                  <select value={state.licensePath} onChange={(event) => update("licensePath", event.target.value as DriverLicensePath)}>
                    <option>CDL</option>
                    <option>Non-CDL</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label><span>License number</span><input value={state.licenseNumber} onChange={(event) => update("licenseNumber", event.target.value)} /></label>
                <label><span>State of issuance</span><input value={state.licenseState} onChange={(event) => update("licenseState", event.target.value)} /></label>
                <label><span>License expiration date</span><input type="date" value={state.licenseExpirationDate} onChange={(event) => update("licenseExpirationDate", event.target.value)} /></label>
                <label><span>License category</span><input value={state.nonCdlLicenseCategory} onChange={(event) => update("nonCdlLicenseCategory", event.target.value)} placeholder="CDL class or Non-CDL category" /></label>
                <label><span>CDL class / endorsement notes</span><input value={state.cdlClass} onChange={(event) => update("cdlClass", event.target.value)} placeholder="Required if CDL, optional note otherwise" /></label>
                <label><span>Endorsements</span><input value={state.endorsements} onChange={(event) => update("endorsements", event.target.value)} /></label>
                <label>
                  <span>Do you have a valid medical card?</span>
                  <select value={state.medicalCardStatus} onChange={(event) => update("medicalCardStatus", event.target.value)}>
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label><span>Medical card expiration date</span><input type="date" value={state.medicalCardExpirationDate} onChange={(event) => update("medicalCardExpirationDate", event.target.value)} /></label>
              </form>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 4</span>
                  <h3>{copy.step4Title}</h3>
                </div>
              </div>
              <form className="mock-form owner-form-grid">
                <label><span>Experience summary</span><textarea value={state.experienceSummary} onChange={(event) => update("experienceSummary", event.target.value)} rows={4} /></label>
                <label><span>Availability</span><input value={state.availability} onChange={(event) => update("availability", event.target.value)} placeholder="Immediate, two weeks, weekends..." /></label>
                <label>
                  <span>Can you drive manual transmission if the route requires it?</span>
                  <select value={state.canDriveManual} onChange={(event) => update("canDriveManual", event.target.value)}>
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label>
                  <span>Do you expect to need training or route review before dispatch-readiness?</span>
                  <select value={state.needsTrainingReview} onChange={(event) => update("needsTrainingReview", event.target.value)}>
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <div className="owner-form-note full">
                  <b>{locale === "es" ? "No se muestra aquí" : "Not shown here"}</b>
                  <p>{locale === "es" ? "Los datos de vehículo y seguro quedan fuera." : "Vehicle and insurance details stay out."}</p>
                </div>
              </form>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 5</span>
                  <h3>{copy.step5Title}</h3>
                </div>
              </div>
              <div className="owner-review-grid">
                <article className="owner-review-card">
                  <span>{copy.routeLabel}</span>
                  <b>{route.route}</b>
                  <p>{route.summary}</p>
                </article>
                <article className="owner-review-card">
                  <span>{locale === "es" ? "Checklist" : "Checklist"}</span>
                  <ul>
                    {checklist.map(([label, status]) => (
                      <li key={label}>
                        <b>{label}:</b> {status}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
              <form className="mock-form owner-form-grid">
                <label className="checkbox-row">
                  <input type="checkbox" checked={state.confirmInformationTrue} onChange={(event) => update("confirmInformationTrue", event.target.checked)} />
                  <span>{locale === "es" ? "Confirmo que la información es correcta." : "I confirm the information is correct."}</span>
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={state.confirmContactPermission} onChange={(event) => update("confirmContactPermission", event.target.checked)} />
                  <span>{locale === "es" ? "Autorizo a JONED a contactarme." : "I authorize JONED to contact me."}</span>
                </label>
                <div className="owner-form-note full">
                  <b>{copy.reviewTitle}</b>
                  <p>{copy.reviewBody}</p>
                </div>
              </form>
            </div>
          ) : null}

          <div className="owner-intake-actions">
            <button type="button" className="ghost-link button-link" onClick={previousStep} disabled={step === 1}>
              {copy.footerBack}
            </button>
            {step < 5 ? (
              <button type="button" className="primary-cta compact button-link" onClick={nextStep}>
                {copy.footerNext}
              </button>
            ) : (
              <button type="button" className="primary-cta compact button-link">
                {copy.footerSubmit}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
