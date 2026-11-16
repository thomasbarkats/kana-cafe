import { MASCOT_PERCH_BAND } from '../../constants';
import { useIsMobile } from '../../hooks/useIsMobile';

// The mobile layout gives a little more of the available room to the bottom spacer, bringing
// the mascot closer to the top without risking a crop on short screens.
export const CenteredLayout = ({ className = '', children }) => {
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={isMobile ? 'flex-[0.6]' : 'flex-1'} style={isMobile ? { minHeight: MASCOT_PERCH_BAND } : undefined} />
      {children}
      <div className="flex-1" />
    </div>
  );
};
