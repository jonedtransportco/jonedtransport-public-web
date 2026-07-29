"use client";

import { useMemo, useState } from "react";

type Locale = "en" | "es";
type ApplicantForm = "Person" | "Business" | "Not sure yet";
type VehiclePath = "Yes" | "No" | "Not sure yet";
type LicensePath = "CDL" | "Non-CDL" | "Not sure yet";

type FormState = {
  applicantForm: ApplicantForm;
  vehiclePath: VehiclePath;
  licensePath: LicensePath;
  companyHasLinkedDrivers: "Yes" | "No" | "Not sure yet";
  linkedDriversCount: string;
  linkedDriversRoster: string;
  companyContactName: string;
  companyContactRole: string;
  legalName: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  city: string;
  stateRegion: string;
  preferredLanguage: "English" | "Español";
  licenseType: LicensePath;
  licenseNumber: string;
  licenseState: string;
  licenseExpirationDate: string;
  cdlClass: string;
  cdlEndorsements: string;
  medicalCardStatus: string;
  medicalCardExpirationDate: string;
  nonCdlLicenseCategory: string;
  vehicleType: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistrationAvailable: string;
  eldApplicable: string;
  hasCommercialAuthority: string;
  dotNumber: string;
  mcNumber: string;
  carrierAuthorityDocumentAvailable: string;
  hasCoiAvailable: string;
  generalLiabilityAmount: string;
  generalAggregateAmount: string;
  autoLiabilityAmount: string;
  cargoCoverageAmount: string;
  trailerInterchangeCoverageAmount: string;
  w9Available: string;
  voidedCheckAvailable: string;
  confirmInformationTrue: boolean;
  confirmContactPermission: boolean;
};

const initialState: FormState = {
  applicantForm: "Not sure yet",
  vehiclePath: "Not sure yet",
  licensePath: "Not sure yet",
  companyHasLinkedDrivers: "Not sure yet",
  linkedDriversCount: "",
  linkedDriversRoster: "",
  companyContactName: "",
  companyContactRole: "",
  legalName: "",
  businessName: "",
  phoneNumber: "",
  email: "",
  city: "",
  stateRegion: "",
  preferredLanguage: "English",
  licenseType: "Not sure yet",
  licenseNumber: "",
  licenseState: "",
  licenseExpirationDate: "",
  cdlClass: "",
  cdlEndorsements: "",
  medicalCardStatus: "",
  medicalCardExpirationDate: "",
  nonCdlLicenseCategory: "",
  vehicleType: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleRegistrationAvailable: "",
  eldApplicable: "",
  hasCommercialAuthority: "",
  dotNumber: "",
  mcNumber: "",
  carrierAuthorityDocumentAvailable: "",
  hasCoiAvailable: "",
  generalLiabilityAmount: "",
  generalAggregateAmount: "",
  autoLiabilityAmount: "",
  cargoCoverageAmount: "",
  trailerInterchangeCoverageAmount: "",
  w9Available: "",
  voidedCheckAvailable: "",
  confirmInformationTrue: false,
  confirmContactPermission: false,
};

const vehicleOptions = ["Passenger/light vehicle", "Box truck", "Straight truck", "Tractor", "Trailer-attached", "Other"];

const text: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  sidebarTitle: string;
  sidebarStep: string;
  routeLabel: string;
  routeCaption: string;
  footerBack: string;
  footerNext: string;
  footerSubmit: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  step5Title: string;
  hiddenTitle: string;
  hiddenBody: string;
  reviewTitle: string;
  reviewBody: string;
}> = {
  en: {
    eyebrow: "Prequalification",
    title: "Answer a few questions and we will show the route that fits your profile.",
    intro: "Simple public intake for owner-operators.",
    sidebarTitle: "Owner-operator intake",
    sidebarStep: "Step",
    routeLabel: "Resolved route",
    routeCaption: "public intake",
    footerBack: "Back",
    footerNext: "Continue",
    footerSubmit: "Submit",
    step2Title: "Profile",
    step3Title: "License",
    step4Title: "Operations",
    step5Title: "Review",
    hiddenTitle: "Not shown here",
    hiddenBody: "Private vehicle, insurance, and unit details stay out of the public page.",
    reviewTitle: "Final check",
    reviewBody: "Confirm the route and required items before review.",
  },
  es: {
    eyebrow: "Preevaluación",
    title: "Responde algunas preguntas y te mostraremos la ruta que encaja con tu perfil.",
    intro: "Ingreso público simple para owner-operators.",
    sidebarTitle: "Ingreso de owner-operators",
    sidebarStep: "Paso",
    routeLabel: "Ruta resuelta",
    routeCaption: "ingreso público",
    footerBack: "Atrás",
    footerNext: "Continuar",
    footerSubmit: "Enviar",
    step2Title: "Perfil",
    step3Title: "Licencia",
    step4Title: "Operación",
    step5Title: "Revisión",
    hiddenTitle: "No se muestra aquí",
    hiddenBody: "Los datos privados del vehículo, seguro y unidad quedan fuera de la página pública.",
    reviewTitle: "Confirmación",
    reviewBody: "Confirma la ruta y los elementos antes de revisión.",
  },
};

function getBaseRoute({ applicantForm, vehiclePath, licensePath }: FormState) {
  const formCode = applicantForm === "Business" ? "B" : "P";
  const vehicleCode = vehiclePath === "Yes" ? "with vehicle" : vehiclePath === "No" ? "without vehicle" : "unknown vehicle";
  const licenseCode = licensePath === "CDL" ? "CDL" : licensePath === "Non-CDL" ? "Non-CDL" : "unknown license";

  let route = "Needs clarification";
  if (applicantForm === "Person" && vehiclePath === "Yes" && licensePath === "CDL") route = "P1";
  else if (applicantForm === "Person" && vehiclePath === "Yes" && licensePath === "Non-CDL") route = "P2";
  else if (applicantForm === "Person" && vehiclePath === "No" && licensePath === "CDL") route = "P3";
  else if (applicantForm === "Person" && vehiclePath === "No" && licensePath === "Non-CDL") route = "P4";
  else if (applicantForm === "Business" && vehiclePath === "Yes" && licensePath === "CDL") route = "B1";
  else if (applicantForm === "Business" && vehiclePath === "Yes" && licensePath === "Non-CDL") route = "B2";
  else if (applicantForm === "Business" && vehiclePath === "No" && licensePath === "CDL") route = "B3";
  else if (applicantForm === "Business" && vehiclePath === "No" && licensePath === "Non-CDL") route = "B4";

  return { route, summary: `${formCode} · ${vehicleCode} · ${licenseCode}` };
}

function buildUploadChecklist(state: FormState) {
  const withVehicle = state.vehiclePath === "Yes";
  const business = state.applicantForm === "Business";
  const companyWithDrivers = business && state.companyHasLinkedDrivers === "Yes";
  const noVehicle = state.vehiclePath === "No";

  return [
    ["Profile agreement", !noVehicle || business ? "Required or likely" : "Conditional"],
    ["License document", "Broad"],
    ["Medical card", "Required for all license paths"],
    ["Vehicle registration", withVehicle ? "Vehicle routes only" : "Not shown"],
    ["DOT / MC / authority document", business || state.hasCommercialAuthority === "Yes" ? "Conditional" : "Not shown by default"],
    ["W-9", business ? "Likely required" : noVehicle ? "Not shown by default" : "Conditional"],
    ["Insurance certificate COI", business || withVehicle ? "Required" : "Not shown"],
    ["Voided check", business ? "Conditional" : noVehicle ? "Not shown by default" : "Conditional"],
    ["Linked drivers roster", companyWithDrivers ? "Portal review only" : "Not shown by default"],
  ];
}

export default function OwnerOperatorPrequalificationForm({ locale = "en" }: { locale?: Locale }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>(initialState);
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const route = useMemo(() => getBaseRoute(state), [state]);
  const uploadChecklist = useMemo(() => buildUploadChecklist(state), [state]);
  const copy = text[locale];

  const withVehicle = state.vehiclePath === "Yes";
  const businessRoute = state.applicantForm === "Business";
  const companyWithDrivers = businessRoute && state.companyHasLinkedDrivers === "Yes";
  const noVehicleRoute = state.vehiclePath === "No";
  const showAuthority = businessRoute || state.hasCommercialAuthority === "Yes";
  const showInsurance = withVehicle;
  const showTax = businessRoute || (withVehicle && !noVehicleRoute);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 5));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function submitApplication() {
    setSubmitState("saving");

    try {
      const response = await fetch("/api/v1/owner-operators", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          domain: "owner-operators",
          mode: "mock",
          route,
          state,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        setSubmitState("error");
        return;
      }

      setSubmitState("saved");
    } catch {
      setSubmitState("error");
    }
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
            {[
              "1. Route",
              "2. Profile",
              "3. License",
              "4. Operations",
              "5. Review",
            ].map((item, index) => (
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
                  <select value={state.applicantForm} onChange={(event) => update("applicantForm", event.target.value as ApplicantForm)}>
                    <option>Person</option>
                    <option>Business</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                {businessRoute ? (
                  <>
                    <label>
                      <span>Will this company have linked drivers?</span>
                      <select value={state.companyHasLinkedDrivers} onChange={(event) => update("companyHasLinkedDrivers", event.target.value as "Yes" | "No" | "Not sure yet")}>
                        <option>Yes</option>
                        <option>No</option>
                        <option>Not sure yet</option>
                      </select>
                    </label>
                    <label><span>Primary company contact name</span><input value={state.companyContactName} onChange={(event) => update("companyContactName", event.target.value)} /></label>
                    <label><span>Primary company contact role</span><input value={state.companyContactRole} onChange={(event) => update("companyContactRole", event.target.value)} placeholder="Owner, dispatcher, HR, billing..." /></label>
                  </>
                ) : null}
                <label>
                  <span>Are you applying with a vehicle?</span>
                  <select value={state.vehiclePath} onChange={(event) => update("vehiclePath", event.target.value as VehiclePath)}>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
                <label>
                  <span>Which license path applies to you?</span>
                  <select value={state.licensePath} onChange={(event) => update("licensePath", event.target.value as LicensePath)}>
                    <option>CDL</option>
                    <option>Non-CDL</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
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
                  <h3>{copy.step2Title}</h3>
                </div>
              </div>
              <form className="mock-form owner-form-grid">
                <label><span>Legal name</span><input value={state.legalName} onChange={(event) => update("legalName", event.target.value)} /></label>
                <label><span>Business name (if applicable)</span><input value={state.businessName} onChange={(event) => update("businessName", event.target.value)} /></label>
                <label><span>Phone number</span><input value={state.phoneNumber} onChange={(event) => update("phoneNumber", event.target.value)} /></label>
                <label><span>Email address</span><input value={state.email} onChange={(event) => update("email", event.target.value)} /></label>
                <label><span>City</span><input value={state.city} onChange={(event) => update("city", event.target.value)} /></label>
                <label><span>State</span><input value={state.stateRegion} onChange={(event) => update("stateRegion", event.target.value)} /></label>
                <label>
                  <span>Preferred language</span>
                  <select value={state.preferredLanguage} onChange={(event) => update("preferredLanguage", event.target.value as "English" | "Español")}>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </label>
                <div className="owner-form-note">
                  <b>{locale === "es" ? "Nota" : "Note"}</b>
                  <p>{state.applicantForm === "Business" ? (locale === "es" ? "Usa los datos de la empresa registrada." : "Use the registered business details.") : (locale === "es" ? "Usa tus datos legales personales." : "Use your personal legal details.")}</p>
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
                  <select value={state.licenseType} onChange={(event) => update("licenseType", event.target.value as LicensePath)}>
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
                <label><span>Endorsements</span><input value={state.cdlEndorsements} onChange={(event) => update("cdlEndorsements", event.target.value)} /></label>
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
              <div className="owner-dynamic-stack">
                {withVehicle ? (
                  <form className="mock-form owner-form-grid">
                    <label>
                      <span>Vehicle type</span>
                      <select value={state.vehicleType} onChange={(event) => update("vehicleType", event.target.value)}>
                        <option value="">Select</option>
                        {vehicleOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label><span>Vehicle year</span><input value={state.vehicleYear} onChange={(event) => update("vehicleYear", event.target.value)} /></label>
                    <label><span>Vehicle make</span><input value={state.vehicleMake} onChange={(event) => update("vehicleMake", event.target.value)} /></label>
                    <label><span>Vehicle model</span><input value={state.vehicleModel} onChange={(event) => update("vehicleModel", event.target.value)} /></label>
                    <label>
                      <span>Vehicle registration available?</span>
                      <select value={state.vehicleRegistrationAvailable} onChange={(event) => update("vehicleRegistrationAvailable", event.target.value)}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </label>
                    <label>
                      <span>Does your operation use or require ELD?</span>
                      <select value={state.eldApplicable} onChange={(event) => update("eldApplicable", event.target.value)}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                        <option>Not sure yet</option>
                      </select>
                    </label>
                  </form>
                ) : (
                  <div className="owner-form-note full">
                    <b>{copy.hiddenTitle}</b>
                    <p>{copy.hiddenBody}</p>
                  </div>
                )}

                <form className="mock-form owner-form-grid">
                  <label>
                    <span>Do you have commercial authority information to provide?</span>
                    <select value={state.hasCommercialAuthority} onChange={(event) => update("hasCommercialAuthority", event.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                      <option>Not sure yet</option>
                    </select>
                  </label>
                  {showAuthority ? (
                    <>
                      <label><span>DOT number</span><input value={state.dotNumber} onChange={(event) => update("dotNumber", event.target.value)} /></label>
                      <label><span>MC number</span><input value={state.mcNumber} onChange={(event) => update("mcNumber", event.target.value)} /></label>
                      <label>
                        <span>Authority document available?</span>
                        <select value={state.carrierAuthorityDocumentAvailable} onChange={(event) => update("carrierAuthorityDocumentAvailable", event.target.value)}>
                          <option value="">Select</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </label>
                    </>
                  ) : null}
                </form>

                {showInsurance ? (
                  <form className="mock-form owner-form-grid">
                    <label>
                      <span>Do you have your COI available? (required)</span>
                      <select value={state.hasCoiAvailable} onChange={(event) => update("hasCoiAvailable", event.target.value)}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </label>
                    <label><span>General liability coverage</span><input value={state.generalLiabilityAmount} onChange={(event) => update("generalLiabilityAmount", event.target.value)} placeholder="$1,000,000" /></label>
                    <label><span>General aggregate coverage</span><input value={state.generalAggregateAmount} onChange={(event) => update("generalAggregateAmount", event.target.value)} placeholder="$2,000,000" /></label>
                    <label><span>Auto liability coverage</span><input value={state.autoLiabilityAmount} onChange={(event) => update("autoLiabilityAmount", event.target.value)} placeholder="$1,000,000" /></label>
                    <label><span>Cargo coverage</span><input value={state.cargoCoverageAmount} onChange={(event) => update("cargoCoverageAmount", event.target.value)} placeholder="$100,000" /></label>
                    <label><span>Trailer interchange / non-owned trailer coverage</span><input value={state.trailerInterchangeCoverageAmount} onChange={(event) => update("trailerInterchangeCoverageAmount", event.target.value)} placeholder="$25,000" /></label>
                    {state.vehicleType === "Box truck" ? (
                      <div className="owner-form-note full">
                        <b>{locale === "es" ? "Box truck" : "Box truck"}</b>
                        <p>{locale === "es" ? "Aplica COI; no hace falta trailer interchange." : "COI applies; trailer interchange is not needed."}</p>
                      </div>
                    ) : null}
                  </form>
                ) : null}

                {showTax ? (
                  <form className="mock-form owner-form-grid">
                    <label>
                      <span>Do you have your W-9 available?</span>
                      <select value={state.w9Available} onChange={(event) => update("w9Available", event.target.value)}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </label>
                    <label>
                      <span>Do you have a voided check available?</span>
                      <select value={state.voidedCheckAvailable} onChange={(event) => update("voidedCheckAvailable", event.target.value)}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </label>
                  </form>
                ) : null}

                {companyWithDrivers ? (
                  <div className="owner-form-note full">
                    <b>{locale === "es" ? "Conductores vinculados" : "Linked drivers"}</b>
                    <p>{locale === "es" ? "Se revisan en el portal como registros secundarios." : "Review them in the portal as child records."}</p>
                    <label>
                      <span>{locale === "es" ? "Cantidad aproximada" : "Approximate count"}</span>
                      <input
                        value={state.linkedDriversCount}
                        onChange={(event) => update("linkedDriversCount", event.target.value)}
                        placeholder="Example: 3"
                      />
                    </label>
                    <label>
                      <span>{locale === "es" ? "Lista o notas" : "Roster or notes"}</span>
                      <textarea
                        value={state.linkedDriversRoster}
                        onChange={(event) => update("linkedDriversRoster", event.target.value)}
                        placeholder="Driver names, roster notes, dispatch notes..."
                        rows={4}
                      />
                    </label>
                  </div>
                ) : null}
              </div>
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
                <article className="detail-panel">
                  <span>{copy.routeLabel}</span>
                  <b>{route.route}</b>
                  <p>{route.summary}</p>
                </article>
                <article className="detail-panel">
                  <span>{locale === "es" ? "CHECKLIST" : "CHECKLIST"}</span>
                  <ul className="guardrail-list">
                    {uploadChecklist.map(([label, stateLabel]) => (
                      <li key={label}>{label}: {stateLabel}</li>
                    ))}
                  </ul>
                </article>
                <article className="detail-panel full">
                  <span>{copy.reviewTitle}</span>
                  <div className="owner-check-row">
                    <label><input type="checkbox" checked={state.confirmInformationTrue} onChange={(event) => update("confirmInformationTrue", event.target.checked)} /> {locale === "es" ? "Confirmo que la información es correcta." : "I confirm the information is correct."}</label>
                    <label><input type="checkbox" checked={state.confirmContactPermission} onChange={(event) => update("confirmContactPermission", event.target.checked)} /> {locale === "es" ? "Autorizo a JONED a contactarme." : "I authorize JONED to contact me."}</label>
                  </div>
                  <p>{copy.reviewBody}</p>
                </article>
              </div>
            </div>
          ) : null}

          <div className="owner-intake-actions">
            <button type="button" className="ghost-btn" onClick={previousStep} disabled={step === 1}>{copy.footerBack}</button>
            {step < 5 ? (
              <button type="button" className="primary-btn" onClick={nextStep}>{copy.footerNext}</button>
            ) : (
              <button
                type="button"
                className="primary-btn"
                onClick={submitApplication}
                disabled={!state.confirmInformationTrue || !state.confirmContactPermission || submitState === "saving"}
              >
                {submitState === "saving" ? (locale === "es" ? "Enviando..." : "Submitting...") : copy.footerSubmit}
              </button>
            )}
          </div>
          {submitState === "saved" ? (
            <div className="owner-form-note full">
              <b>{locale === "es" ? "Enviado" : "Submitted"}</b>
              <p>{locale === "es" ? "La solicitud quedó lista para revisión." : "The request is ready for review."}</p>
            </div>
          ) : null}
          {submitState === "error" ? (
            <div className="owner-form-note full">
              <b>{locale === "es" ? "Error" : "Error"}</b>
              <p>{locale === "es" ? "Inténtalo de nuevo." : "Please try again."}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
