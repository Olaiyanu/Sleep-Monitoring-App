import { useState } from 'react';
import { Moon, Sun, Clock, Star } from 'lucide-react';
import { AppData, SleepSession } from '../App';

interface SleepTrackerProps {
  data: AppData;
  setData: (data: AppData | ((prev: AppData) => AppData)) => void;
  darkMode: boolean;
}

export function SleepTracker({ data, setData, darkMode }: SleepTrackerProps) {
  const { currentSession } = data;
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');

  const startSleep = () => {
    setData(prev => ({
      ...prev,
      currentSession: { startTime: new Date().toISOString() },
    }));
  };

  const endSleep = () => {
    if (!currentSession) return;

    const endTime = new Date();
    const startTime = new Date(currentSession.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    const newSession: SleepSession = {
      id: Date.now().toString(),
      startTime: currentSession.startTime,
      endTime: endTime.toISOString(),
      duration,
      quality,
      notes,
    };

    setData(prev => ({
      ...prev,
      sleepSessions: [...prev.sleepSessions, newSession],
      currentSession: null,
    }));

    setQuality(3);
    setNotes('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCurrentDuration = () => {
    if (!currentSession) return '0h 0m';
    const now = new Date();
    const start = new Date(currentSession.startTime);
    const minutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Sleep Tracker</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Start and stop your sleep sessions</p>
      </div>

      {currentSession ? (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-white/20 p-4 rounded-full">
                <Moon className="w-12 h-12" />
              </div>
            </div>
            <div>
              <h3 className="text-white mb-2">Sleep Session Active</h3>
              <p className="text-indigo-100">
                Started at {formatTime(new Date(currentSession.startTime))}
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-indigo-100 mb-2">Current Duration</p>
              <p className="text-white">{getCurrentDuration()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl p-8 border ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-full">
                <Moon className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h3 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Ready to Sleep?</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Start tracking your sleep session</p>
            </div>
            <button
              onClick={startSleep}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Start Sleep Session
              </div>
            </button>
          </div>
        </div>
      )}

      {currentSession && (
        <div className={`rounded-2xl p-6 border space-y-6 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>End Sleep Session</h3>

          <div>
            <label className={`block mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" />
                Sleep Quality
              </div>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setQuality(rating)}
                  className="group"
                >
                  <Star
                    className={`w-10 h-10 transition-all ${
                      rating <= quality
                        ? 'fill-yellow-400 text-yellow-400'
                        : darkMode 
                          ? 'text-gray-600 group-hover:text-yellow-200' 
                          : 'text-gray-300 group-hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className={darkMode ? 'text-gray-400 mt-2' : 'text-gray-600 mt-2'}>
              {quality === 1 && 'Poor'}
              {quality === 2 && 'Fair'}
              {quality === 3 && 'Good'}
              {quality === 4 && 'Very Good'}
              {quality === 5 && 'Excellent'}
            </p>
          </div>

          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you sleep? Any observations..."
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                darkMode 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              rows={3}
            />
          </div>

          <button
            onClick={endSleep}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <Sun className="w-5 h-5" />
              End Sleep Session
            </div>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-6 border ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h4 className={darkMode ? 'text-white' : 'text-gray-900'}>Optimal Sleep</h4>
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Adults need 7-9 hours of sleep per night</p>
        </div>
        <div className={`rounded-2xl p-6 border ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-5 h-5 text-purple-600" />
            <h4 className={darkMode ? 'text-white' : 'text-gray-900'}>Consistency</h4>
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Try to sleep and wake at the same time daily</p>
        </div>
        <div className={`rounded-2xl p-6 border ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-pink-600" />
            <h4 className={darkMode ? 'text-white' : 'text-gray-900'}>Quality Matters</h4>
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Focus on both duration and quality of sleep</p>
        </div>
      </div>
    </div>
  );
}
