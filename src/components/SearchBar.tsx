
import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions?: string[];
}

const SearchBar = ({ onSearch, suggestions = [] }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowSuggestions(query.length > 0 && filteredSuggestions.length > 0);
  }, [query, filteredSuggestions.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (activeSuggestion >= 0) {
        setQuery(filteredSuggestions[activeSuggestion]);
        onSearch(filteredSuggestions[activeSuggestion]);
      } else {
        onSearch(query);
      }
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSearch = () => {
    onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative" ref={searchRef}>
      <div 
        className={`
          relative flex items-center w-full overflow-hidden search-animation-enter
          glass-input rounded-xl transition-all duration-300
          ${isFocused ? 'shadow-md ring-2 ring-emerald-300/50' : 'shadow'}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="ابحث عن سور، قراء، أنماط تلاوة..."
          dir="rtl"
          className="flex-1 bg-transparent py-4 px-5 text-lg outline-none placeholder:text-sage-500 text-right"
        />
        <button
          onClick={handleSearch}
          className="ml-2 mr-3 p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200"
          aria-label="بحث"
        >
          <Search size={20} />
          <span className="absolute w-10 h-10 rounded-full pulse-ring bg-emerald-400/20"></span>
        </button>
      </div>

      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-emerald-100/50 overflow-hidden">
          <ul className="py-2 max-h-72 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`
                  px-5 py-3 text-right cursor-pointer text-foreground hover:bg-emerald-50 transition-colors duration-150
                  ${index === activeSuggestion ? 'bg-emerald-50' : ''}
                `}
                onClick={() => {
                  setQuery(suggestion);
                  onSearch(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
