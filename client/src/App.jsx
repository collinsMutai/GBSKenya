import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageCircle } from "lucide-react";

import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";

/* ==========================================
   ABOUT
========================================== */



/* ==========================================
   SURVIVOR STORIES
========================================== */

import AllStories from "./components/AllStories/AllStories.jsx";
import StoryDetails from "./components/StoryDetails/StoryDetails.jsx";
import StoryEditor from "./components/StoryEditor/StoryEditor.jsx";

/* ==========================================
   SERVICES
========================================== */

import ResourcesHome from "./components/ResourcesHome/ResourcesHome.jsx";
import UnderstandingConditions from "./components/UnderstandingConditions/UnderstandingConditions.jsx";
import DiagnosisTreatment from "./components/DiagnosisTreatment/DiagnosisTreatment.jsx";
import FinancialSupport from "./components/FinancialSupport/FinancialSupport.jsx";
import Rehabilitation from "./components/Rehabilitation/Rehabilitation.jsx";
import MentalHealth from "./components/MentalHealth/MentalHealth.jsx";
import Downloads from "./components/Downloads/Downloads.jsx";
import ResourcesFAQ from "./components/ResourcesFAQ/ResourcesFAQ.jsx";
import GlobalEducation from "./components/GlobalEducation/GlobalEducation.jsx";

/* ==========================================
   CONTACT
========================================== */

import ContactPage from "./components/ContactPage/ContactPage.jsx";

/* ==========================================
   LEGACY / OTHER PAGES
========================================== */

import GetInvolved from "./components/GetInvolved/GetInvolved.jsx";
import EventDetails from "./components/EventDetails/EventDetails.jsx";
import PartnerWithUs from "./components/PartnerWithUs/PartnerWithUs.jsx";
import PatientCaregiverSurvey from "./components/PatientCaregiverSurvey/PatientCaregiverSurvey.jsx";

/* ==========================================
   ADMIN
========================================== */

import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import AdminComments from "./components/AdminComments/AdminComments.jsx";
import AdminStories from "./components/AdminStories/AdminStories.jsx";
import AdminUsers from "./components/AdminUsers/AdminUsers.jsx";
import AdminAuthors from "./components/AdminAuthors/AdminAuthors.jsx";
import AboutPage from "./components/AboutPage/AboutPage.jsx";

/* ==========================================
   COMING SOON
========================================== */

function ComingSoon({ title }) {
  return (
    <div
      className="container section"
      style={{
        minHeight: "40vh",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
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

/* ==========================================
   APP
========================================== */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            PUBLIC WEBSITE
        ========================================== */}

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* ABOUT */}

          <Route path="/about" element={<AboutPage />} />

          

         

          {/* SERVICES */}

          <Route path="/services" element={<ResourcesHome />} />

          <Route
            path="/services/conditions"
            element={<UnderstandingConditions />}
          />

          <Route
            path="/services/diagnosis-treatment"
            element={<DiagnosisTreatment />}
          />

          <Route
            path="/services/financial-support"
            element={<FinancialSupport />}
          />

          <Route path="/services/rehabilitation" element={<Rehabilitation />} />

          <Route path="/services/mental-health" element={<MentalHealth />} />

          <Route path="/services/downloads" element={<Downloads />} />

          <Route path="/services/faq" element={<ResourcesFAQ />} />

          <Route path="/services/global" element={<GlobalEducation />} />

          {/* OLD RESOURCE URLS */}

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

          {/* SURVIVOR STORIES */}

          <Route path="/survivor-stories" element={<AllStories />} />

          <Route path="/survivor-stories/:slug" element={<StoryDetails />} />

          <Route path="/stories" element={<AllStories />} />

          <Route path="/stories/:slug" element={<StoryDetails />} />

          {/* CONTACT */}

          <Route path="/contact" element={<ContactPage />} />

          {/* STORY SUBMISSION */}

          <Route path="/add-story" element={<StoryEditor />} />

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
        </Route>

        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<ComingSoon title="Dashboard Overview" />} />

          <Route path="stories" element={<AdminStories />} />

          <Route path="comments" element={<AdminComments />} />

          <Route path="users" element={<AdminUsers />} />

          <Route path="authors" element={<AdminAuthors />} />

          <Route path="reports" element={<ComingSoon title="Reports" />} />

          <Route path="settings" element={<ComingSoon title="Settings" />} />
        </Route>
      </Routes>

      {/* ==========================================
          FLOATING WHATSAPP
      ========================================== */}

      <a
        href="https://wa.me/254700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={25} strokeWidth={2.2} />

        <span className="whatsapp-float__pulse" />
      </a>

      {/* ==========================================
          TOAST NOTIFICATIONS
      ========================================== */}

      <ToastContainer position="bottom-right" autoClose={4000} />
    </BrowserRouter>
  );
}
