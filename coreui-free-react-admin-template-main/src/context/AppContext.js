import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedBranchLocal, setSelectedBranchLocal] = useState('');
  const [selectedBranchLocalName, setSelectedBranchLocalName] = useState('');

  return (
    <AppContext.Provider value={{ selectedBranchLocal, setSelectedBranchLocal, selectedBranchLocalName,  setSelectedBranchLocalName}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);