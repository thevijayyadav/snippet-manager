import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    welcome: 'Welcome Back',
    login_sub: 'Login to your Collaborative Code Snippet Manager',
    username_email: 'Username or Email',
    password: 'Password',
    login: 'Sign In',
    forgot: 'Forgot Password?',
    no_account: "Don't have an account?",
    create_account: 'Create an account',
    register_title: 'Create Account',
    register_sub: 'Join the Collaborative Code Snippet Manager',
    fullname: 'Full Name',
    email: 'Email Address',
    confirm_password: 'Confirm Password',
    signup: 'Sign Up',
    has_account: 'Already have an account?',
    dashboard: 'Dashboard',
    admin_panel: 'Admin Panel',
    add_snippet: 'Add Snippet',
    my_library: 'My Library',
    settings: 'Settings',
    logout: 'Logout',
    snippet_hub: 'Snippet Hub',
    manage_snippets: 'Manage and discover shared code snippets.',
    search_placeholder: 'Search by title or tags...',
    new_snippet: 'New Snippet',
    admin_hub: 'Admin Control Center',
    manage_users: 'Manage registered users and system settings.',
    analytics: "Usage Analytics",
    team_manager: "Team Intelligence",
    versions_log: "Version History",
    feedback: "Developer Feedback",
    ai_explanation: "AI Logic Synthesis"
  },
  hi: {
    welcome: 'वापसी पर स्वागत है',
    login_sub: 'अपने सहयोगी कोड स्निपेट प्रबंधक में लॉगिन करें',
    username_email: 'उपयोगकर्ता नाम या ईमेल',
    password: 'पासवर्ड',
    login: 'साइन इन',
    forgot: 'पासवर्ड भूल गए?',
    no_account: "खाता नहीं है?",
    create_account: 'खाता बनाएं',
    register_title: 'खाता बनाएं',
    register_sub: 'सहयोगी कोड स्निपेट प्रबंधक से जुड़ें',
    fullname: 'पूरा नाम',
    email: 'ईमेल पता',
    confirm_password: 'पासवर्ड की पुष्टि करें',
    signup: 'साइन अप',
    has_account: 'क्या आपके पास पहले से खाता है?',
    dashboard: 'डैशबोर्ड',
    admin_panel: 'व्यवस्थापक पैनल',
    add_snippet: 'स्निपेट जोड़ें',
    my_library: 'मेरी लाइब्रेरी',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    snippet_hub: 'स्निपेट हब',
    manage_snippets: 'साझा किए गए कोड स्निपेट प्रबंधित करें और खोजें।',
    search_placeholder: 'शीर्षक या टैग द्वारा खोजें...',
    new_snippet: 'नया स्निपेट',
    admin_hub: 'व्यवस्थापक नियंत्रण केंद्र',
    manage_users: 'पंजीकृत उपयोगकर्ता प्रबंधित करें।',
    analytics: "विश्लेषण",
    feedback: "प्रतिक्रिया"
  },
  mr: {
    welcome: 'परत स्वागत आहे',
    login_sub: 'तुमच्या सहयोगी कोड स्निपेट मॅनेजरमध्ये लॉग इन करा',
    username_email: 'वापरकर्तानाव किंवा ईमेल',
    password: 'पासवर्ड',
    login: 'साइन इन करा',
    forgot: 'पासवर्ड विसरलात?',
    no_account: "खाते नाही?",
    create_account: 'खाते तयार करा',
    register_title: 'खाते तयार करा',
    register_sub: 'सहयोगी कोड स्निपेट मॅनेजरमध्ये सामील व्हा',
    fullname: 'पूर्ण नाव',
    email: 'ईमेल पत्ता',
    confirm_password: 'पासवर्डची पुष्टी करा',
    signup: 'साइन अप करा',
    has_account: 'आधीपासून खाते आहे का?',
    dashboard: 'डॅशबोर्ड',
    admin_panel: 'अ‍ॅडमिन पॅनेल',
    add_snippet: 'स्निपेट जोडा',
    my_library: 'माझी लायब्ररी',
    settings: 'सेटिंग्ज',
    logout: 'लॉग आउट',
    snippet_hub: 'स्निपेट हब',
    manage_snippets: 'सामायिक केलेले कोड स्निपेट्स व्यवस्थापित करा आणि शोधा.',
    search_placeholder: 'शीर्षक किंवा टॅग द्वारे शोधा...',
    new_snippet: 'नवीन स्निपेट',
    admin_hub: 'अ‍ॅडमिन नियंत्रण केंद्र',
    manage_users: 'नोंदणीकृत वापरकर्ते व्यवस्थापित करा.',
    analytics: "विश्लेषण"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
