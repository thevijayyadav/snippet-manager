import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const themes = ['light', 'dark', 'ocean', 'sunset'];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...themes);
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = (newTheme) => {
    if (newTheme && themes.includes(newTheme)) {
      setTheme(newTheme);
      return;
    }
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
