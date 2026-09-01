import Hero from "../components/Hero/Hero.jsx";


import EventsPreview from "../components/EventsPreview/EventsPreview.jsx";
import DonateBanner from "../components/DonateBanner/DonateBanner.jsx";
import NewsletterSignup from "../components/NewsletterSignup/NewsletterSignup.jsx";
import TrustStatement from "../components/TrustStatement/TrustStatement.jsx";
import WhatIsGBV from "../components/WhatIsGBV/WhatIsGBV.jsx";
import SupportServices from "../components/SupportServices/SupportServices.jsx";
import SafeSteps from "../components/SafeSteps/SafeSteps.jsx";
import SurvivorVoices from "../components/SurvivorVoices/SurvivorVoices.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStatement />
      <WhatIsGBV />
      <SupportServices />
      <SafeSteps />
      <SurvivorVoices />
      <EventsPreview />
      <DonateBanner />
      <NewsletterSignup />

      {/* Pathway cards, conditions intro, impact stats, featured story,
          events preview, and donate banner get added here next. */}
    </>
  );
}
