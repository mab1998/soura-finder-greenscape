
import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecognitionProps {
  onResult: (transcript: string) => void;
  buttonClassName?: string;
  iconSize?: number;
}

const VoiceRecognition = ({ onResult, buttonClassName = '', iconSize = 20 }: VoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // تهيئة التعرف الصوتي
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ar-SA'; // تعيين اللغة للعربية
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('خطأ في التعرف الصوتي:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.error('التعرف الصوتي غير مدعوم في هذا المتصفح');
    }
    
    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
      }
    };
  }, [onResult]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;
    
    if (!isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('خطأ في بدء التعرف الصوتي:', error);
      }
    } else {
      recognition.stop();
      setIsListening(false);
    }
  }, [isListening, recognition]);

  return (
    <button
      onClick={toggleListening}
      className={`${buttonClassName} relative ${isListening ? 'animate-pulse' : ''}`}
      aria-label={isListening ? 'إيقاف الاستماع' : 'بدء الاستماع'}
      type="button"
    >
      {isListening ? (
        <>
          <MicOff size={iconSize} className="text-red-500" />
          <span className="absolute w-full h-full rounded-full bg-red-400/20 animate-ping"></span>
        </>
      ) : (
        <Mic size={iconSize} />
      )}
    </button>
  );
};

export default VoiceRecognition;
