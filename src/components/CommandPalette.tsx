'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { kits, filterKits, slugifyTitle, getSuggestions } from '../lib/kits';
import type { IdeaItem } from '../lib/airtable';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'idea' | 'resource';
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Update suggestions as user types
  useEffect(() => {
    if (!isOpen) return;

    if (query.trim()) {
      // Get autosuggestions from Ideas API and Resources
      const updateSuggestions = async () => {
        try {
          // Get Ideas suggestions
          const ideasResponse = await fetch(`/api/ideas?pageSize=5&q=${encodeURIComponent(query)}`);
          const ideasData = await ideasResponse.json();
          const ideaTitles = (ideasData.items || []).map((item: IdeaItem) => item.title);
          
          // Get Resources suggestions
          const resourceTitles = getSuggestions(kits, query, 3);
          
          setSuggestions([...ideaTitles, ...resourceTitles].slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to get suggestions:', error);
        }
      };
      
      const timeoutId = setTimeout(updateSuggestions, 200);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, isOpen]);

  // Search with debounce
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        // Search Ideas from API
        const ideasResponse = await fetch(`/api/ideas?pageSize=8&q=${encodeURIComponent(query)}`);
        const ideasData = await ideasResponse.json();
        const ideaResults: SearchResult[] = (ideasData.items || []).map((item: IdeaItem) => ({
          type: 'idea' as const,
          id: item.id,
          title: item.title,
          description: item.blurb || '',
          url: `/ideas/${slugifyTitle(item.title)}`,
        }));

        // Search Resources locally
        const resourceResults: SearchResult[] = filterKits(kits, [], query).map(kit => ({
          type: 'resource' as const,
          id: slugifyTitle(kit.title),
          title: kit.title,
          description: kit.description,
          url: `/resources#${slugifyTitle(kit.title)}`,
        }));

        setResults([...ideaResults, ...resourceResults]);
        setShowSuggestions(false);
        
        // Save to recent searches
        if (typeof window !== 'undefined') {
          const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
          setRecentSearches(newRecent);
          localStorage.setItem('recentSearches', JSON.stringify(newRecent));
        }
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, isOpen, recentSearches]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = showSuggestions ? suggestions.length - 1 : results.length - 1;
      setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions[selectedIndex]) {
        setQuery(suggestions[selectedIndex]);
        setShowSuggestions(false);
      } else if (results[selectedIndex]) {
        router.push(results[selectedIndex].url);
        onClose();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ backgroundColor: '#f9f2e9', borderColor: '#e8ddd0' }}
        >
          {/* Search Input */}
          <div className="p-4 border-b" style={{ borderColor: '#e8ddd0' }}>
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                style={{ color: '#403f3e' }}
              >
                <path
                  d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search ideas and resources..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-lg"
                style={{ color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
              />
              {loading && (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="border-b" style={{ borderColor: '#e8ddd0' }}>
              <div className="p-2 text-xs font-semibold" style={{ color: '#403f3e' }}>
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                  style={{ 
                    backgroundColor: index === selectedIndex ? '#f2e8dc' : 'transparent',
                    borderBottom: '1px solid #e8ddd0'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d8cdbc' }}>
                      <span className="text-xs" style={{ color: '#403f3e' }}>💡</span>
                    </div>
                    <span style={{ color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}>
                      {suggestion}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent searches when no query */}
          {!query && recentSearches.length > 0 && (
            <div className="border-b" style={{ borderColor: '#e8ddd0' }}>
              <div className="p-2 text-xs font-semibold" style={{ color: '#403f3e' }}>
                Recent searches
              </div>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid #e8ddd0'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d8cdbc' }}>
                      <span className="text-xs" style={{ color: '#403f3e' }}>🕒</span>
                    </div>
                    <span style={{ color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}>
                      {search}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 && query && !loading && (
              <div className="p-8 text-center">
                <p style={{ color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}>
                  No results found for &quot;{query}&quot;
                </p>
              </div>
            )}
            
            {results.length === 0 && !query && !recentSearches.length && (
              <div className="p-8 text-center">
                <p style={{ color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}>
                  Start typing to search ideas and resources...
                </p>
              </div>
            )}

            {results.map((result, index) => {
              const adjustedIndex = showSuggestions ? index + suggestions.length : index;
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    adjustedIndex === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                  style={{ 
                    backgroundColor: adjustedIndex === selectedIndex ? '#f2e8dc' : 'transparent',
                    borderBottom: '1px solid #e8ddd0'
                  }}
                >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {result.type === 'idea' ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d8cdbc' }}>
                        <span className="text-sm" style={{ color: '#403f3e' }}>💡</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d8cdbc' }}>
                        <span className="text-sm" style={{ color: '#403f3e' }}>🛠️</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 
                        className="font-semibold truncate"
                        style={{ color: '#403f3e', fontFamily: 'Decoy, sans-serif' }}
                      >
                        {result.title}
                      </h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ 
                          backgroundColor: result.type === 'idea' ? '#e8ddd0' : '#d8cdbc',
                          color: '#403f3e'
                        }}
                      >
                        {result.type === 'idea' ? 'Idea' : 'Resource'}
                      </span>
                    </div>
                    {result.description && (
                      <p 
                        className="text-sm text-gray-600 line-clamp-2"
                        style={{ color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                      >
                        {result.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t" style={{ borderColor: '#e8ddd0' }}>
            <div className="flex items-center justify-between text-xs" style={{ color: '#403f3e' }}>
              <div className="flex items-center gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
              <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
