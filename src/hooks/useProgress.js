import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { progressAPI } from '../services/apiService';

const progressCache = {};

export const invalidateProgressCache = (itemType) => {
  delete progressCache[itemType];
};

export const useProgress = (itemType) => {
  const { isAuthenticated, hasActiveSubscription, hasLifetimeAccess } = useAuth();
  const haveAccess = hasActiveSubscription || hasLifetimeAccess;
  const [progressData, setProgressData] = useState(() => progressCache[itemType] || {});
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) {
      setProgressData({});
      return;
    }

    if (!haveAccess && itemType !== 'kana') {
      setProgressData({});
      return;
    }

    if (progressCache[itemType]) {
      setProgressData(progressCache[itemType]);
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    try {
      const result = await progressAPI.getProgress(itemType);

      const merged = {};
      const progressArray = Array.isArray(result)
        ? result
        : (result?.items || result?.progress || result?.data || []);

      progressArray.forEach(item => {
        const key = String(item.itemId);
        if (!merged[key]) {
          merged[key] = {};
        }
        merged[key][item.progressType] = {
          score: item.score || 0,
        };
      });

      progressCache[itemType] = merged;
      setProgressData(merged);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setProgressData({});
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [isAuthenticated, haveAccess, itemType]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const getProgress = useCallback((itemId, progressType) => {
    const key = String(itemId);
    const itemProgress = progressData[key];
    if (!itemProgress || !itemProgress[progressType]) {
      return { score: 0 };
    }
    return itemProgress[progressType];
  }, [progressData]);

  return {
    progressData,
    loading,
    getProgress,
    refetch: fetchProgress,
  };
};
