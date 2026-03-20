import { useEffect, useState, useRef } from 'react';
import { FEEDBACK_TYPES } from '../../constants';


export const FeedbackProgressBar = ({ duration, isActive, paused, feedbackType, onComplete, theme }) => {
  const [progress, setProgress] = useState(100);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const totalPausedRef = useRef(0);
  const pauseStartRef = useRef(null);

  const progressBarColor = feedbackType === FEEDBACK_TYPES.SUCCESS
    ? theme.feedbackSuccess.progressBar
    : theme.feedbackError.progressBar;

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (paused) {
      pauseStartRef.current = Date.now();
      return;
    }

    // Accumulate paused time on resume
    if (pauseStartRef.current) {
      totalPausedRef.current += Date.now() - pauseStartRef.current;
      pauseStartRef.current = null;
    }

    if (!isActive || duration <= 0) {
      setProgress(100);
      startTimeRef.current = null;
      totalPausedRef.current = 0;
      return;
    }

    // Fresh start (new feedback)
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      totalPausedRef.current = 0;
    }

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current - totalPausedRef.current;
      const remaining = Math.max(0, duration - elapsed);
      const newProgress = (remaining / duration) * 100;

      setProgress(newProgress);

      if (remaining > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, duration, paused, onComplete]);

  // Reset on new feedback (duration change while active)
  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      totalPausedRef.current = 0;
      pauseStartRef.current = null;
    }
  }, [duration]);

  if (!isActive || duration < 1000) return null;

  return (
    <div className="w-full mt-4 -mb-3">
      <div className="h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressBarColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
