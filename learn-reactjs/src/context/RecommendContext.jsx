import { createContext, useContext, useState } from "react";

const RecommendContext = createContext();

export function RecommendProvider({ children }) {
  const [selectedType, setSelectedType] = useState(null);
  const [priority, setPriority] = useState([]);
  const [criteria, setCriteria] = useState({});

  return (
    <RecommendContext.Provider
      value={{
        selectedType, setSelectedType,
        priority, setPriority,
        criteria, setCriteria
      }}
    >
      {children}
    </RecommendContext.Provider>
  );
}

export function useRecommend() {
  return useContext(RecommendContext);
}
