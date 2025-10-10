import { Navigation } from '../../components';
import { fetchIdeasPage, fetchAllCategories } from '../../lib/airtable';
import Link from 'next/link';
import IdeasInfiniteLoader from './InfiniteLoader';

// Category captions mapping
const CATEGORY_CAPTIONS: Record<string, string> = {
  'All': 'The Big 5: Pillars of Sierra Leone\'s National Transformation',
  'Feed Salone': 'This initiative aims to revolutionize Sierra Leone\'s agricultural sector by leveraging AI and other technologies to boost food security, increase production, and build resilience against climate change.',
  'Human Capital Development': 'By leveraging inclusive educational technology (EdTech), this initiative is empowering Sierra Leoneans with the skills needed to thrive in the digital age, ensuring a competitive and future-ready workforce.',
  'Youth Employment Scheme': 'The YES! initiative aims to combat youth unemployment by fostering the gig economy and building robust digital employment platforms to connect young Sierra Leoneans with local and global opportunities.',
  'Public Service Architecture Revamp': 'Centered on the comprehensive reform of public administration, this initiative establishes a new standard of governance through digital transformation. The core objective is to improve the citizen-government relationship by implementing a secure Digital ID system, creating a foundation for efficient and transparent services.',
  'Tech and Infrastructure': 'As the enabling pillar for all national priorities, this initiative is dedicated to developing a resilient and scalable digital infrastructure. The strategy involves implementing blockchain technology to guarantee transparency and applying AI to optimize efficiency, creating a secure foundation for a modern, digital-first economy.',
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function getCategoryIcon(label?: string): string {
  const CATEGORY_ICON_MAP: Record<string, string> = {
    'Feed Salone': '/images/6707c6af78a3dd5acec5512e_flower_64.webp',
    'Human Capital Development': '/images/6707c6b0778d2c6671252c5f_book_64.webp',
    'Youth Employment Scheme': '/images/6708d7e1e82809f4e18f8e05_flag_120.webp',
    'Public Service Architecture Revamp': '/images/6708d8d8f169898f7bd83ed0_heart_120.webp',
    'Tech and Infrastructure': '/images/6708d8d83911c95f3000bbfa_star_120.webp',
  };
  const FALLBACK_ICON = '/images/6708d8d8b17e6d52f343b0d3_coffee_120.webp';
  if (!label) return FALLBACK_ICON;
  return CATEGORY_ICON_MAP[label] || FALLBACK_ICON;
}

// Compute background color in blocks of four, alternating block start color
function getBackgroundForGlobalIndex(index1Based: number): string {
  const LIGHT = '#fffaf3';
  const DARK = '#f2e8dc';
  const block = Math.floor((index1Based - 1) / 4); // 0-based block
  const startIsLight = block % 2 === 0; // even block starts light, odd block starts dark
  const pos = (index1Based - 1) % 4; // position within block 0..3
  const isLight = startIsLight ? (pos % 2 === 0) : (pos % 2 === 1);
  return isLight ? LIGHT : DARK;
}

// Compute rotation angle per global index with block-wise sign alternation
function getRotationAngleForGlobalIndex(index1Based: number): number {
  const baseAngles = [-2, 1.4, -1.2, 1.8];
  const pos = (index1Based - 1) % 4;
  const block = Math.floor((index1Based - 1) / 4);
  const angle = baseAngles[pos];
  return block % 2 === 0 ? angle : -angle;
}

export default async function IdeasPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const categoriesCsv = (searchParams?.categories as string) || '';
  const categories = categoriesCsv.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

  // Server-side rendering: fetch first page with filters
  const { items, offset } = await fetchIdeasPage(16, undefined, categories.length ? categories : undefined);

  // Dynamic chips from Airtable
  const allCats = await fetchAllCategories();

  // active map for highlighting
  const active = new Set(categories);

  // Build chip links: multi-select OR via CSV param
  const chipHref = (label: string): string => {
    if (label === 'All') return '/ideas';
    const next = new Set(active);
    if (next.has(label)) next.delete(label); else next.add(label);
    const values = Array.from(next);
    const qs = values.length ? `?categories=${encodeURIComponent(values.join(','))}` : '';
    return `/ideas${qs}`;
  };

  // SSR global index starts at 1 for the first item on a filtered page
  const initialCount = items.length;

  return (
    <div className="min-h-screen bg-[#f9f2e9]">
      <Navigation />

      <main>
        {/* Header */}
        <section className="relative z-30 w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20 lg:py-24">
            <h1
              className="text-center uppercase tracking-tight text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}
            >
              <div>All</div> <div>Ideas</div>
            </h1>

            {/* Filtering UI (chips) - dynamic from Airtable */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {/* All chip */}
              <Link
                href={chipHref('All')}
                className={`px-3 py-1 rounded-full border text-sm ${active.size === 0 ? 'ring-2 ring-[#d8cdbc]' : ''}`}
                style={{ borderColor: '#d8cdbc', color: '#403f3e', backgroundColor: active.size === 0 ? '#f2e8dc' : '#fffaf3' }}
              >
                All
              </Link>
              {allCats.map((label) => (
                <Link
                  key={label}
                  href={chipHref(label)}
                  className={`px-3 py-1 rounded-full border text-sm ${active.has(label) ? 'ring-2 ring-[#d8cdbc]' : ''}`}
                  style={{ borderColor: '#d8cdbc', color: '#403f3e', backgroundColor: active.has(label) ? '#f2e8dc' : '#fffaf3' }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Category Caption */}
            {(categories.length > 0 || active.size === 0) && (
              <div className="mt-6 text-center max-w-2xl mx-auto">
                <p 
                  className="text-lg md:text-xl"
                  style={{ 
                    fontFamily: 'Raleway, sans-serif', 
                    color: '#403f3e',
                    fontStyle: 'italic' 
                  }}
                >
                  {categories.length === 0 
                    ? CATEGORY_CAPTIONS['All']
                    : categories.length === 1 
                      ? CATEGORY_CAPTIONS[categories[0]]
                      : `Cross-cutting solutions spanning ${categories.join(' and ')} - innovative approaches that address multiple national priorities simultaneously.`
                  }
                </p>
              </div>
            )}

            {/* Cards Grid - reuse featured card design */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
              {items.map((item, idx) => (
                <Link key={item.id} href={`/ideas/${slugify(item.title)}`} className="block">
                  <div
                    className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] md:rounded-[34px] lg:rounded-[38px]"
                    style={{
                      height: '400px',
                      backgroundColor: getBackgroundForGlobalIndex(idx + 1),
                      transform: `rotate(${getRotationAngleForGlobalIndex(idx + 1)}deg)`,
                      transformOrigin: 'center center',
                      willChange: 'transform',
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                        backgroundSize: '200px 200px',
                        backgroundRepeat: 'repeat',
                      }}
                    />
                    <div className="relative flex flex-col h-full px-6 pt-6 pb-6">
                      <div>
                        {item.category && (
                          <div className="mb-2 flex justify-center">
                            <span
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
                              style={{ borderColor: '#d8cdbc', color: '#403f3e', backgroundColor: 'transparent' }}
                            >
                              {item.category}
                            </span>
                          </div>
                        )}
                        <h3
                          className="text-2xl mb-3 text-center"
                          style={{ fontFamily: 'Decoy', fontWeight: 500, color: '#403f3e' }}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <div className="mt-auto">
                        <div className="flex justify-center mb-2">
                          <img
                            src={getCategoryIcon(item.category)}
                            alt={item.category ? `${item.category} icon` : 'Category icon'}
                            width={56}
                            height={56}
                            style={{ display: 'block' }}
                          />
                        </div>
                        <p
                          className="text-sm leading-relaxed text-center line-clamp-5"
                          style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e', fontWeight: 600 }}
                        >
                          {item.blurb}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Infinite scroll loader; pass offset and SSR count */}
            <IdeasInfiniteLoader initialOffset={offset} initialCount={initialCount} />
          </div>
        </section>
      </main>
    </div>
  );
}