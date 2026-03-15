import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te' | 'ta';

interface Translations {
    [key: string]: {
        en: string;
        hi: string;
        te: string;
        ta: string;
    };
}

const UI_TRANSLATIONS: Translations = {
    Home: { en: 'Home', hi: 'मुख्य पृष्ठ', te: 'హోమ్', ta: 'முகப்பு' },
    About: { en: 'About', hi: 'हमारे बारे में', te: 'గురించి', ta: 'பற்றி' },
    Dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', te: 'డాష్‌బోర్డ్', ta: 'டாஷ்போர்டு' },
    Villages: { en: 'Villages', hi: 'गाँव', te: 'గ్రామాలు', ta: 'கிராமங்கள்' },
    Advisor: { en: 'Advisor', hi: 'सलाहकार', te: 'సలహాదారు', ta: 'ஆலோசகர்' },
    Calculator: { en: 'Calculator', hi: 'कैलक्यूलेटर', te: 'కాలిక్యులేటర్', ta: 'கால்குலேட்டர்' },
    'AI Chat': { en: 'AI Chat', hi: 'एआई चैट', te: 'ఏఐ చాట్', ta: 'AI அரட்டை' },
    'Register Land': { en: 'Register Land', hi: 'ज़मीन रजिस्टर करें', te: 'భూమి నమోదు', ta: 'நில பதிவு' },
    Data: { en: 'Data', hi: 'डेटा', te: 'సమాచారం', ta: 'தரவு' },
    Marketplace: { en: 'Marketplace', hi: 'मार्केटप्लेस', te: 'మార్కెట్ ప్లేస్', ta: 'சந்தை' },
    Machinery: { en: 'Machinery', hi: 'मशीनरी', te: 'యంత్రాలు', ta: 'இயந்திரங்கள்' },
    Fertilizer: { en: 'Fertilizer', hi: 'खाद', te: 'ఎరువులు', ta: 'உரம்' },
    Equipment: { en: 'Equipment', hi: 'उपकरण', te: 'పరికరం', ta: 'உபகரணம்' },
    Rentals: { en: 'Rentals', hi: 'किराये पर', te: 'అద్దెలు', ta: 'வாடகைகள்' },
    Irrigation: { en: 'Irrigation', hi: 'सिंचाई', te: 'నీటిపారుదల', ta: 'நீர்ப்பாசனம்' },
    'Loan Services': { en: 'Loan Services', hi: 'ऋण सेवाएँ', te: 'రుణ సేవలు', ta: 'கடன் சேவைகள்' },
    Insurance: { en: 'Insurance', hi: 'बीमा', te: 'భీమా', ta: 'காப்பீடு' },
    'Sign In': { en: 'Sign In', hi: 'साइन इन करें', te: 'సైన్ ఇన్', ta: 'உள்நுழைய' },
    'Get Started': { en: 'Get Started', hi: 'शुरू करें', te: 'ప్రారంభించండి', ta: 'துவங்கு' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Load preferred language from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bhumi-lang');
        if (saved && ['en', 'hi', 'te', 'ta'].includes(saved)) {
            setLanguage(saved as Language);
        }
    }, []);

    // Save to localStorage when changed
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('bhumi-lang', lang);
    };

    const t = (key: string): string => {
        if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][language]) {
            return UI_TRANSLATIONS[key][language];
        }
        return key; // Fallback to key itself if translation is missing
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
