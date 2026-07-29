"use client";

import { useMemo, useState } from "react";

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
    ["Medical card", cdlRoute ? "Conditional to likely" : "Not shown by default"],
    ["Vehicle registration", "Not shown"],
    ["Commercial authority", businessRoute ? "Conditional" : "Not shown by default"],
    ["Insurance certificate COI", "Not shown"],
    ["W-9", businessRoute ? "Conditional" : "Not shown by default"],
    ["Voided check", businessRoute ? "Conditional" : "Not shown by default"],
  ];
}

export default function DriversPrequalificationForm() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>(initialState);

  const route = useMemo(() => resolveRoute(state), [state]);
  const checklist = useMemo(() => buildChecklist(state), [state]);
  const cdlRoute = state.licensePath === "CDL";

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
        <span>DRIVER PREQUALIFICATION</span>
        <h2>Start the driver intake and we will show the route that fits your profile.</h2>
        <p>
          This is a mock step-based intake only. It does not store applicant data, activate onboarding,
          upload documents, or connect any real system. It exists to validate the public driver flow.
        </p>
      </div>

      <div className="owner-intake-shell">
        <aside className="owner-intake-sidebar">
          <span>APPLICATION FLOW</span>
          <b>Drivers prequalification</b>
          <small>Step {step} of 5</small>
          <div className="owner-step-list">
            {[
              "1. Route questions",
              "2. Applicant information",
              "3. License and compliance",
              "4. Driver readiness",
              "5. Review and submit",
            ].map((item, index) => (
              <div key={item} className={`owner-step-item ${step === index + 1 ? "active" : step > index + 1 ? "done" : ""}`}>
                {item}
              </div>
            ))}
          </div>
          <div className="owner-route-summary">
            <span>Resolved route</span>
            <b>{route.route}</b>
            <small>{route.summary}</small>
          </div>
        </aside>

        <div className="owner-intake-main">
          {step === 1 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 1</span>
                  <h3>Driver route</h3>
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
                  <b>No-vehicle route only</b>
                  <p>This public driver path is structured for applicants entering JONED-managed driving operations without a self-provided vehicle.</p>
                </div>
                <div className="owner-form-note full">
                  <b>Personal or business is allowed</b>
                  <p>You should be able to begin as an individual or through a registered business without creating a barrier at the first step.</p>
                </div>
                <div className="owner-form-note">
                  <b>Current route</b>
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
                <label><span>Business name (if applicable)</span><input value={state.businessName} onChange={(event) => update("businessName", event.target.value)} /></label>
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
                  <b>Helper text</b>
                  <p>{state.applicantKind === "Business" ? "Use your business name when the driver application is linked to a registered company." : "Use your personal legal information if you are applying directly as an individual."}</p>
                </div>
              </form>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 3</span>
                  <h3>License and compliance</h3>
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
                {cdlRoute ? (
                  <>
                    <label><span>CDL class</span><input value={state.cdlClass} onChange={(event) => update("cdlClass", event.target.value)} /></label>
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
                  </>
                ) : (
                  <>
                    <label><span>License category</span><input value={state.nonCdlLicenseCategory} onChange={(event) => update("nonCdlLicenseCategory", event.target.value)} placeholder="Class D, E or state equivalent" /></label>
                    <div className="owner-form-note full">
                      <b>Non-CDL note</b>
                      <p>Not every driver route requires CDL. Non-CDL applicants should still be able to complete intake and move into review.</p>
                    </div>
                  </>
                )}
              </form>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 4</span>
                  <h3>Driver readiness</h3>
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
                  <b>Hidden by design</b>
                  <p>Vehicle registration, insurance, and bring-your-own-unit questions are intentionally excluded from this driver route.</p>
                </div>
              </form>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="module-card">
              <div className="card-head">
                <div>
                  <span>STEP 5</span>
                  <h3>Review and submit</h3>
                </div>
              </div>
              <div className="owner-review-grid">
                <article className="owner-review-card">
                  <span>Resolved route</span>
                  <b>{route.route}</b>
                  <p>{route.summary}</p>
                </article>
                <article className="owner-review-card">
                  <span>Upload expectation</span>
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
                  <span>I confirm the information entered here is for mock review structure and is represented truthfully.</span>
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" checked={state.confirmContactPermission} onChange={(event) => update("confirmContactPermission", event.target.checked)} />
                  <span>I authorize JONED to contact me for follow-up on this application path.</span>
                </label>
                <div className="owner-form-note full">
                  <b>Submission state</b>
                  <p>Submitting here does not create a real application. It validates the future structure for a controlled public intake.</p>
                </div>
              </form>
            </div>
          ) : null}

          <div className="owner-intake-actions">
            <button type="button" className="ghost-link button-link" onClick={previousStep} disabled={step === 1}>
              Back
            </button>
            {step < 5 ? (
              <button type="button" className="primary-cta compact button-link" onClick={nextStep}>
                Continue
              </button>
            ) : (
              <button type="button" className="primary-cta compact button-link">
                Submit mock application
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
