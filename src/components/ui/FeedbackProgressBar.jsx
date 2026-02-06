import { useEffect, useState, useRef } from 'react';
import { FEEDBACK_TYPES } from '../../constants';


export const FeedbackProgressBar = ({ duration, isActive, feedbackType, onComplete, theme }) => {
  const [progress, setProgress] = useState(100);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const progressBarColor = feedbackType === FEEDBACK_TYPES.SUCCESS
    ? theme.feedbackSuccess.progressBar
    : theme.feedbackError.progressBar;

  useEffect(() => {
    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (!isActive || duration <= 0) {
      setProgress(100);
      return;
    }

    // Start animation immediately
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
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
  }, [isActive, duration, onComplete]);

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
