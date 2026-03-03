import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { ClaimRecord } from '../models/claim';
import type { FeatureImportanceItem } from '../utils/featureImportance';
import { cleanDataset, type CleaningResult } from '../utils/dataCleaning';
import { trainModel, type ModelTrainResult } from '../services/modelService';
import {
  getFeatureImportance,
  getCorrelationMatrix,
  type CorrelationMatrix,
} from '../utils/featureImportance';

export interface AppState {
  rawData: ClaimRecord[];
  cleanedData: ClaimRecord[];
  cleaningReport: CleaningResult | null;
  modelResult: ModelTrainResult | null;
  featureImportance: FeatureImportanceItem[];
  correlationMatrix: CorrelationMatrix | null;
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_RAW_DATA'; payload: ClaimRecord[] }
  | { type: 'CLEAN_DATA'; payload: CleaningResult }
  | { type: 'TRAIN_MODEL'; payload: ModelTrainResult | null }
  | { type: 'SET_FEATURE_IMPORTANCE'; payload: FeatureImportanceItem[] }
  | { type: 'SET_CORRELATION'; payload: CorrelationMatrix | null }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const STORAGE_KEY = 'health-claim-predictor';

function getInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        rawData: [],
        cleanedData: [],
        cleaningReport: null,
        modelResult: null,
        featureImportance: [],
        correlationMatrix: null,
        darkMode: parsed.darkMode ?? false,
        loading: false,
        error: null,
      };
    }
  } catch {
    // ignore
  }
  return {
    rawData: [],
    cleanedData: [],
    cleaningReport: null,
    modelResult: null,
    featureImportance: [],
    correlationMatrix: null,
    darkMode: false,
    loading: false,
    error: null,
  };
}

const initialState: AppState = getInitialState();

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_RAW_DATA':
      return {
        ...state,
        rawData: action.payload,
        cleanedData: [],
        cleaningReport: null,
        modelResult: null,
        featureImportance: [],
        correlationMatrix: null,
        error: null,
      };
    case 'CLEAN_DATA':
      return {
        ...state,
        cleanedData: action.payload.cleanedData,
        cleaningReport: action.payload,
        modelResult: null,
        featureImportance: [],
        correlationMatrix: null,
        error: null,
      };
    case 'TRAIN_MODEL':
      return {
        ...state,
        modelResult: action.payload,
        error: null,
      };
    case 'SET_FEATURE_IMPORTANCE':
      return { ...state, featureImportance: action.payload };
    case 'SET_CORRELATION':
      return { ...state, correlationMatrix: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const AppStateContext = createContext<{
  state: AppState;
  setRawData: (data: ClaimRecord[]) => void;
  runCleaning: (options?: Parameters<typeof cleanDataset>[1]) => void;
  runTraining: () => void;
  runFeatureAnalysis: () => void;
  toggleDarkMode: () => void;
  reset: () => void;
} | null>(null);

export function AppStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRawData = useCallback((data: ClaimRecord[]) => {
    dispatch({ type: 'SET_RAW_DATA', payload: data });
  }, []);

  const runCleaning = useCallback(
    (options?: Parameters<typeof cleanDataset>[1]) => {
      const data = state.rawData.length > 0 ? state.rawData : [];
      const result = cleanDataset(data, options);
      dispatch({ type: 'CLEAN_DATA', payload: result });
    },
    [state.rawData]
  );

  const runTraining = useCallback(() => {
    const data = state.cleanedData.length > 0 ? state.cleanedData : state.rawData;
    if (data.length < 2) {
      dispatch({ type: 'SET_ERROR', payload: 'Need at least 2 records to train.' });
      return;
    }
    const result = trainModel(data);
    dispatch({ type: 'TRAIN_MODEL', payload: result });
    if (result) {
      const importance = getFeatureImportance(
        data,
        result.result.coefficients,
        result.featureNames
      );
      dispatch({ type: 'SET_FEATURE_IMPORTANCE', payload: importance });
      const corr = getCorrelationMatrix(data);
      dispatch({ type: 'SET_CORRELATION', payload: corr });
    }
  }, [state.cleanedData, state.rawData]);

  const runFeatureAnalysis = useCallback(() => {
    const data = state.cleanedData.length > 0 ? state.cleanedData : state.rawData;
    if (data.length === 0) return;
    const corr = getCorrelationMatrix(data);
    dispatch({ type: 'SET_CORRELATION', payload: corr });
    if (state.modelResult) {
      const importance = getFeatureImportance(
        data,
        state.modelResult.result.coefficients,
        state.modelResult.featureNames
      );
      dispatch({ type: 'SET_FEATURE_IMPORTANCE', payload: importance });
    }
  }, [state.cleanedData, state.rawData, state.modelResult]);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ darkMode: state.darkMode })
      );
    } catch {
      // ignore
    }
  }, [state.darkMode]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        state,
        setRawData,
        runCleaning,
        runTraining,
        runFeatureAnalysis,
        toggleDarkMode,
        reset,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
