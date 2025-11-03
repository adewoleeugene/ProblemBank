'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Problem Bank?",
    answer: "Problem Bank is a platform designed to help builders, innovators, and entrepreneurs in Sierra Leone find and solve important national problems. It provides a curated list of challenges, project ideas, and \"Builder's Kits\" to help you get started quickly."
  },
  {
    question: "Who is this platform for?",
    answer: "It's for everyone! Whether you're a student, a seasoned developer, a business professional, or just someone passionate about building a better Sierra Leone, this platform has resources to help you."
  },
  {
    question: "Do I need to have my own idea to use this site?",
    answer: "For the hackathon, the problems and ideas are provided. You must choose a challenge from the Problem Bank to work on. This ensures that all teams are focused on solving a curated set of high-impact national priorities."
  },
  {
    question: "What are \"Builder's Kits\" and why are there different types?",
    answer: "Builder's Kits are step-by-step guides and templates that help you achieve specific outcomes for your project, like creating a brand, a product plan, or a pitch deck. There are different kits because building a successful project requires different skills and deliverables at each stage."
  },
  {
    question: "What's included in a Builder's Kit?",
    answer: "Kits typically include a mix of fill-in-the-blank templates, practical playbooks, checklists, and pre-written examples to help you produce professional-grade work quickly."
  },
  {
    question: "How do I choose the right kit for my project?",
    answer: "Choose the kit that matches your immediate goal. If you're planning your product, start with the PRD Kit. If you're preparing to pitch to investors, use the Pitch Master Kit. If you need a logo and brand identity, use the Branding Kit."
  },
  {
    question: "Is there a cost to use the platform?",
    answer: "No, all resources on the Problem Bank, including the ideas and Builder's Kits, are free to use."
  },
  {
    question: "Are there any eligibility requirements to participate?",
    answer: "You have to have registered for the hackathon."
  }
];

// Breakpoint-aware intensity: full on desktop, 40% under md (<= 767px), disabled under sm (<= 639px)
function useBreakpointIntensity() {
  const [intensity, setIntensity] = useState(1);
  React.useEffect(() => {
    const sm = window.matchMedia('(max-width: 639px)');
    const md = window.matchMedia('(max-width: 767px)');
    const update = () => {
      if (sm.matches) setIntensity(0);
      else if (md.matches) setIntensity(0.4);
      else setIntensity(1);
    };
    update();
    sm.addEventListener('change', update);
    md.addEventListener('change', update);
    return () => {
      sm.removeEventListener('change', update);
      md.removeEventListener('change', update);
    };
  }, []);
  return intensity;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const intensity = useBreakpointIntensity();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  
  // Helper to scale values by intensity
  const scale = (v: number) => v * intensity;

  // Heading line parallax (0.8x, 1.0x, 1.2x speeds)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, scale(-40)]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, scale(-50)]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, scale(-60)]);

  const r1 = useTransform(scrollYProgress, [0, 1], [0, scale(-2)]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, scale(0)]);
  const r3 = useTransform(scrollYProgress, [0, 1], [0, scale(2)]);

  // Rotation angles for FAQ cards (reduced tilt)
  const rotations = [-0.8, 0.6, -0.5, -0.3, 0.7, -0.6, 0.5, -0.2];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-40 w-full py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#f9f2e9' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div ref={ref}>
          <div className="py-16 md:py-20">
            {/* Heading */}
            <div className="relative flex flex-col items-center text-center select-none">
              <motion.div style={{ y: y1, rotate: r1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
                <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e', display: 'block', transform: 'rotate(-2deg)' }}>
                  FREQUENTLY
                </span>
              </motion.div>
              <motion.div style={{ y: y2, rotate: r2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
                <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e', display: 'block', transform: 'rotate(0.8deg)' }}>
                  ASKED
                </span>
              </motion.div>
              <motion.div style={{ y: y3, rotate: r3 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-none mb-8 md:mb-12">
                <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e', display: 'block', transform: 'rotate(-2deg)' }}>
                  QUESTIONS
                </span>
              </motion.div>
            </div>

            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="transform" style={{ transform: `rotate(${rotations[index]}deg)` }}>
                  <div className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] md:rounded-[34px] lg:rounded-[38px]"
                    style={{
                      backgroundColor: index % 2 === 0 ? '#fffaf3' : '#f2e8dc',
                    }}
                  >
                    {/* Speckled texture overlay */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                        backgroundSize: '200px 200px',
                        backgroundRepeat: 'repeat',
                      }}
                    />
                    
                    {/* Question Button */}
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="relative w-full px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-[#d8cdbc] focus:ring-inset"
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-lg md:text-xl pr-4"
                          style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e' }}
                        >
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: openIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex-shrink-0"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: '#403f3e' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </button>

                    {/* Answer Content */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: openIndex === index ? 'auto' : 0,
                        opacity: openIndex === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-[#d8cdbc] pt-4">
                          <p
                            className="text-sm md:text-base leading-relaxed"
                            style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e', fontWeight: 600 }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
