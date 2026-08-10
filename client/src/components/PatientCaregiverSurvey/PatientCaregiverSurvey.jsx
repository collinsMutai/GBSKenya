import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";
import "./PatientCaregiverSurvey.css";
const steps = [
  "Patient Information",
  "Diagnosis",
  "Treatment",
  "Financial Impact",
  "Rehabilitation",
  "Current Status",
  "Your Experience",
];

const initialFormData = {
  name: "",
  age: "",
  gender: "",
  county: "",
  diagnosis: "",
  otherDiagnosis: "",
  diagnosisYear: "",

  diagnosisTime: "",
  hospital: "",
  neurologist: "",

  treatment: [],
  otherTreatment: "",
  receivedTreatment: "",
  treatmentReason: [],
  otherTreatmentReason: "",
  treatmentWait: "",
  missedTreatment: "",
  missedTreatmentTimes: "",

  paymentMethod: [],
  otherPaymentMethod: "",
  treatmentCost: "",
  financialDelay: "",

  physiotherapy: "",
  occupationalTherapy: "",
  rehabilitationAvailable: "",

  recovery: "",
  ongoingTreatment: "",

  biggestChallenge: "",
  delayedTreatmentImpact: "",
  improvements: "",
  shareStory: "",
  supportNetwork: "",
};

export default function PatientCaregiverSurvey() {
  const surveyFormRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCheckbox = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name];

      return {
        ...prev,
        [name]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

const scrollToForm = () => {
  setTimeout(() => {
    surveyFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 50);
};

const nextStep = () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep((prev) => prev + 1);
    scrollToForm();
  }
};

const previousStep = () => {
  if (currentStep > 0) {
    setCurrentStep((prev) => prev - 1);
    scrollToForm();
  }
};
  const handleSubmit = (event) => {
    event.preventDefault();

    // Connect this to your backend / form service later.
    console.log("Survey submission:", formData);

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (submitted) {
    return (
      <main className="survey-page">
        <section className="survey-success">
          <div className="container">
            <div className="survey-success__card">
              <div className="survey-success__icon">
                <CheckCircle2 size={56} />
              </div>

              <span className="survey-success__eyebrow">Survey Submitted</span>

              <h1>Thank you for sharing your experience.</h1>

              <p>
                Your response will help GBS Foundation Kenya advocate for
                improved diagnosis, treatment, rehabilitation, and support for
                people living with GBS, CIDP, MMN, and related neurological
                disorders in Kenya.
              </p>

              <button
                type="button"
                className="survey-button survey-button--primary"
                onClick={() => {
                  setFormData(initialFormData);
                  setCurrentStep(0);
                  setSubmitted(false);
                }}
              >
                Complete another survey
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="survey-page">
      {/* ==============================
          Hero
      ============================== */}

      <section className="survey-hero">
        <div className="container survey-hero__inner">
          <div className="survey-hero__icon">
            <ClipboardCheck size={30} />
          </div>

          <span className="survey-hero__eyebrow">GBS Foundation Kenya</span>

          <h1>
            Patient Access to Diagnosis, Treatment and Rehabilitation Survey
          </h1>

          <p className="survey-hero__subtitle">
            For people living with Guillain-Barré Syndrome (GBS), Chronic
            Inflammatory Demyelinating Polyneuropathy (CIDP), Multifocal Motor
            Neuropathy (MMN), and related immune-mediated neurological
            disorders.
          </p>
        </div>
      </section>

      {/* ==============================
          Purpose
      ============================== */}

      <section className="survey-purpose">
        <div className="container">
          <div className="survey-purpose__card">
            <h2>Purpose of this survey</h2>

            <p>
              This survey seeks to understand the experiences of people living
              with GBS, CIDP, MMN, and related conditions in Kenya. The
              information collected will help GBS Foundation Kenya advocate for
              improved diagnosis, access to plasma-derived therapies,
              rehabilitation services, and healthcare policies.
            </p>

            <p>
              All responses will be treated confidentially and used for
              advocacy, research, and healthcare planning.
            </p>
          </div>
        </div>
      </section>

      {/* ==============================
          Survey
      ============================== */}

      <section className="survey-form-section"   ref={surveyFormRef}
>
        <div className="container">
          <div className="survey-form-card">
            {/* Progress */}

            <div className="survey-progress">
              <div className="survey-progress__top">
                <span>
                  Step {currentStep + 1} of {steps.length}
                </span>

                <strong>{steps[currentStep]}</strong>
              </div>

              <div className="survey-progress__bar">
                <div
                  className="survey-progress__fill"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="survey-progress__steps">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`survey-progress__step ${
                      index <= currentStep ? "is-active" : ""
                    }`}
                  >
                    <span>{index + 1}</span>
                    <small>{step}</small>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* ==============================
                  STEP 1
              ============================== */}

              {currentStep === 0 && (
                <div className="survey-step">
                  <div className="survey-step__heading">
                    <span>Section A</span>
                    <h2>Patient Information</h2>
                    <p>
                      Please tell us a little about yourself and your diagnosis.
                    </p>
                  </div>

                  <div className="survey-fields">
                    <Field
                      label="Name"
                      required
                      value={formData.name}
                      onChange={(value) => updateField("name", value)}
                    />

                    <RadioGroup
                      label="Age"
                      required
                      name="age"
                      value={formData.age}
                      options={[
                        "Under 18",
                        "18–30",
                        "31–45",
                        "46–60",
                        "Above 60",
                      ]}
                      onChange={(value) => updateField("age", value)}
                    />

                    <RadioGroup
                      label="Gender"
                      required
                      name="gender"
                      value={formData.gender}
                      options={["Male", "Female", "Prefer not to say"]}
                      onChange={(value) => updateField("gender", value)}
                    />

                    <Field
                      label="County of residence"
                      required
                      value={formData.county}
                      onChange={(value) => updateField("county", value)}
                    />

                    <RadioGroup
                      label="Diagnosis"
                      required
                      name="diagnosis"
                      value={formData.diagnosis}
                      options={["GBS", "CIDP", "MMN", "Other"]}
                      onChange={(value) => updateField("diagnosis", value)}
                    />

                    {formData.diagnosis === "Other" && (
                      <Field
                        label="Please specify your diagnosis"
                        value={formData.otherDiagnosis}
                        onChange={(value) =>
                          updateField("otherDiagnosis", value)
                        }
                      />
                    )}

                    <Field
                      label="Year of diagnosis"
                      type="number"
                      value={formData.diagnosisYear}
                      onChange={(value) => updateField("diagnosisYear", value)}
                    />
                  </div>
                </div>
              )}

              {/* ==============================
                  STEP 2
              ============================== */}

              {currentStep === 1 && (
                <div className="survey-step">
                  <div className="survey-step__heading">
                    <span>Section B</span>
                    <h2>Diagnosis</h2>
                    <p>
                      Help us understand your journey to receiving a diagnosis.
                    </p>
                  </div>

                  <div className="survey-fields">
                    <RadioGroup
                      label="How long did it take to receive the correct diagnosis?"
                      required
                      name="diagnosisTime"
                      value={formData.diagnosisTime}
                      options={[
                        "Less than 1 week",
                        "1–4 weeks",
                        "1–3 months",
                        "More than 3 months",
                      ]}
                      onChange={(value) => updateField("diagnosisTime", value)}
                    />

                    <Field
                      label="Hospital where diagnosed"
                      required
                      value={formData.hospital}
                      onChange={(value) => updateField("hospital", value)}
                    />

                    <RadioGroup
                      label="Were you referred to a neurologist?"
                      required
                      name="neurologist"
                      value={formData.neurologist}
                      options={["Yes", "No"]}
                      onChange={(value) => updateField("neurologist", value)}
                    />
                  </div>
                </div>
              )}

              {/* ==============================
                  STEP 3
              ============================== */}

              {currentStep === 2 && (
                <div className="survey-step">
                  <div className="survey-step__heading">
                    <span>Section C</span>
                    <h2>Treatment</h2>
                    <p>
                      Tell us about the treatment you were prescribed and your
                      access to it.
                    </p>
                  </div>

                  <div className="survey-fields">
                    <CheckboxGroup
                      label="Treatment prescribed"
                      required
                      name="treatment"
                      values={formData.treatment}
                      options={["IVIG", "Plasma Exchange", "Steroids", "Other"]}
                      onChange={(value) => updateCheckbox("treatment", value)}
                    />

                    {formData.treatment.includes("Other") && (
                      <Field
                        label="Other treatment"
                        value={formData.otherTreatment}
                        onChange={(value) =>
                          updateField("otherTreatment", value)
                        }
                      />
                    )}

                    <RadioGroup
                      label="Did you receive the recommended treatment?"
                      required
                      name="receivedTreatment"
                      value={formData.receivedTreatment}
                      options={["Yes", "No"]}
                      onChange={(value) =>
                        updateField("receivedTreatment", value)
                      }
                    />

                    {formData.receivedTreatment === "No" && (
                      <CheckboxGroup
                        label="If no, why?"
                        name="treatmentReason"
                        values={formData.treatmentReason}
                        options={[
                          "Unavailable",
                          "Too expensive",
                          "Not covered by SHA/Insurance",
                          "No specialist",
                          "Other",
                        ]}
                        onChange={(value) =>
                          updateCheckbox("treatmentReason", value)
                        }
                      />
                    )}

                    {formData.treatmentReason.includes("Other") && (
                      <Field
                        label="Other reason"
                        value={formData.otherTreatmentReason}
                        onChange={(value) =>
                          updateField("otherTreatmentReason", value)
                        }
                      />
                    )}

                    <RadioGroup
                      label="How long did you wait?"
                      required
                      name="treatmentWait"
                      value={formData.treatmentWait}
                      options={[
                        "< 1 week",
                        "1–4 weeks",
                        "1–3 months",
                        "> 3 months",
                      ]}
                      onChange={(value) => updateField("treatmentWait", value)}
                    />

                    <RadioGroup
                      label="Have you ever missed treatment because IVIG/plasma therapy was unavailable?"
                      required
                      name="missedTreatment"
                      value={formData.missedTreatment}
                      options={["Yes", "No"]}
                      onChange={(value) =>
                        updateField("missedTreatment", value)
                      }
                    />

                    {formData.missedTreatment === "Yes" && (
                      <Field
                        label="If yes, how many times?"
                        type="number"
                        value={formData.missedTreatmentTimes}
                        onChange={(value) =>
                          updateField("missedTreatmentTimes", value)
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ==============================
                  STEP 4
              ============================== */}

              {currentStep === 3 && (
                <div className="survey-step">
                  <div className="survey-step__heading">
                    <span>Section D</span>
                    <h2>Financial Impact</h2>
                    <p>
                      Help us understand the financial impact of accessing
                      treatment.
                    </p>
                  </div>

                  <div className="survey-fields">
                    <CheckboxGroup
                      label="How did you pay?"
                      required
                      name="paymentMethod"
                      values={formData.paymentMethod}
                      options={[
                        "SHA",
                        "Private Insurance",
                        "Self",
                        "Fundraising",
                        "Family/Friends",
                        "Other",
                      ]}
                      onChange={(value) =>
                        updateCheckbox("paymentMethod", value)
                      }
                    />

                    {formData.paymentMethod.includes("Other") && (
                      <Field
                        label="Other payment method"
                        value={formData.otherPaymentMethod}
                        onChange={(value) =>
                          updateField("otherPaymentMethod", value)
                        }
                      />
                    )}

                    <Field
                      label="Approximate treatment cost (KES)"
                      type="number"
                      value={formData.treatmentCost}
                      onChange={(value) => updateField("treatmentCost", value)}
                    />

                    <RadioGroup
                      label="Did financial challenges delay treatment?"
                      required
                      name="financialDelay"
                      value={formData.financialDelay}
                      options={["Yes", "No"]}
                      onChange={(value) => updateField("financialDelay", value)}
                    />
                  </div>
                </div>
              )}

              {/* ==============================
                  STEP 5
              ============================== */}

              {currentStep === 4 && (
                <div className="survey-step">
                  <div className="survey-step__heading">
                    <span>Section E</span>
                    <h2>Rehabilitation</h2>
                    <p>Tell us about your access to rehabilitation services.</p>
                  </div>

                  <div className="survey-fields">
                    <RadioGroup
                      label="Did you receive physiotherapy?"
                      required
                      name="physiotherapy"
                      value={formData.physiotherapy}
                      options={["Yes", "No"]}
                      onChange={(value) => updateField("physiotherapy", value)}
                    />

                    <RadioGroup
                      label="Did you receive occupational therapy?"
                      required
                      name="occupationalTherapy"
                      value={formData.occupationalTherapy}
                      options={["Yes", "No"]}
                      onChange={(value) =>
                        updateField("occupationalTherapy", value)
                      }
                    />

                    <RadioGroup
                      label="Are rehabilitation services available near you?"
                      required
                      name="rehabilitationAvailable"
                      value={formData.rehabilitationAvailable}
                      options={["Yes", "No"]}
                      onChange={(value) =>
                        updateField("rehabilitationAvailable", value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* ==============================
                  STEP 6
              ============================== */}

              {currentStep === 5 && (
                <div className="survey-step">
                  <div className="survey-step__heading">
                    <span>Section F</span>
                    <h2>Current Status</h2>
                    <p>Tell us about your current recovery and treatment.</p>
                  </div>

                  <div className="survey-fields">
                    <RadioGroup
                      label="Current recovery"
                      required
                      name="recovery"
                      value={formData.recovery}
                      options={[
                        "Fully recovered",
                        "Mostly recovered",
                        "Some disability",
                        "Significant disability",
                      ]}
                      onChange={(value) => updateField("recovery", value)}
                    />

                    <RadioGroup
                      label="Are you currently receiving ongoing treatment?"
                      required
                      name="ongoingTreatment"
                      value={formData.ongoingTreatment}
                      options={["Yes", "No"]}
                      onChange={(value) =>
                        updateField("ongoingTreatment", value)
                      }
                    />
                  </div>
                </div>
              )}

              {/* ==============================
                  STEP 7
              ============================== */}

              {currentStep === 6 && (
                <div className="survey-step">
                  <div className="survey-step__heading">
                    <span>Section G</span>
                    <h2>Your Experience</h2>
                    <p>
                      Your experience can help shape better care and advocacy in
                      Kenya.
                    </p>
                  </div>

                  <div className="survey-fields">
                    <TextArea
                      label="What was the biggest challenge during your treatment journey?"
                      required
                      value={formData.biggestChallenge}
                      onChange={(value) =>
                        updateField("biggestChallenge", value)
                      }
                    />

                    <TextArea
                      label="How has delayed or unavailable treatment affected your life?"
                      required
                      value={formData.delayedTreatmentImpact}
                      onChange={(value) =>
                        updateField("delayedTreatmentImpact", value)
                      }
                    />

                    <TextArea
                      label="What improvements would you like to see in Kenya?"
                      required
                      value={formData.improvements}
                      onChange={(value) => updateField("improvements", value)}
                    />

                    <RadioGroup
                      label="May we share your story anonymously for advocacy?"
                      required
                      name="shareStory"
                      value={formData.shareStory}
                      options={["Yes", "No"]}
                      onChange={(value) => updateField("shareStory", value)}
                    />

                    <RadioGroup
                      label="Would you like to join GBS Foundation Kenya's support network?"
                      required
                      name="supportNetwork"
                      value={formData.supportNetwork}
                      options={["Yes", "No"]}
                      onChange={(value) => updateField("supportNetwork", value)}
                    />
                  </div>
                </div>
              )}

              {/* ==============================
                  Navigation
              ============================== */}

              <div className="survey-navigation">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    className="survey-button survey-button--secondary"
                    onClick={previousStep}
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    className="survey-button survey-button--primary"
                    onClick={nextStep}
                  >
                    Continue
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="survey-button survey-button--primary"
                  >
                    Submit Survey
                    <CheckCircle2 size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   Reusable Form Components
========================================================= */

function Field({ label, required = false, type = "text", value, onChange }) {
  return (
    <div className="survey-field">
      <label>
        {label}
        {required && <span>*</span>}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function RadioGroup({
  label,
  required = false,
  name,
  value,
  options,
  onChange,
}) {
  return (
    <fieldset className="survey-fieldset">
      <legend>
        {label}
        {required && <span>*</span>}
      </legend>

      <div className="survey-options">
        {options.map((option) => (
          <label
            key={option}
            className={`survey-option ${value === option ? "is-selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              required={required && !value}
              onChange={(event) => onChange(event.target.value)}
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxGroup({
  label,
  required = false,
  name,
  values,
  options,
  onChange,
}) {
  return (
    <fieldset className="survey-fieldset">
      <legend>
        {label}
        {required && <span>*</span>}
      </legend>

      <div className="survey-options">
        {options.map((option) => (
          <label
            key={option}
            className={`survey-option ${
              values.includes(option) ? "is-selected" : ""
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={values.includes(option)}
              onChange={() => onChange(option)}
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TextArea({ label, required = false, value, onChange }) {
  return (
    <div className="survey-field">
      <label>
        {label}
        {required && <span>*</span>}
      </label>

      <textarea
        rows="5"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
