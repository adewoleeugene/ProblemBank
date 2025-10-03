import { TeamProfile } from '@/lib/teamboard';
import { Button } from '@/components/ui/button';

interface TeamProfileCardProps {
  profile: TeamProfile & { isMine?: boolean };
  canDelete?: boolean;
  onDelete?: () => void;
}

export default function TeamProfileCard({ profile, canDelete, onDelete }: TeamProfileCardProps) {
  return (
    <div className="relative flex flex-col h-full px-6 pt-6 pb-6">
      {/* Header with handle and social links */}
      <div className="mb-4">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <a
            href={profile.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center transition-colors hover:opacity-80"
            style={{ color: '#403f3e' }}
          >
            <h3 
              className="text-2xl"
              style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e' }}
            >
              {profile.handle}
            </h3>
          </a>
          <a
            href={profile.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center transition-colors hover:opacity-80"
            style={{ color: '#403f3e' }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
        {profile.linkedinUrl && (
          <div className="flex justify-center">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm transition-colors hover:opacity-80"
              style={{ color: '#403f3e' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        )}
      </div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="mb-4">
          <div 
            className="text-center text-sm mb-2"
            style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}
          >
            SKILLS:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full border text-xs"
                style={{ borderColor: '#d8cdbc', color: '#403f3e', backgroundColor: '#fffaf3' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

          {/* Repositories */}
          {profile.repos.length > 0 && (
            <div className="mt-auto">
              <div 
                className="text-center text-sm mb-2"
                style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}
              >
                REPO/PORTFOLIO:
              </div>
          <div className="space-y-1">
            {profile.repos.map((repo, index) => (
              <a
                key={index}
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-center truncate transition-colors hover:opacity-80"
                style={{ color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
              >
                {repo}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Delete button at the bottom */}
      {canDelete && onDelete && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={onDelete}
            className="text-xs px-3 py-1"
            style={{ 
              borderColor: '#d8cdbc', 
              color: '#403f3e',
              backgroundColor: '#fffaf3'
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
