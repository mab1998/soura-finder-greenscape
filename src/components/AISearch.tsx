
import { useState, useRef } from 'react';
import { Database } from 'lucide-react';

interface AISearchProps {
  onSearch: (query: string) => void;
}

const AISearch = ({ onSearch }: AISearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const suggestedQueries = [
    'ابحث عن الآيات التي تحتوي على أسماء الله الحسنى',
    'آيات عن الصبر والشكر',
    'سور تبدأ بالحروف المقطعة',
    'آيات تتحدث عن الجنة',
    'ابحث عن أطول آية في القرآن'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuery.trim()) {
      onSearch(aiQuery);
      setAiQuery('');
      setIsExpanded(false);
    }
  };

  const handleSuggestedQueryClick = (query: string) => {
    onSearch(query);
    setIsExpanded(false);
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className={`
        glass-card rounded-xl overflow-hidden transition-all duration-300
        ${isExpanded ? 'shadow-md' : 'hover:shadow-md'}
      `}>
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={handleExpandToggle}
        >
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600"
            aria-label={isExpanded ? 'إغلاق البحث الذكي' : 'فتح البحث الذكي'}
          >
            <Database size={18} />
          </button>
          
          <div className="flex-1 mx-4 text-right">
            <h3 className="font-medium text-sage-800">
              البحث بالذكاء الاصطناعي
            </h3>
            <p className="text-sm text-sage-600">
              اطرح سؤالاً أو ابحث عن موضوع محدد في القرآن الكريم
            </p>
          </div>
          
          <div className="w-4 h-4 border-t-2 border-r-2 border-sage-500 transform transition-transform duration-300 rotate-45 mr-2 -mt-1 inline-block" style={{
            transform: isExpanded ? 'rotate(135deg)' : 'rotate(45deg)'
          }}></div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 animate-fade-in">
            <form onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="اكتب سؤالك أو موضوع البحث هنا..."
                className="w-full p-3 bg-white/50 border border-emerald-100 rounded-lg text-right placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 transition"
                rows={3}
                dir="rtl"
              ></textarea>
              
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  disabled={!aiQuery.trim()}
                >
                  بحث
                </button>
              </div>
            </form>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-right text-sage-700 mb-2">
                اقتراحات البحث:
              </h4>
              <div className="flex flex-wrap gap-2 justify-end">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQueryClick(query)}
                    className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISearch;
