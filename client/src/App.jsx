import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import WhoWeAre from "./components/WhoWeAre/WhoWeAre.jsx";
import Leadership from "./components/Leadership/Leadership.jsx";
import MedicalAdvisoryBoard from "./components/MedicalAdvisoryBoard/MedicalAdvisoryBoard.jsx";
import ResilienceStories from "./components/ResilienceStories/ResilienceStories.jsx";
import StoryDetails from "./components/StoryDetails/StoryDetails.jsx";
import ResourcesHome from "./components/ResourcesHome/ResourcesHome.jsx";
import UnderstandingConditions from "./components/UnderstandingConditions/UnderstandingConditions.jsx";

// Placeholder for pages not yet built — keeps nav links from breaking
// while About, Resilience Stories, Resources, and Contact get built out.
function ComingSoon({ title }) {
  return (
    <div className="container section" style={{ minHeight: "40vh" }}>
      <p className="eyebrow">Under construction</p>
      <h2 style={{ marginTop: 10 }}>{title}</h2>
      <p style={{ marginTop: 12, color: "var(--ink-700)" }}>
        This page is next on the build list.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about/who-we-are" element={<WhoWeAre />} />
          <Route path="/about/leadership" element={<Leadership />} />
          <Route
            path="/about/medical-advisory-board"
            element={<MedicalAdvisoryBoard />}
          />
          <Route path="/stories" element={<ResilienceStories />} />
          <Route path="/stories/:slug" element={<StoryDetails />} />
          <Route path="/resources" element={<ResourcesHome />} />
          <Route
            path="/resources/conditions"
            element={<UnderstandingConditions />}
          />
          <Route path="/contact" element={<ComingSoon title="Contact us" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
