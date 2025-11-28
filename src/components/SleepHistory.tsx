import { Trash2, Star, Clock, Calendar } from 'lucide-react';
import { SleepSession, AppData } from '../App';

interface SleepHistoryProps {
  sessions: SleepSession[];
  setData: (data: AppData | ((prev: AppData) => AppData)) => void;
  darkMode: boolean;
}

export function SleepHistory({ sessions, setData, darkMode }: SleepHistoryProps) {
  const deleteSession = (id: string) => {
    setData(prev => ({
      ...prev,
      sleepSessions: prev.sleepSessions.filter(s => s.id !== id),
    }));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (date: string) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  const sortedSessions = [...sessions].reverse();

  return (
    <div className="space-y-6">
      <div>
        <h2 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Sleep History</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>View and manage your past sleep sessions</p>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-16">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Calendar className={`w-10 h-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <p className={darkMode ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>No sleep history yet</p>
          <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Your sleep sessions will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => {
            const startDateTime = formatDateTime(session.startTime);
            const endDateTime = formatDateTime(session.endTime);

            return (
              <div
                key={session.id}
                className={`rounded-2xl p-6 border hover:shadow-md transition-all group ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>{endDateTime.date}</h3>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= session.quality
                                ? 'fill-yellow-400 text-yellow-400'
                                : darkMode ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className={`transition-colors opacity-0 group-hover:opacity-100 ${
                      darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                      <Clock className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Duration</p>
                      <p className={darkMode ? 'text-white' : 'text-gray-900'}>{formatDuration(session.duration)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                      <Calendar className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Bedtime</p>
                      <p className={darkMode ? 'text-white' : 'text-gray-900'}>{startDateTime.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-pink-900/30' : 'bg-pink-100'}`}>
                      <Calendar className={`w-5 h-5 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Wake Time</p>
                      <p className={darkMode ? 'text-white' : 'text-gray-900'}>{endDateTime.time}</p>
                    </div>
                  </div>
                </div>

                {session.notes && (
                  <div className={`p-4 rounded-xl border ${
                    darkMode ? 'bg-gray-900/30 border-gray-700/30' : 'bg-white border-gray-200'
                  }`}>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{session.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sortedSessions.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="text-white mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-indigo-100 mb-1">Total Sessions</p>
              <p className="text-white">{sessions.length}</p>
            </div>
            <div>
              <p className="text-indigo-100 mb-1">Avg Duration</p>
              <p className="text-white">
                {formatDuration(
                  sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
                )}
              </p>
            </div>
            <div>
              <p className="text-indigo-100 mb-1">Avg Quality</p>
              <p className="text-white">
                {(sessions.reduce((sum, s) => sum + s.quality, 0) / sessions.length).toFixed(1)}/5
              </p>
            </div>
            <div>
              <p className="text-indigo-100 mb-1">Total Hours</p>
              <p className="text-white">
                {(sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
