'use client';
import { memo } from 'react';
import Link from 'next/link';

const ApplicationCTA = memo(function ApplicationCTA() {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Track',
      description: 'Select between AI Pulse (no-code) or DeepStack (advanced development)',
      icon: '🎯',
    },
    {
      number: '02',
      title: 'Complete Application',
      description: 'Fill out the online form with your details and team information',
      icon: '📝',
    },
    {
      number: '03',
      title: 'Submit Your Idea',
      description: 'Provide a concise summary of your proposed solution',
      icon: '💡',
    },
    {
      number: '04',
      title: 'Await Notification',
      description: 'Shortlisted candidates will be notified by October 10, 2025',
      icon: '📧',
    },
  ];

  return (
    <section className="relative z-30 w-full py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#f9f2e9' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Heading */}
        <div className="relative flex flex-col items-center text-center select-none mb-12">
          <div className="text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
            <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e', display: 'block', transform: 'rotate(-2deg)' }}>
              HOW TO
            </span>
          </div>
          <div className="text-5xl md:text-6xl lg:text-7xl uppercase leading-none mb-6">
            <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e', display: 'block', transform: 'rotate(1.5deg)' }}>
              APPLY
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative border border-[#e8ddd0] shadow-sm overflow-hidden rounded-[28px] p-6 md:p-8"
              style={{
                backgroundColor: idx % 2 === 0 ? '#fffaf3' : '#f2e8dc',
                transform: `rotate(${idx % 2 === 0 ? -1.5 : 1.5}deg)`,
              }}
            >
              {/* Noise overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                  backgroundSize: '200px 200px',
                  backgroundRepeat: 'repeat',
                }}
              />

              <div className="relative z-10 text-center">
                {/* Number Badge */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                  style={{ backgroundColor: '#E6B800' }}
                >
                  <span
                    style={{
                      fontFamily: 'Decoy, sans-serif',
                      fontWeight: 500,
                      fontSize: '1.25rem',
                      color: '#1e1e1e',
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="text-4xl mb-3">{step.icon}</div>

                {/* Title */}
                <h3
                  className="text-xl md:text-2xl mb-3"
                  style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e' }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm md:text-base"
                  style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main CTA Card */}
        <div className="max-w-4xl mx-auto">
          <div
            className="relative border border-[#e8ddd0] shadow-xl overflow-hidden rounded-[28px] md:rounded-[40px] bg-[#121212] p-8 md:p-12 text-center"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {/* Noise overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                backgroundSize: '200px 200px',
                backgroundRepeat: 'repeat',
              }}
            />

            <div className="relative z-10">
              {/* Deadline Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#E6B800] px-4 py-2 mb-6 bg-[#E6B800]">
                <span
                  className="inline-block"
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: '#1e1e1e',
                    WebkitMaskImage: 'url(/images/calendar-blank.svg)',
                    maskImage: 'url(/images/calendar-blank.svg)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
                <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#1e1e1e' }}>
                  Applications Open: Sept 1 – Oct 14, 2025
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-3xl md:text-4xl lg:text-5xl mb-4"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#f7efe3' }}
              >
                READY TO BUILD THE FUTURE?
              </h3>

              {/* Description */}
              <p
                className="text-base md:text-lg mb-8 max-w-2xl mx-auto"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#f7efe3' }}
              >
                Join Sierra Leone&apos;s most ambitious hackathon. Submit your application today and be part
                of the movement transforming our nation through AI and blockchain innovation.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://mocti.gov.sl/ai-challenge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden inline-block px-8 py-4 rounded-full bg-[#E6B800] text-white font-medium text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                      backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                      backgroundSize: '200px 200px',
                      backgroundRepeat: 'repeat'
                    }}
                  />
                  <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 rounded-full" />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[#1e1e1e]">
                    Apply Now →
                  </span>
                </a>

                 <Link
                   href="/ideas"
                   className="group relative overflow-hidden inline-block px-8 py-4 rounded-full border-2 border-[#f7efe3] text-[#f7efe3] font-medium text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                 >
                  <div
                    className="absolute inset-0 opacity-10 mix-blend-overlay"
                    style={{
                      backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                      backgroundSize: '200px 200px',
                      backgroundRepeat: 'repeat'
                    }}
                  />
                  <div className="absolute inset-0 bg-[#f7efe3] transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 rounded-full" />
                   <span className="relative z-10 transition-colors duration-300 group-hover:text-[#1e1e1e]">
                     Browse Ideas
                   </span>
                 </Link>
              </div>

              {/* Additional Info */}
              <p
                className="text-sm mt-6"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#f7efe3', opacity: 0.8 }}
              >
                Questions? Visit the official MoCTI website or join our Discord community for support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ApplicationCTA;
