
import { useEffect, useRef } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  type: 'surah' | 'reader' | 'recitation';
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

const SearchResults = ({ results, isLoading, query }: SearchResultsProps) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [results]);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 p-6 glass-card rounded-xl">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin"></div>
          <p className="mt-4 text-sage-600">جاري البحث...</p>
        </div>
      </div>
    );
  }

  if (query && results.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 p-6 glass-card rounded-xl text-center">
        <p className="text-sage-600 py-8">لم يتم العثور على نتائج لـ "{query}"</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div ref={resultsRef} className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-medium text-right mb-4 text-sage-800">
        نتائج البحث ({results.length})
      </h2>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <div 
            key={result.id}
            className="p-4 glass-card rounded-xl transition-all hover:shadow-md result-item-enter"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex flex-col text-right">
              <div className="flex justify-between items-start">
                <span className={`
                  text-xs font-medium px-2 py-0.5 rounded-full 
                  ${result.type === 'surah' ? 'bg-emerald-100 text-emerald-700' : 
                    result.type === 'reader' ? 'bg-sage-100 text-sage-700' : 
                    'bg-emerald-50 text-emerald-600'}
                `}>
                  {result.type === 'surah' ? 'سورة' : 
                   result.type === 'reader' ? 'قارئ' : 
                   'تلاوة'}
                </span>
                <h3 className="text-lg font-medium text-sage-800">{result.title}</h3>
              </div>
              
              <p className="text-sage-600 mt-1">{result.subtitle}</p>
              
              {result.description && (
                <p className="mt-2 text-sage-500 text-sm">{result.description}</p>
              )}
              
              <button className="self-start mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
