import { Theme } from '../misc/theme';

export const getThemeStyles = (theme: Theme): { bgColor: string; fontColor: string } => {
   return {
      bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
      fontColor: theme === 'dark' ? 'text-white' : 'text-black',
   };
};