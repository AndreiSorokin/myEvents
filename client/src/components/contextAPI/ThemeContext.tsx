import React, { createContext, ReactNode, useContext } from 'react'

import { Theme, ThemeContextValue } from '../../misc/theme';

const ThemeContext = createContext<ThemeContextValue>({
   theme: "light",
   toggleTheme: () => {}
})

export default function ThemeProvider({ children }: { children: ReactNode }) {
   const [theme, setTheme] = React.useState<Theme>('light');

   const toggleTheme = () => {
      setTheme((prevTheme) => 
         prevTheme === 'light'? 'dark' : 'light'
      )
   }

   return (
      <ThemeContext.Provider value={{ toggleTheme, theme }}>
         <div style={{transition: '0.5s ease'}}>
            {children}
         </div>
      </ThemeContext.Provider>
   )
}

export const useTheme = () => useContext(ThemeContext);