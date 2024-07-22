import { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';

export const useMyState = () => {
  const { myState, setMyState } = useContext(AppContext);

  useEffect(() => {
    const savedSelectedState = localStorage.getItem('selectedState');
    if (savedSelectedState) {
      setMyState(savedSelectedState);
    }
  }, [setMyState]);

  return {
    selectedMyState: myState,
    setSelectedMyState: setMyState
  };
};