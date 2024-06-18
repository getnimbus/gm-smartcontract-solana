import {
  createContext,
  ProviderProps,
  ReactNode,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext({});

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  //   useEffect(() => {
  //   const themeStorage = localStorage?.getItem("Dark Mode");
  //     let boolOutput = themeStorage?.toLowerCase() !== "light" ? false : true;
  //     setDarkMode(boolOutput);
  //   }, [themeStorage]);

  //   console.log({ darkMode, themeStorage });

  const setMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={darkMode !== null && darkMode}>
      {children}
    </ThemeContext.Provider>
  );
}
