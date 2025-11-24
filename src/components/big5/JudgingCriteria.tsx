'use client';
import { memo, useState } from 'react';

const JudgingCriteria = memo(function JudgingCriteria() {
  const [isScrollOpen, setIsScrollOpen] = useState(false);

  const toggleScroll = () => {
    setIsScrollOpen(!isScrollOpen);
  };



  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .scroll-content::-webkit-scrollbar {
            width: 10px;
          }
          .scroll-content::-webkit-scrollbar-track {
            background: #d4c6a9;
            border-radius: 5px;
          }
          .scroll-content::-webkit-scrollbar-thumb {
            background: #5c422c;
            border-radius: 5px;
            border: 2px solid #d4c6a9;
          }
          .scroll-content::-webkit-scrollbar-thumb:hover {
            background: #4a3323;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .scroll-container {
              height: 500px !important;
            }
            .scroll-container.closed {
              height: 100px !important;
            }
            .scroll-content-inner {
              height: 400px !important;
            }
            .scroll-content {
              padding: 32px 24px !important;
            }
            .scroll-prompt {
              padding: 16px 20px !important;
              font-size: 1rem !important;
            }
          }
          @media (max-width: 640px) {
            .scroll-container {
              height: 450px !important;
            }
            .scroll-container.closed {
              height: 90px !important;
            }
            .scroll-content-inner {
              height: 360px !important;
            }
            .scroll-content {
              padding: 24px 20px !important;
            }
            .scroll-prompt {
              padding: 14px 16px !important;
              font-size: 0.9rem !important;
            }
          }
        `
      }} />
      <section className="relative z-40 w-full py-20 md:py-24 lg:py-32" style={{ backgroundColor: '#f9f2e9' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Heading */}
        <div className="relative flex flex-col items-center text-center select-none mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl uppercase leading-tight">
            <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e', display: 'block', transform: 'rotate(-1deg)' }}>
              JUDGING &
            </span>
          </h2>
          <h2 className="text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-4">
            <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e', display: 'block', transform: 'rotate(0.5deg)' }}>
              PARTICIPATION
            </span>
          </h2>
        </div>

        {/* Scroll Container */}
        <div
          className={`scroll-container ${isScrollOpen ? 'unrolled' : 'closed'}`}
          onClick={toggleScroll}
          style={{
            width: '100%',
            maxWidth: '80rem',
            margin: '0 auto',
            cursor: isScrollOpen ? 'default' : 'pointer',
            overflow: 'hidden',
            position: 'relative',
            height: isScrollOpen ? '650px' : '120px',
            transition: 'height 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s',
            backgroundColor: '#f0e9d4',
            borderRadius: '24px',
            border: '4px solid #5c422c',
            boxShadow: isScrollOpen
              ? '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.2) inset, 0 0 5px 3px rgba(255, 255, 255, 0.5) inset'
              : '0 12px 25px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.2) inset, 0 0 5px 3px rgba(255, 255, 255, 0.5) inset',
            filter: 'sepia(25%)',
          }}
        >
          {/* Scroll Prompt */}
          <div
            className="scroll-prompt"
            style={{
              backgroundColor: '#d4c6a9',
              color: '#33261a',
              textAlign: 'center',
              padding: '24px 32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              userSelect: 'none',
              borderBottom: '4px ridge #5c422c',
            }}
          >
            <span
              className="scroll-prompt-text text-sm sm:text-base md:text-lg lg:text-xl"
              style={{
                fontFamily: 'Decoy, sans-serif',
                letterSpacing: '0.05em',
                fontWeight: 500,
                color: '#33261a',
              }}
            >
              <span className="hidden sm:inline">{isScrollOpen ? 'Click to Roll Up Guide' : 'Click to Read the Participation Guide'}</span>
              <span className="sm:hidden">{isScrollOpen ? 'Roll Up Guide' : 'Read Participation Guide'}</span>
            </span>
            <span
              className="down-arrow"
              style={{
                marginLeft: '15px',
                fontSize: '1.8rem',
                transition: 'transform 0.5s',
                transform: isScrollOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                color: '#5c422c',
              }}
            >
              {isScrollOpen ? '▲' : '▼'}
            </span>
          </div>

          {/* Scroll Content */}
          <div
            className="scroll-content scroll-content-inner"
            style={{
              padding: '48px 60px',
              color: '#33261a',
              lineHeight: 1.7,
              opacity: isScrollOpen ? 1 : 0,
              transition: isScrollOpen ? 'opacity 1.5s 1s' : 'opacity 0.5s',
              backgroundColor: '#f0e9d4',
              height: '530px',
              overflowY: 'auto',
              position: 'relative',
              scrollbarWidth: 'thin',
              scrollbarColor: '#5c422c #d4c6a9',
            }}
          >
            <h2
              className="text-2xl md:text-3xl lg:text-4xl"
              style={{
                fontFamily: 'Decoy, sans-serif',
                fontWeight: 500,
                color: '#5c422c',
                textAlign: 'center',
                marginBottom: '10px',
                textTransform: 'uppercase',
                borderBottom: '2px solid #5c422c',
                paddingBottom: '10px',
              }}
            >
              Big 5 AI and Blockchain Hackathon
            </h2>
            <h3
              className="text-xl md:text-2xl lg:text-3xl"
              style={{
                fontFamily: 'Decoy, sans-serif',
                fontWeight: 500,
                color: '#5c422c',
                textAlign: 'center',
                marginBottom: '30px',
                borderBottom: '2px solid #5c422c',
                paddingBottom: '5px',
              }}
            >
              Participation and Submission Guide
            </h3>

            <div
              style={{
                marginBottom: '30px',
                paddingLeft: '15px',
                borderLeft: '3px solid rgba(92, 66, 44, 0.5)',
              }}
            >
              <h4
                className="text-lg md:text-xl lg:text-2xl"
                style={{
                  fontFamily: 'Decoy, sans-serif',
                  fontWeight: 500,
                  color: '#5c422c',
                  marginTop: '20px',
                  marginBottom: '10px',
                }}
              >
                Can I submit a project individually or do I need a team?
              </h4>
              <p>
                You may submit a project as an individual. However, we strongly encourage you to form a team. Our hackathon is competitive and the challenges are ambitious, so teaming up increases your chances of building a strong and complete solution.
              </p>
              <p className="mt-2">
                If you want teammates, you can use the official WhatsApp groups that have been created for participants. Introduce yourself, share your interests, and connect with others working on similar ideas.
              </p>
            </div>

            <div
              style={{
                marginBottom: '30px',
                paddingLeft: '15px',
                borderLeft: '3px solid rgba(92, 66, 44, 0.5)',
              }}
            >
              <h4
                className="text-lg md:text-xl lg:text-2xl"
                style={{
                  fontFamily: 'Decoy, sans-serif',
                  fontWeight: 500,
                  color: '#5c422c',
                  marginTop: '20px',
                  marginBottom: '10px',
                }}
              >
                What information must be included in my project submission?
              </h4>
              <p>Each project submission must include:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Product name and short description</li>
                <li>Which Big 5 category are you submitting for</li>
                <li>List of teammates</li>
                <li>Where the team is located</li>
                <li>A product logo or graphic</li>
                <li><strong>Public Github repo link(s)</strong>: All repos must be open source. No private repos are allowed. This supports the government&apos;s open-source policy direction.</li>
                <li>Link to a presentation video: Maximum 3 minutes</li>
                <li>Link to a technical overview video: Maximum 3 minutes</li>
              </ul>
              <p className="mt-3 italic text-sm">
                Treat your submission as your pitch to potential collaborators, government stakeholders, and future investors. Take time to make your materials clear and high quality.
              </p>
            </div>

            <div
              style={{
                marginBottom: '30px',
                paddingLeft: '15px',
                borderLeft: '3px solid rgba(92, 66, 44, 0.5)',
              }}
            >
              <h4
                className="text-lg md:text-xl lg:text-2xl"
                style={{
                  fontFamily: 'Decoy, sans-serif',
                  fontWeight: 500,
                  color: '#5c422c',
                  marginTop: '20px',
                  marginBottom: '10px',
                }}
              >
                How are projects judged?
              </h4>
              <p>
                The Big 5 AI and Blockchain Hackathon focuses on national transformation, practical innovation, and real deployability in the public sector.
              </p>
              <p>Judges will consider the following:</p>

              <ol className="list-decimal ml-6 mt-3 space-y-3 font-semibold">
                <li>
                  Alignment with National Priorities
                  <p className="font-normal text-sm ml-2 mt-1">
                    Does the solution directly address one of the problems in the official problem bank? Does it demonstrate a clear benefit to citizens, government processes, or national development?
                  </p>
                </li>
                <li>
                  Understanding of the Problem
                  <p className="font-normal text-sm ml-2 mt-1">
                    Does the team show a clear grasp of the context, the current challenges, and why their approach is meaningful? Has the team engaged with relevant feedback during the hackathon?
                  </p>
                </li>
                <li>
                  Product Quality and Execution
                  <p className="font-normal text-sm ml-2 mt-1">
                    Does the product work? Is the prototype functional? Has the team made visible progress and incorporated real feedback?
                  </p>
                </li>
                <li>
                  Practicality and Adoption Potential
                  <p className="font-normal text-sm ml-2 mt-1">
                    Could this solution realistically be deployed in a ministry, agency, or district? Does it have a path to becoming production ready?
                  </p>
                </li>
                <li>
                  Communication
                  <p className="font-normal text-sm ml-2 mt-1">
                    Is the team able to clearly explain the problem, the solution, and why their approach matters? Does the presentation demonstrate clarity and confidence?
                  </p>
                </li>
              </ol>
              <p className="mt-4 text-sm italic">
                Christex Foundation and MoCTI will review all submissions and create a shortlist. Relevant ministries, departments, and agencies will select the winners for each category.
              </p>
            </div>

            <div
              style={{
                marginBottom: '30px',
                paddingLeft: '15px',
                borderLeft: '3px solid rgba(92, 66, 44, 0.5)',
              }}
            >
              <h4
                className="text-lg md:text-xl lg:text-2xl"
                style={{
                  fontFamily: 'Decoy, sans-serif',
                  fontWeight: 500,
                  color: '#5c422c',
                  marginTop: '20px',
                  marginBottom: '10px',
                }}
              >
                What do judges expect in the Github repo?
              </h4>
              <p>We simply want to see that:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>You did meaningful work during the hackathon.</li>
                <li>Your team wrote the code yourselves (you and your AI).</li>
                <li>You prioritised features that address the challenge clearly.</li>
                <li>The repo is organised and easy to understand for reviewers.</li>
                <li>All work is open source.</li>
              </ul>
              <p className="mt-3">We do not require any specific programming languages, frameworks, or design patterns.</p>
            </div>

            <div
              style={{
                marginBottom: '30px',
                paddingLeft: '15px',
                borderLeft: '3px solid rgba(92, 66, 44, 0.5)',
              }}
            >
              <h4
                className="text-lg md:text-xl lg:text-2xl"
                style={{
                  fontFamily: 'Decoy, sans-serif',
                  fontWeight: 500,
                  color: '#5c422c',
                  marginTop: '20px',
                  marginBottom: '10px',
                }}
              >
                Can I submit more than one project?
              </h4>
              <p><strong>No.</strong> Each participant may only be part of one project and one team.</p>
            </div>

            <div
              style={{
                marginBottom: '30px',
                paddingLeft: '15px',
                borderLeft: '3px solid rgba(92, 66, 44, 0.5)',
              }}
            >
              <h4
                className="text-lg md:text-xl lg:text-2xl"
                style={{
                  fontFamily: 'Decoy, sans-serif',
                  fontWeight: 500,
                  color: '#5c422c',
                  marginTop: '20px',
                  marginBottom: '10px',
                }}
              >
                If we win, are we required to join any programme after the hackathon?
              </h4>
              <p><strong>No.</strong> Winners are not obligated to join any accelerator or programme beyond the hackathon.</p>
            </div>

            <h3
              className="text-xl md:text-2xl lg:text-3xl"
              style={{
                fontFamily: 'Decoy, sans-serif',
                fontWeight: 500,
                color: '#5c422c',
                marginTop: '30px',
                marginBottom: '20px',
                textAlign: 'center',
                borderBottom: '2px solid #5c422c',
                paddingBottom: '5px',
              }}
            >
              Hackathon Stages
            </h3>
            <div
              style={{
                marginBottom: '30px',
                paddingLeft: '15px',
                borderLeft: '3px solid rgba(92, 66, 44, 0.5)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 600,
                  color: '#403f3e',
                  marginBottom: '20px',
                }}
              >
                The Big 5 Hackathon runs in two main stages, designed to help teams refine, validate, and strengthen real solutions for national challenges.
              </p>

              <div
                style={{
                  backgroundColor: 'rgba(255, 250, 243, 0.6)',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: '2px solid #d4c6a9',
                }}
              >
                <h4
                  className="text-base md:text-lg lg:text-xl"
                  style={{
                    fontFamily: 'Decoy, sans-serif',
                    fontWeight: 500,
                    color: '#5c422c',
                    marginTop: '0',
                    marginBottom: '8px',
                  }}
                >
                  Stage 1: Build Sprint (Two Weeks)
                </h4>
                <p>All teams will have two weeks to build their initial solution. During this period teams will:</p>
                <ul className="list-square ml-6 mt-2 space-y-1">
                  <li>Work on their selected Big 5 challenge.</li>
                  <li>Receive general support from Christex Foundation and MoCTI.</li>
                </ul>
                <p className="mt-3 font-semibold">At the end of Stage 1:</p>
                <ul className="list-square ml-6 mt-1 space-y-1">
                  <li>Christex and MoCTI will review all submissions.</li>
                  <li>The top 3 teams in each of the Big 5 categories will be selected.</li>
                  <li>Around 15 teams will advance to the final stage.</li>
                </ul>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(242, 232, 220, 0.6)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #d4c6a9',
                }}
              >
                <h4
                  className="text-base md:text-lg lg:text-xl"
                  style={{
                    fontFamily: 'Decoy, sans-serif',
                    fontWeight: 500,
                    color: '#5c422c',
                    marginTop: '0',
                    marginBottom: '8px',
                  }}
                >
                  Stage 2: Finalist Accelerator (Two Weeks)
                </h4>
                <p>The top 15 teams enter an intensive sprint to make their solutions production ready.</p>
                <p className="mt-3 font-semibold">Finalists will receive:</p>
                <ul className="list-square ml-6 mt-2 space-y-1">
                  <li>Dedicated daily support from technical and product mentors</li>
                  <li>Unlimited credits for tools required during development</li>
                  <li>Direct MDA engagement to refine feasibility and deployment</li>
                  <li>Guidance on security, architecture, and implementation</li>
                  <li>Support with presentation, documentation, and technical polish</li>
                </ul>
                <p className="mt-3 italic">The goal of Stage 2 is to help teams deliver solutions that could genuinely be piloted or deployed within government.</p>
           </div>
        </div>

            <h3
              className="text-xl md:text-2xl lg:text-3xl"
              style={{
                fontFamily: 'Decoy, sans-serif',
                fontWeight: 500,
                color: '#5c422c',
                marginTop: '30px',
                marginBottom: '20px',
                textAlign: 'center',
                borderBottom: '2px solid #5c422c',
                paddingBottom: '5px',
              }}
            >
              Need Help?
            </h3>
            <p
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 600,
                color: '#33261a',
                textAlign: 'center',
                fontSize: '1.1rem',
                marginBottom: '20px',
              }}
            >
              Use the WhatsApp groups to find teammates, ask questions, and connect with other participants. Additional guidance and resources will also be shared during the hackathon.
            </p>

           </div>

          </div>
         </div>
    </section>
    </>
  );
});

export default JudgingCriteria;
