import React, {
  createContext,
  useReducer,
  useCallback,
  useState,
  useEffect
} from 'react';

const MapStateContext = createContext();
const MapDispatchContext = createContext();

const initailState = {
  kakao: window.kakao,
  map: null,
  pending: true,
  bounds: null,
  error: null,
  stores: null,
  serviceOpen: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_MAP':
      return {
        ...state,
        map: action.payload
      };
    case 'SET_PENDING':
      return {
        ...state,
        pending: action.payload
      };
    case 'SET_BOUNDS':
      const getBounds = state.map.getBounds();
      console.log('getBounds', getBounds);
      return {
        ...state,
        bounds: getBounds
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'FETCH_STORE':
      return {
        ...state,
        stores: action.payload
      };
    default:
      return state;
  }
};

function MapProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initailState);
  return (
    <MapStateContext.Provider value={state}>
      <MapDispatchContext.Provider value={dispatch}>
        {children}
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  );
}

function useMapState() {
  const context = React.useContext(MapStateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

function useMapDispatch() {
  const context = React.useContext(MapDispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider');
  }
  return context;
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export { MapProvider, useMapState, useMapDispatch, useDebounce };
