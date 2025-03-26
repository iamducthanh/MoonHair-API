import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedBranchLocal, setSelectedBranchLocal] = useState('');

  return (
    <AppContext.Provider value={{ selectedBranchLocal, setSelectedBranchLocal }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);