import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageCircle } from "lucide-react";

import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";

/* ==========================================
   SURVIVOR STORIES
========================================== */

import AllStories from "./components/AllStories/AllStories.jsx";
import StoryDetails from "./components/StoryDetails/StoryDetails.jsx";
import StoryEditor from "./components/StoryEditor/StoryEditor.jsx";

/* ==========================================
   SERVICES
========================================== */

import ServicesPage from "./components/ServicesPage/ServicesPage.jsx";

/* ==========================================
   ABOUT
========================================== */

import AboutPage from "./components/AboutPage/AboutPage.jsx";

/* ==========================================
   CONTACT
========================================== */

import ContactPage from "./components/ContactPage/ContactPage.jsx";

/* ==========================================
   OTHER PAGES
========================================== */


import EventDetails from "./components/EventDetails/EventDetails.jsx";


/* ==========================================
   USER DASHBOARD
========================================== */

// import UserDashboard from "./components/UserDashboard/UserDashboard.jsx";

/* ==========================================
   ADMIN DASHBOARD
========================================== */

import RequireAdmin from "./components/Requireadmin/Requireadmin.jsx";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import AdminOverview from "./components/Adminoverview/Adminoverview.jsx";
import AdminComments from "./components/AdminComments/AdminComments.jsx";
import AdminStories from "./components/AdminStories/AdminStories.jsx";
import AdminUsers from "./components/AdminUsers/AdminUsers.jsx";
import AdminAuthors from "./components/AdminAuthors/AdminAuthors.jsx";

/* ==========================================
   AUTHOR DASHBOARD
========================================== */

import RequireAuthor from "./components/RequireAuthor/RequireAuthor.jsx";
import AuthorDashboard from "./components/AuthorDashboard/AuthorDashboard.jsx";
import AuthorOverview from "./components/Adminoverview/Adminoverview.jsx";
import AuthorStories from "./components/Authorstories/Authorstories.jsx";
import AuthorProfilePage from "./components/Authorprofilepage/Authorprofilepage.jsx";

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

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* ABOUT */}
          <Route path="/about" element={<AboutPage />} />

          {/* SERVICES */}
          <Route path="/services" element={<ServicesPage />} />

          {/* ========================================
              SURVIVOR STORIES
          ======================================== */}

          <Route
            path="/survivor-stories"
            element={<AllStories />}
          />

          <Route
            path="/survivor-stories/:slug"
            element={<StoryDetails />}
          />

          {/* Legacy story URLs */}

          <Route
            path="/stories"
            element={<AllStories />}
          />

          <Route
            path="/stories/:slug"
            element={<StoryDetails />}
          />

          {/* ========================================
              CONTACT
          ======================================== */}

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* ========================================
              STORY SUBMISSION
          ======================================== */}

          <Route
            path="/add-story"
            element={<StoryEditor />}
          />

          {/* ========================================
              GET INVOLVED
          ======================================== */}

         

          <Route
            path="/get-involved/events/:slug"
            element={<EventDetails />}
          />

       
          <Route
            path="/get-involved/donate"
            element={<ComingSoon title="Donate" />}
          />

        </Route>

        {/* ==========================================
            USER DASHBOARD
        ========================================== */}

        {/* <Route
          path="/dashboard"
          element={<UserDashboard />}
        /> */}

        {/* ==========================================
            AUTHOR DASHBOARD
        ========================================== */}

        <Route
          path="/author"
          element={<RequireAuthor />}
        >
          <Route element={<AuthorDashboard />}>

            {/* /author */}
            <Route
              index
              element={<AuthorOverview />}
            />

            {/* /author/stories */}
            <Route
              path="stories"
              element={<AuthorStories />}
            />

            {/* /author/profile */}
            <Route
              path="profile"
              element={<AuthorProfilePage />}
            />

            {/* Future author pages */}
            <Route
              path="comments"
              element={<ComingSoon title="Comments" />}
            />

            <Route
              path="settings"
              element={<ComingSoon title="Settings" />}
            />

          </Route>
        </Route>

        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route
          path="/admin"
          element={<RequireAdmin />}
        >
          <Route element={<AdminDashboard />}>

            {/* /admin */}
            <Route
              index
              element={<AdminOverview />}
            />

            {/* /admin/stories */}
            <Route
              path="stories"
              element={<AdminStories />}
            />

            {/* /admin/comments */}
            <Route
              path="comments"
              element={<AdminComments />}
            />

            {/* /admin/users */}
            <Route
              path="users"
              element={<AdminUsers />}
            />

            {/* /admin/authors */}
            <Route
              path="authors"
              element={<AdminAuthors />}
            />

            {/* /admin/reports */}
            <Route
              path="reports"
              element={<ComingSoon title="Reports" />}
            />

            {/* /admin/settings */}
            <Route
              path="settings"
              element={<ComingSoon title="Settings" />}
            />

          </Route>
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
        <MessageCircle
          size={25}
          strokeWidth={2.2}
        />

        <span className="whatsapp-float__pulse" />
      </a>

      {/* ==========================================
          TOAST NOTIFICATIONS
      ========================================== */}

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
      />

    </BrowserRouter>
  );
}