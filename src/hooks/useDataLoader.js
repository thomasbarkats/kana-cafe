import { useState, useCallback, useRef } from 'react';
import { getCacheKey, initializeFavoritesMap } from '../utils/cacheHelpers';


export const useDataLoader = ({
  cache,
  setCache,
  setSessionFavorites,
  language,
}) => {
  const [loading, setLoading] = useState(true);
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  const loadData = useCallback(async ({
    selectedLists,
    fetchFn,
    dataKey,
    showLoadingState = true,
  }) => {
    if (!selectedLists || selectedLists.length === 0) {
      return [];
    }

    const cacheKey = getCacheKey(selectedLists, language);
    const isFavoritesIncluded = selectedLists.includes('favorites');

    if (cacheRef.current[cacheKey]) {
      const cachedData = cacheRef.current[cacheKey];
      if (isFavoritesIncluded && setSessionFavorites) {
        setSessionFavorites(initializeFavoritesMap(cachedData));
      }
      if (showLoadingState) {
        setLoading(false);
      }
      return cachedData;
    }

    if (showLoadingState) {
      setLoading(true);
    }

    try {
      const response = await fetchFn(selectedLists, language);
      const data = response[dataKey] || [];

      setCache(prev => ({ ...prev, [cacheKey]: data }));
      if (isFavoritesIncluded && setSessionFavorites) {
        setSessionFavorites(initializeFavoritesMap(data));
      }

      return data;
    } catch (error) {
      console.error(`Failed to load ${dataKey}:`, error);
      return [];
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
    }
  }, [setCache, setSessionFavorites, language]);

  const getFromCache = useCallback((selectedLists) => {
    if (!selectedLists || selectedLists.length === 0) {
      return null;
    }

    const cacheKey = getCacheKey(selectedLists, language);
    return cacheRef.current[cacheKey] || null;
  }, [language]);

  return {
    loading,
    setLoading,
    loadData,
    getFromCache,
  };
};
