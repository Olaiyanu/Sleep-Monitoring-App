import { Moon, TrendingUp, Clock, Star, Trophy, Target } from 'lucide-react';
import { AppData } from '../App';

interface DashboardProps {
  data: AppData;
  setData: (data: AppData | ((prev: AppData) => AppData)) => void;
  darkMode: boolean;
}

export function Dashboard({ data, setData, darkMode }: DashboardProps) {
  const { sleepSessions, routineItems, currentSession, goals, achievements } = data;

  // Calculate stats
  const last7Days = sleepSessions.slice(-7);
  const avgDuration = last7Days.length > 0
    ? last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length
    : 0;
  const avgQuality = last7Days.length > 0
    ? last7Days.reduce((sum, s) => sum + s.quality, 0) / last7Days.length
    : 0;
  
  const lastNight = sleepSessions[sleepSessions.length - 1];
  const routineProgress = routineItems.length > 0
    ? (routineItems.filter(item => item.completed).length / routineItems.length) * 100
    : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const stats = [
    {
      label: 'Last Night',
      value: lastNight ? formatDuration(lastNight.duration) : 'No data',
      icon: Moon,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      label: 'Avg Duration (7d)',
      value: avgDuration > 0 ? formatDuration(avgDuration) : 'No data',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Avg Quality (7d)',
      value: avgQuality > 0 ? `${avgQuality.toFixed(1)}/5` : 'No data',
      icon: Star,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'Total Sessions',
      value: sleepSessions.length.toString(),
      icon: TrendingUp,
      color: 'from-rose-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Welcome Back!</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Here's your sleep overview</p>
      </div>

      {/* Current Session Banner */}
      {currentSession && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-6 h-6" />
            <h3 className="text-white">Sleep Session Active</h3>
          </div>
          <p className="text-indigo-100">
            Started at {new Date(currentSession.startTime).toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-2xl p-6 border ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
                : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
            }`}>
              <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className={darkMode ? 'text-gray-400 mb-1' : 'text-gray-600 mb-1'}>{stat.label}</p>
              <p className={darkMode ? 'text-white' : 'text-gray-900'}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Bedtime Routine Progress */}
      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <h3 className={darkMode ? 'text-white mb-4' : 'text-gray-900 mb-4'}>Today's Bedtime Routine</h3>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{Math.round(routineProgress)}%</span>
          </div>
          <div className={`w-full rounded-full h-3 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${routineProgress}%` }}
            />
          </div>
        </div>
        <div className="space-y-2">
          {routineItems.slice(0, 3).map((item) => (
            <div key={item.id} className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className={`w-2 h-2 rounded-full ${item.completed ? 'bg-green-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <span className={item.completed ? 'line-through' : ''}>{item.title}</span>
            </div>
          ))}
          {routineItems.length > 3 && (
            <p className={darkMode ? 'text-gray-500 mt-2' : 'text-gray-500 mt-2'}>
              +{routineItems.length - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Recent Sleep Quality */}
      {lastNight && (
        <div className={`rounded-2xl p-6 border ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <h3 className={darkMode ? 'text-white mb-4' : 'text-gray-900 mb-4'}>Last Night's Sleep</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className={darkMode ? 'text-gray-400 mb-1' : 'text-gray-600 mb-1'}>Duration</p>
              <p className={darkMode ? 'text-white' : 'text-gray-900'}>{formatDuration(lastNight.duration)}</p>
            </div>
            <div>
              <p className={darkMode ? 'text-gray-400 mb-1' : 'text-gray-600 mb-1'}>Quality</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= lastNight.quality
                        ? 'fill-yellow-400 text-yellow-400'
                        : darkMode ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className={darkMode ? 'text-gray-400 mb-1' : 'text-gray-600 mb-1'}>Time</p>
              <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                {new Date(lastNight.endTime).toLocaleDateString()}
              </p>
            </div>
          </div>
          {lastNight.notes && (
            <div className={`mt-4 p-3 rounded-xl border ${
              darkMode ? 'bg-gray-900/30 border-gray-700/30' : 'bg-white border-gray-100'
            }`}>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{lastNight.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Goals Progress */}
      {goals && goals.length > 0 && (
        <div className={`rounded-2xl p-6 border ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Target className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Active Goals</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.slice(0, 4).map(goal => {
              const progress = goal.type === 'quality' 
                ? (goal.current / goal.target) * 100
                : Math.min((goal.current / goal.target) * 100, 100);
              return (
                <div key={goal.id} className={`p-3 rounded-xl ${
                  darkMode ? 'bg-gray-900/30' : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {goal.type === 'duration' && 'Sleep Duration'}
                      {goal.type === 'quality' && 'Sleep Quality'}
                      {goal.type === 'consistency' && 'Consistency'}
                      {goal.type === 'streak' && 'Streak'}
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Achievements */}
      {achievements && achievements.filter(a => a.unlocked).length > 0 && (
        <div className={`rounded-2xl p-6 border ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Recent Achievements</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.filter(a => a.unlocked).slice(-4).map(achievement => (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl border text-center ${
                  darkMode 
                    ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-700/30' 
                    : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                }`}
              >
                <div className="text-3xl mb-1">{achievement.icon}</div>
                <p className={darkMode ? 'text-white' : 'text-gray-900'}>{achievement.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
