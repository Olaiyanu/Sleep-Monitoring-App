import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { AppData, RoutineItem } from '../App';

interface BedtimeRoutinesProps {
  data: AppData;
  setData: (data: AppData | ((prev: AppData) => AppData)) => void;
  darkMode: boolean;
}

export function BedtimeRoutines({ data, setData, darkMode }: BedtimeRoutinesProps) {
  const { routineItems } = data;
  const [newItemTitle, setNewItemTitle] = useState('');

  const toggleItem = (id: string) => {
    setData(prev => ({
      ...prev,
      routineItems: prev.routineItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const addItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: RoutineItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      completed: false,
    };

    setData(prev => ({
      ...prev,
      routineItems: [...prev.routineItems, newItem],
    }));

    setNewItemTitle('');
  };

  const deleteItem = (id: string) => {
    setData(prev => ({
      ...prev,
      routineItems: prev.routineItems.filter(item => item.id !== id),
    }));
  };

  const resetRoutine = () => {
    setData(prev => ({
      ...prev,
      routineItems: prev.routineItems.map(item => ({ ...item, completed: false })),
    }));
  };

  const completedCount = routineItems.filter(item => item.completed).length;
  const progress = routineItems.length > 0 ? (completedCount / routineItems.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Bedtime Routines</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Create and track your nightly routine for better sleep</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white mb-1">Tonight's Progress</h3>
            <p className="text-indigo-100">
              {completedCount} of {routineItems.length} completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-white">{Math.round(progress)}%</p>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {completedCount === routineItems.length && routineItems.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <p>Great job! Your routine is complete!</p>
          </div>
        )}
      </div>

      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <h3 className={darkMode ? 'text-white mb-4' : 'text-gray-900 mb-4'}>Add Routine Item</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="e.g., Meditate for 10 minutes"
            className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode 
                ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
          <button
            onClick={addItem}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Your Routine</h3>
          {routineItems.length > 0 && (
            <button
              onClick={resetRoutine}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
              }`}
            >
              Reset All
            </button>
          )}
        </div>

        {routineItems.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <CheckCircle2 className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <p className={darkMode ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>No routine items yet</p>
            <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Add your first item to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {routineItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all group ${
                  darkMode 
                    ? 'bg-gray-900/30 border-gray-700/30 hover:bg-gray-900/50' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex-shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className={`w-6 h-6 transition-colors ${
                      darkMode 
                        ? 'text-gray-600 group-hover:text-indigo-400' 
                        : 'text-gray-300 group-hover:text-indigo-400'
                    }`} />
                  )}
                </button>
                <p
                  className={`flex-1 transition-all ${
                    item.completed 
                      ? darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {item.title}
                </p>
                <button
                  onClick={() => deleteItem(item.id)}
                  className={`flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100 ${
                    darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <h3 className={darkMode ? 'text-white mb-4' : 'text-gray-900 mb-4'}>Routine Tips</h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Start your routine 30-60 minutes before bedtime</p>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avoid screens and bright lights</p>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Create a calm, comfortable environment</p>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Be consistent with your routine every night</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
