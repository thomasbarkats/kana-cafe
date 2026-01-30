import { useEffect, useState } from 'react';
import { GAME_STATES, SORT_MODES } from '../constants';
import { useGameContext } from '../contexts/GameContext';
import { useTranslation } from '../contexts/I18nContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { SkeletonTable } from './ui/SkeletonLoading';
import { Button } from './ui/Button';
import { EscapeKey } from './ui/EscapeKey';
import { Select } from './ui/Select';


export const ReviewLayout = ({
  sortOptions,
  getAllItems,
  renderTable,
  isMergedSort,
  loading = false,
  expectedCount = 0,
  renderControls = null,
  renderGlobalProgress = null,
  isModalOpen = false,
}) => {
  const { t } = useTranslation();
  const { theme } = usePreferences();
  const { setGameState } = useGameContext();

  const [sortBy, setSortBy] = useState(SORT_MODES.DEFAULT);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isModalOpen) {
        setGameState(GAME_STATES.MENU);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGameState, isModalOpen]);

  const allItems = getAllItems(sortBy);
  const shouldMerge = isMergedSort(sortBy);

  return (
    <div className={`min-h-screen ${theme.bg} p-4 flex items-center`}>
      <div className="w-full max-w-5xl mx-auto">
        <div className={`${theme.cardBg} backdrop-blur-sm rounded-3xl shadow-2xl p-8`}>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-start gap-2">
              <Button onClick={() => setGameState(GAME_STATES.MENU)} variant="primary">
                {t('common.backToMenu')}
              </Button>
              <EscapeKey />
            </div>

            <div className="flex items-center gap-3">
              {renderControls && renderControls()}
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />
            </div>
          </div>

          {renderGlobalProgress && renderGlobalProgress()}

          <div className="space-y-8">
            {loading ? (
              <SkeletonTable theme={theme} rows={Math.min(expectedCount || 20, 20)} columns={3} showHeader={true} />
            ) : shouldMerge ? (
              // Merged view: single table with all items
              renderTable(allItems, null)
            ) : (
              // Grouped view: separate tables per list
              (() => {
                const uniqueListKeys = [...new Set(allItems.map(item => item.listKey))];
                return uniqueListKeys.map(listKey => {
                  const listItems = allItems.filter(item => item.listKey === listKey);
                  if (listItems.length === 0) return null;

                  const listName = listItems[0].listName;
                  const showTitle = uniqueListKeys.length > 1;

                  return renderTable(listItems, showTitle ? listName : null, listKey);
                });
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
