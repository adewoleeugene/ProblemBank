'use client';
import { memo } from 'react';

const PrizesSection = memo(function PrizesSection() {
  const benefits = [
    {
      title: 'Cash Prize',
      description: 'Winners receive up to 1.2 million NLE distributed across top teams',
      icon: '💰',
      rotate: -1.5,
    },
    {
      title: 'Mentorship',
      description: 'Access to experienced mentors and AI experts for ongoing guidance',
      icon: '👨‍🏫',
      rotate: 1.2,
    },
    {
      title: 'Pilot Opportunities',
      description: 'Chance to pilot your solution with government agencies and partners',
      icon: '🚀',
      rotate: -0.8,
    },
    {
      title: 'Incubation Support',
      description: 'Post-hackathon incubation and resources to scale your solution',
      icon: '🏢',
      rotate: 1.5,
    },
    {
      title: 'Networking',
      description: 'Connect with AI experts, government officials, and industry leaders',
      icon: '🤝',
      rotate: -1.2,
    },
    {
      title: 'National Recognition',
      description: 'Showcase your innovation at national events and media coverage',
      icon: '📺',
      rotate: 0.9,
    },
  ];

  return (
    <section className="relative z-30 w-full py-20 md:py-24 lg:py-32" style={{ backgroundColor: '#f9f2e9' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Additional Benefits */}
        <div>
          <h3
            className="text-4xl md:text-5xl lg:text-6xl text-center mb-16 uppercase"
            style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
          >
            Beyond Cash Prizes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={benefit.title}
                className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] md:rounded-[34px] p-8"
                style={{
                  backgroundColor: idx % 2 === 0 ? '#fffaf3' : '#f2e8dc',
                  transform: `rotate(${benefit.rotate}deg)`,
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

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-5xl mb-5">{benefit.icon}</div>

                  {/* Title */}
                  <h4
                    className="text-xl md:text-2xl mb-3"
                    style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
                  >
                    {benefit.title}
                  </h4>

                  {/* Description */}
                  <p
                    className="text-base md:text-lg"
                    style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#333', lineHeight: '1.6' }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default PrizesSection;
