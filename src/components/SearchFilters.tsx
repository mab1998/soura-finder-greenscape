
import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export type FilterType = {
  category: 'reader' | 'surah' | 'recitationType';
  value: string;
};

interface SearchFiltersProps {
  onFilterChange: (filters: FilterType[]) => void;
}

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);
  
  // Sample data - in a real app, this would come from an API or database
  const readers = ['عبد الباسط عبد الصمد', 'محمود خليل الحصري', 'مشاري العفاسي', 'محمد صديق المنشاوي'];
  const surahs = ['الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة'];
  const recitationTypes = ['مرتل', 'مجود', 'حدر'];

  const handleFilterSelect = (newFilter: FilterType) => {
    // Check if this filter category+value already exists
    const exists = selectedFilters.some(
      filter => filter.category === newFilter.category && filter.value === newFilter.value
    );
    
    if (!exists) {
      const updatedFilters = [...selectedFilters, newFilter];
      setSelectedFilters(updatedFilters);
      onFilterChange(updatedFilters);
    }
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = selectedFilters.filter((_, i) => i !== index);
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 py-2 px-4 rounded-lg bg-sage-100 hover:bg-sage-200 transition-colors text-sage-700"
          aria-expanded={isOpen}
        >
          <Filter size={18} />
          <span className="text-sm font-medium">الفلاتر</span>
        </button>
        
        {selectedFilters.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-sage-600 hover:text-sage-800 transition-colors"
          >
            مسح الكل
          </button>
        )}
      </div>
      
      {/* Selected filters */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 rtl">
          {selectedFilters.map((filter, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm animate-fade-in"
            >
              <span>{filter.value}</span>
              <button
                onClick={() => handleRemoveFilter(index)}
                className="ml-1 hover:text-emerald-900 transition-colors"
                aria-label="إزالة الفلتر"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Filter panel */}
      {isOpen && (
        <div className="mt-3 p-4 rounded-xl glass-card animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-right text-sage-800 mb-2">القارئ</h3>
              <div className="space-y-1">
                {readers.map((reader) => (
                  <button
                    key={reader}
                    className="w-full text-right px-3 py-2 rounded-lg hover:bg-emerald-50 text-sage-700 transition-colors"
                    onClick={() => handleFilterSelect({ category: 'reader', value: reader })}
                  >
                    {reader}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-right text-sage-800 mb-2">السورة</h3>
              <div className="space-y-1">
                {surahs.map((surah) => (
                  <button
                    key={surah}
                    className="w-full text-right px-3 py-2 rounded-lg hover:bg-emerald-50 text-sage-700 transition-colors"
                    onClick={() => handleFilterSelect({ category: 'surah', value: surah })}
                  >
                    {surah}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-right text-sage-800 mb-2">نوع التلاوة</h3>
              <div className="space-y-1">
                {recitationTypes.map((type) => (
                  <button
                    key={type}
                    className="w-full text-right px-3 py-2 rounded-lg hover:bg-emerald-50 text-sage-700 transition-colors"
                    onClick={() => handleFilterSelect({ category: 'recitationType', value: type })}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
