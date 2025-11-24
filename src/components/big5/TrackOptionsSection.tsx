'use client';
import { memo } from 'react';

const TrackOptionsSection = memo(function TrackOptionsSection() {
  const tracks = [
    {
      title: 'AI PULSE',
      subtitle: 'No-Code/Low-Code Track',
      description: 'Use these tools to design smart, simple solutions leveraging no-code/low-code platforms—no advanced coding required.',
      features: [
        'Perfect for beginners and non-technical innovators',
        'Use platforms like v0, Lovable, and ChatGPT',
        'Focus on creativity and problem-solving',
        'Rapid prototyping and iteration',
      ],
      tools: ['v0', 'Lovable', 'ChatGPT'],
      icon: '⚡',
      color: '#fffaf3',
      rotate: -2,
    },
    {
      title: 'DEEPSTACK',
      subtitle: 'Advanced Development Track',
      description: 'For developers integrating AI or blockchain fundamentally into solutions using advanced frameworks and technologies.',
      features: [
        'Advanced coding and technical implementation',
        'Deep AI/blockchain integration',
        'Build scalable, production-ready solutions',
      ],
      tools: ['Python', 'TensorFlow', 'Hugging Face', 'OpenAI APIs', 'Blockchain SDKs'],
      icon: '🔥',
      color: '#f2e8dc',
      rotate: 2,
    },
  ];

  return (
    <section className="relative z-40 w-full py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="bg-[#1e1e1e] overflow-hidden rounded-[32px] md:rounded-[40px] border-2 border-[#333] shadow-2xl">
          <div className="px-6 md:px-12 py-20 md:py-24 lg:py-28">
             {/* Heading */}
             <div className="relative flex flex-col items-center text-center select-none mb-8">
               <div className="text-5xl md:text-6xl lg:text-7xl uppercase leading-tight">
                 <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#f9f2e9', display: 'block', transform: 'rotate(-1deg)' }}>
                   CHOOSE YOUR
                 </span>
               </div>
               <div className="text-5xl md:text-6xl lg:text-7xl uppercase leading-tight">
                 <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#f9f2e9', display: 'block', transform: 'rotate(0.5deg)' }}>
                   TRACK
                 </span>
               </div>
             </div>

             {/* Subtitle */}
             <p
               className="text-center text-lg md:text-xl max-w-3xl mx-auto mb-16"
               style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#f9f2e9', lineHeight: '1.6' }}
             >
               Select the track that matches your skill level and interests.<br />
               Both tracks tackle the same Big 5 challenges<br />
               with different technical approaches.
             </p>

            {/* Track Cards */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
              {tracks.map((track) => (
                <div
                  key={track.title}
                  className="relative border-2 border-[#1e1e1e] shadow-xl overflow-hidden rounded-[28px] md:rounded-[32px] transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full lg:w-[calc(50%-2rem)]"
                  style={{
                    backgroundColor: track.color,
                    transform: `rotate(${track.rotate * 0.5}deg)`,
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

                  <div className="relative z-10 p-10 md:p-12">
                    {/* Icon */}
                    <div className="text-5xl md:text-6xl mb-6">{track.icon}</div>

                    {/* Title */}
                    <h3
                      className="text-3xl md:text-4xl mb-3"
                      style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
                    >
                      {track.title}
                    </h3>

                    {/* Subtitle */}
                    <p
                      className="text-base md:text-lg mb-6"
                      style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#E6B800' }}
                    >
                      {track.subtitle}
                    </p>

                    {/* Description */}
                    <p
                      className="text-base md:text-lg mb-8"
                      style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#333', lineHeight: '1.6' }}
                    >
                      {track.description}
                    </p>

                    {/* Features */}
                    <div className="mb-0">
                      <h4
                        className="text-sm uppercase mb-4"
                        style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#1e1e1e', letterSpacing: '0.1em' }}
                      >
                        What You&apos;ll Do:
                      </h4>
                      <ul className="space-y-3">
                        {track.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3"
                            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#333' }}
                          >
                            <span className="text-[#E6B800] mt-0.5 text-xl font-bold">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                     </div>



                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default TrackOptionsSection;
