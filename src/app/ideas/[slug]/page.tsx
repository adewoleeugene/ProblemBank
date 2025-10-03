import { Navigation } from '../../../components';
import { fetchIdeaBySlug } from '../../../lib/airtable';
import BuildersKitsClient from '../../../components/BuildersKitsClient';

export default async function IdeaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idea = await fetchIdeaBySlug(slug);

  return (
    <div className="min-h-screen bg-[#f9f2e9]">
      <Navigation />
      <main>
        <section className="relative z-30 w-full">
          <div className="mx-auto max-w-3xl px-4 md:px-8 py-16 md:py-20 lg:py-24">
            {!idea ? (
              <div className="text-center">
                <h1 className="text-3xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                  Idea not found
                </h1>
                <p className="mt-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  We couldn\'t locate that idea. Try navigating back to the ideas list.
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-center uppercase tracking-tight text-5xl md:text-6xl lg:text-7xl"
                    style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                  {idea.title}
                </h1>
                {idea.category && (
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
                          style={{ borderColor: '#d8cdbc', color: '#403f3e', backgroundColor: 'transparent' }}>
                      {idea.category}
                    </span>
                  </div>
                )}
                
                {/* Problem & Proposed Solution sections */}
                {idea.problem && typeof idea.problem === 'string' && idea.problem.trim().length > 0 && (
                  <section className="mt-10 text-center">
                    <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                      The Problem
                    </h2>
                    <p className="mt-3  text-lg leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                      {idea.problem}
                    </p>
                  </section>
                )}

                {(() => {
                  const s = typeof idea.solution === 'string' ? idea.solution.trim() : '';
                  const b = typeof idea.blurb === 'string' ? idea.blurb.trim() : '';
                  const solutionText = s.length > 0 ? s : b;
                  const problemText = typeof idea.problem === 'string' && idea.problem.trim().length > 0 ? idea.problem.trim() : idea.title;
                  return solutionText.length > 0 ? (
                    <section className="mt-10 text-center">
                      <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                        Proposed Solution
                      </h2>
                      <p className="mt-3 text-lg leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                        {solutionText}
                      </p>

                      {/* Kits moved to full-width section below */}
                    </section>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </section>
        {/* Full-width Builder's Kits section to match featured cards styling */}
        {idea && (() => {
          const s = typeof idea.solution === 'string' ? idea.solution.trim() : '';
          const b = typeof idea.blurb === 'string' ? idea.blurb.trim() : '';
          const solutionText = s.length > 0 ? s : b;
          const problemText = typeof idea.problem === 'string' && idea.problem.trim().length > 0 ? idea.problem.trim() : idea.title;
          return solutionText.length > 0 ? (
            <section className="relative z-30 w-full -mt-30">
              <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14 lg:py-16">
                <BuildersKitsClient
                  problemText={problemText}
                  solutionText={solutionText}
                  defaultBusinessName={idea.title}
                  category={idea.category || null}
                />
              </div>
            </section>
          ) : null;
        })()}
      </main>
    </div>
  );
}