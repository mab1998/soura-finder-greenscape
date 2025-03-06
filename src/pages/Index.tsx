
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchFilters, { FilterType } from '../components/SearchFilters';
import SearchResults, { SearchResult } from '../components/SearchResults';
import AISearch from '../components/AISearch';

// Mock data - in a real app, this would come from an API
const mockResults: SearchResult[] = [
  { 
    id: '1', 
    title: 'سورة البقرة', 
    subtitle: 'المصحف المرتل', 
    description: 'أطول سورة في القرآن الكريم، وتتناول موضوعات متعددة تتعلق بالإيمان والعبادات والمعاملات.', 
    type: 'surah' 
  },
  { 
    id: '2', 
    title: 'سورة الفاتحة', 
    subtitle: 'المصحف المرتل', 
    description: 'أم الكتاب وأم القرآن والسبع المثاني، وهي أول سورة في المصحف الشريف.', 
    type: 'surah' 
  },
  { 
    id: '3', 
    title: 'مشاري العفاسي', 
    subtitle: 'قارئ من الكويت', 
    description: 'من أشهر قراء القرآن الكريم في العصر الحديث، يمتاز بصوت شجي وأداء متقن.', 
    type: 'reader' 
  },
  { 
    id: '4', 
    title: 'سورة البقرة - مرتل', 
    subtitle: 'مشاري العفاسي', 
    type: 'recitation' 
  },
  { 
    id: '5', 
    title: 'سورة البقرة - مجود', 
    subtitle: 'عبد الباسط عبد الصمد', 
    type: 'recitation' 
  }
];

// Mock suggestions for search
const searchSuggestions = [
  'سورة البقرة',
  'سورة آل عمران',
  'سورة النساء',
  'سورة المائدة',
  'سورة الأنعام',
  'مشاري العفاسي',
  'عبد الباسط عبد الصمد',
  'محمود خليل الحصري',
  'محمد صديق المنشاوي',
  'تلاوة مرتلة',
  'تلاوة مجودة'
];

const Index = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery, filters);
  };

  const handleFilterChange = (newFilters: FilterType[]) => {
    setFilters(newFilters);
    if (hasSearched) {
      performSearch(query, newFilters);
    }
  };

  const handleAISearch = (aiQuery: string) => {
    setQuery(aiQuery);
    performSearch(aiQuery, filters, true);
  };

  const performSearch = (searchQuery: string, searchFilters: FilterType[], isAISearch = false) => {
    if (!searchQuery && searchFilters.length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      let filteredResults = [...mockResults];

      // Filter by search query
      if (searchQuery) {
        filteredResults = filteredResults.filter(result => 
          result.title.includes(searchQuery) || 
          result.subtitle.includes(searchQuery) || 
          (result.description && result.description.includes(searchQuery))
        );
      }

      // Apply filters
      if (searchFilters.length > 0) {
        filteredResults = filteredResults.filter(result => {
          return searchFilters.some(filter => {
            if (filter.category === 'surah' && result.type === 'surah') {
              return result.title.includes(filter.value);
            }
            if (filter.category === 'reader' && (result.type === 'reader' || result.type === 'recitation')) {
              return result.title.includes(filter.value) || result.subtitle.includes(filter.value);
            }
            if (filter.category === 'recitationType' && result.type === 'recitation') {
              return result.title.includes(filter.value);
            }
            return false;
          });
        });
      }

      // For AI search, we would typically call a different API endpoint
      if (isAISearch) {
        console.log('Performing AI search for:', searchQuery);
        // Here we'd call an AI-powered search API
        // For mock, we'll just use the same results
      }

      setResults(filteredResults);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">البحث في القرآن الكريم</h1>
          <p className="text-sage-600">ابحث عن السور، القراء، وأنماط التلاوة</p>
        </header>

        <SearchBar 
          onSearch={handleSearch} 
          suggestions={searchSuggestions} 
        />
        
        <SearchFilters onFilterChange={handleFilterChange} />
        
        <AISearch onSearch={handleAISearch} />
        
        <SearchResults 
          results={results} 
          isLoading={isLoading} 
          query={query} 
        />
      </div>
    </div>
  );
};

export default Index;
