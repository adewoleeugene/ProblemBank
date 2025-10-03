'use client';

import { useState, useEffect } from 'react';
import { TeamProfile } from '@/lib/teamboard';
import TeamProfileCard from './TeamProfileCard';
import { Button } from './ui/button';

interface TeamProfilesClientProps {
  initialProfiles?: (TeamProfile & { isMine?: boolean })[];
  onProfileDeleted?: () => void;
}

export default function TeamProfilesClient({ initialProfiles = [], onProfileDeleted }: TeamProfilesClientProps) {
  const [profiles, setProfiles] = useState<(TeamProfile & { isMine?: boolean })[]>(initialProfiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/teamboard');
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/teamboard', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: profileId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete profile');
      }

      // Remove the deleted profile from the list
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      
      // Notify parent component that a profile was deleted
      if (onProfileDeleted) {
        onProfileDeleted();
      }
    } catch (err) {
      console.error('Error deleting profile:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete profile');
    }
  };

  useEffect(() => {
    if (initialProfiles.length === 0) {
      fetchProfiles();
    }
  }, [initialProfiles.length]);

  if (loading && profiles.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div 
          className="text-lg"
          style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
        >
          Loading profiles...
        </div>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 space-y-4">
        <div 
          className="text-lg text-center"
          style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
        >
          {error}
        </div>
        <Button
          onClick={fetchProfiles}
          variant="outline"
          style={{ 
            borderColor: '#d8cdbc', 
            color: '#403f3e',
            backgroundColor: '#fffaf3'
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 space-y-4">
        <div 
          className="text-lg text-center"
          style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
        >
          No profiles yet. Be the first to add your skills!
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile, index) => (
        <div
          key={profile.id}
          className="relative"
          style={{
            backgroundColor: getBackgroundForGlobalIndex(index + 1),
            transform: `rotate(${getRotationAngleForGlobalIndex(index + 1)}deg)`,
          }}
        >
          <div className="p-1">
            <div 
              className="h-full border rounded-lg shadow-sm"
              style={{ 
                borderColor: '#d8cdbc',
                backgroundColor: '#fffaf3'
              }}
            >
              <TeamProfileCard
                profile={profile}
                canDelete={profile.isMine}
                onDelete={() => handleDelete(profile.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions for styling (copied from page.tsx)
function getBackgroundForGlobalIndex(index1Based: number): string {
  const LIGHT = '#fffaf3';
  const DARK = '#f2e8dc';
  const block = Math.floor((index1Based - 1) / 4);
  const startIsLight = block % 2 === 0;
  const pos = (index1Based - 1) % 4;
  const isLight = startIsLight ? (pos % 2 === 0) : (pos % 2 === 1);
  return isLight ? LIGHT : DARK;
}

function getRotationAngleForGlobalIndex(index1Based: number): number {
  const baseAngles = [-2, 1.4, -1.2, 1.8];
  const pos = (index1Based - 1) % 4;
  const block = Math.floor((index1Based - 1) / 4);
  const angle = baseAngles[pos];
  return block % 2 === 0 ? angle : -angle;
}
