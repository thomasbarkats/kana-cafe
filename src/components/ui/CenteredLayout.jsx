import { MASCOT_PERCH_BAND } from '../../constants';
import { useIsMobile } from '../../hooks/useIsMobile';

// Centres its content vertically on its own terms, ignoring the mascot perched above it:
// both spacers grow equally. The top one keeps a floor, so on a screen too short to centre
// without pushing her off-frame the content slides down rather than cropping her.
export const CenteredLayout = ({ className = '', children }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="flex-1" style={isMobile ? { minHeight: MASCOT_PERCH_BAND } : undefined} />
      {children}
      <div className="flex-1" />
    </div>
  );
};
