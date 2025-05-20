import React, { createContext, useState, useContext } from 'react';

interface ScrollContextType {
  isAutoScrollEnabled: boolean;
  setIsAutoScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScrollContext = createContext<ScrollContextType>({
  isAutoScrollEnabled: true,
  setIsAutoScrollEnabled: () => {}
});

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  return (
    <ScrollContext.Provider value={{ isAutoScrollEnabled, setIsAutoScrollEnabled }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => useContext(ScrollContext);