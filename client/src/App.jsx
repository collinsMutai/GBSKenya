import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";

import WhoWeAre from "./components/WhoWeAre/WhoWeAre.jsx";
import Leadership from "./components/Leadership/Leadership.jsx";
import MedicalAdvisoryBoard from "./components/MedicalAdvisoryBoard/MedicalAdvisoryBoard.jsx";

import ResilienceStories from "./components/ResilienceStories/ResilienceStories.jsx";
import StoryDetails from "./components/StoryDetails/StoryDetails.jsx";

import ResourcesHome from "./components/ResourcesHome/ResourcesHome.jsx";
import UnderstandingConditions from "./components/UnderstandingConditions/UnderstandingConditions.jsx";
import DiagnosisTreatment from "./components/DiagnosisTreatment/DiagnosisTreatment.jsx";
import FinancialSupport from "./components/FinancialSupport/FinancialSupport.jsx";
import Rehabilitation from "./components/Rehabilitation/Rehabilitation.jsx";
import MentalHealth from "./components/MentalHealth/MentalHealth.jsx";
import Downloads from "./components/Downloads/Downloads.jsx";
import ResourcesFAQ from "./components/ResourcesFAQ/ResourcesFAQ.jsx";
import GlobalEducation from "./components/GlobalEducation/GlobalEducation.jsx";

import ContactPage from "./components/ContactPage/ContactPage.jsx";

// Get Involved
import GetInvolved from "./components/GetInvolved/GetInvolved.jsx";
import EventDetails from "./components/EventDetails/EventDetails.jsx";
import PartnerWithUs from "./components/PartnerWithUs/PartnerWithUs.jsx";
import PatientCaregiverSurvey from "./components/PatientCaregiverSurvey/PatientCaregiverSurvey.jsx";
import AllStories from "./components/AllStories/AllStories.jsx";
import StoryEditor from "./components/StoryEditor/StoryEditor.jsx";

// Admin
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import AdminComments from "./components/AdminComments/AdminComments.jsx";
import AdminStories from "./components/AdminStories/AdminStories.jsx";

function ComingSoon({ title }) {
  return (
    <div className="container section" style={{ minHeight: "40vh" }}>
      <h2 style={{ marginTop: 10 }}>{title}</h2>

      <p
        style={{
          marginTop: 12,
          color: "var(--ink-700)",
        }}
      >
        This page is next on the build list.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            PUBLIC WEBSITE
        ========================================== */}

        <Route element={<Layout />}>
          {/* HOME */}

          <Route path="/" element={<Home />} />

          {/* ABOUT */}

          <Route path="/about/who-we-are" element={<WhoWeAre />} />

          <Route path="/about/leadership" element={<Leadership />} />

          <Route
            path="/about/medical-advisory-board"
            element={<MedicalAdvisoryBoard />}
          />

          {/* STORIES */}

          <Route path="/stories" element={<AllStories />} />

          <Route path="/stories/:slug" element={<StoryDetails />} />

          {/* RESOURCES */}

          <Route path="/resources" element={<ResourcesHome />} />

          <Route
            path="/resources/conditions"
            element={<UnderstandingConditions />}
          />

          <Route
            path="/resources/diagnosis-treatment"
            element={<DiagnosisTreatment />}
          />

          <Route
            path="/resources/financial-support"
            element={<FinancialSupport />}
          />

          <Route
            path="/resources/rehabilitation"
            element={<Rehabilitation />}
          />

          <Route path="/resources/mental-health" element={<MentalHealth />} />

          <Route path="/resources/downloads" element={<Downloads />} />

          <Route path="/resources/faq" element={<ResourcesFAQ />} />

          <Route path="/resources/global" element={<GlobalEducation />} />

          {/* GET INVOLVED */}

          <Route path="/get-involved" element={<GetInvolved />} />

          <Route path="/get-involved/events/:slug" element={<EventDetails />} />

          <Route
            path="/get-involved/patient-caregiver-survey"
            element={<PatientCaregiverSurvey />}
          />

          <Route
            path="/get-involved/partner-with-us"
            element={<PartnerWithUs />}
          />

          <Route
            path="/get-involved/donate"
            element={<ComingSoon title="Donate" />}
          />

          {/* CONTACT */}

          <Route path="/contact" element={<ContactPage />} />

          {/* ADD STORY */}

          <Route path="/add-story" element={<StoryEditor />} />
        </Route>

        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<ComingSoon title="Dashboard Overview" />} />

          <Route path="stories" element={<AdminStories />} />

          <Route path="comments" element={<AdminComments />} />

          <Route path="users" element={<ComingSoon title="Manage Users" />} />

          <Route
            path="authors"
            element={<ComingSoon title="Manage Authors" />}
          />

          <Route path="reports" element={<ComingSoon title="Reports" />} />

          <Route path="settings" element={<ComingSoon title="Settings" />} />
        </Route>
      </Routes>

      <ToastContainer position="bottom-right" autoClose={4000} />
    </BrowserRouter>
  );
}