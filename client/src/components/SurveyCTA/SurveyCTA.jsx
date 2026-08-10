
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import "./SurveyCTA.css";

export default function SurveyCTA() {
  return (
    <section className="survey-cta" aria-labelledby="survey-cta-title">
      <div className="container survey-cta__inner">
        <div className="survey-cta__icon">
          <ClipboardCheck size={30} strokeWidth={1.8} />
        </div>

        <div className="survey-cta__content">
          <span className="survey-cta__eyebrow">
            Patient &amp; Caregiver Survey
          </span>

          <h2 id="survey-cta-title" className="survey-cta__title">
            Your experience matters.
          </h2>

          <p className="survey-cta__text">
            Complete our Patient &amp; Caregiver Questionnaire to help improve
            treatment, support services, and advocacy for people affected by
            GBS, CIDP, and related neuropathies.
          </p>
        </div>

        <div className="survey-cta__action">
          <Link
            to="/get-involved/patient-caregiver-survey"
            className="survey-cta__button"
          >
            Take the Survey
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

