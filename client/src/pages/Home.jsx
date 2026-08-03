import Hero from '../components/Hero/Hero.jsx'
import PathwayCards from '../components/PathwayCards/PathwayCards.jsx'
import ConditionsIntro from '../components/Conditions/Conditions.jsx'
import ImpactStats from '../components/ImpactStats/ImpactStats.jsx'
import FeaturedStory from '../components/FeaturedStory/FeaturedStory.jsx'
import EventsPreview from '../components/EventsPreview/EventsPreview.jsx'
import DonateBanner from '../components/DonateBanner/DonateBanner.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <PathwayCards />
      <ConditionsIntro />
      <ImpactStats />
      <FeaturedStory />
      <EventsPreview />
      <DonateBanner />
      {/* Pathway cards, conditions intro, impact stats, featured story,
          events preview, and donate banner get added here next. */}
    </>
  )
}