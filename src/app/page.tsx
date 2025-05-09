import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Portfolio } from "@/components/sections/Portfolio";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { SectionWrapper } from "@/components/SectionWrapper";

export default function Home() {
  return (
    <>
      <SectionWrapper id="home">
        <Hero />
      </SectionWrapper>
      <SectionWrapper id="about">
        <About />
      </SectionWrapper>
      <SectionWrapper id="skills">
        <Skills />
      </SectionWrapper>
      <SectionWrapper id="portfolio">
        <Portfolio />
      </SectionWrapper>
      <SectionWrapper id="experience">
        <Experience />
      </SectionWrapper>
      <SectionWrapper id="contact">
        <Contact />
      </SectionWrapper>
    </>
  );
}
