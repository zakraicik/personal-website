import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Portfolio } from "@/components/sections/Portfolio";
import { Skills } from "@/components/sections/Skills";
import { SectionWrapper } from "@/components/SectionWrapper";
import { TimelineSection } from "@/components/sections/Timeline";

export default function Home() {
  return (
    <div className="relative w-full h-full">
      <SectionWrapper id="home">
        <Hero />
      </SectionWrapper>
      <SectionWrapper id="about">
        <About />
      </SectionWrapper>
      <SectionWrapper id="portfolio">
        <Portfolio />
      </SectionWrapper>
      <SectionWrapper id="timeline">
        <TimelineSection />
      </SectionWrapper>
      <SectionWrapper id="skills">
        <Skills />
      </SectionWrapper>
    </div>
  );
}
