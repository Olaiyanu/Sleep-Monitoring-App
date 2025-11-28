import { useState, useEffect } from 'react';
import { Target, Trophy, Award, Star, Flame, Calendar, Clock, TrendingUp, Plus, CheckCircle } from 'lucide-react';
import { AppData, SleepGoal, Achievement } from '../App';

interface SleepGoalsProps {
  data: AppData;
  setData: (data: AppData | ((prev: AppData) => AppData)) => void;
  darkMode: boolean;
}

export function SleepGoals({ data, setData, darkMode }: SleepGoalsProps) {
  const { sleepSessions, goals, achievements } = data;
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Initialize default goals if none exist
  useEffect(() => {
    if (goals.length === 0) {
      const defaultGoals: SleepGoal[] = [
        { id: '1', type: 'duration', target: 480, current: 0, unit: 'minutes' },
        { id: '2', type: 'quality', target: 4, current: 0, unit: 'rating' },
        { id: '3', type: 'consistency', target: 7, current: 0, unit: 'days' },
        { id: '4', type: 'streak', target: 7, current: 0, unit: 'days' },
      ];
      setData(prev => ({ ...prev, goals: defaultGoals }));
    }
  }, [goals.length, setData]);

  // Initialize achievements
  useEffect(() => {
    if (achievements.length === 0) {
      const allAchievements: Achievement[] = [
        {
          id: 'first_sleep',
          title: 'First Night',
          description: 'Log your first sleep session',
          icon: '🌙',
          unlocked: false,
          category: 'milestone',
        },
        {
          id: 'week_streak',
          title: 'Week Warrior',
          description: 'Track sleep for 7 consecutive days',
          icon: '🔥',
          unlocked: false,
          category: 'streak',
        },
        {
          id: 'month_streak',
          title: 'Monthly Master',
          description: 'Track sleep for 30 consecutive days',
          icon: '🏆',
          unlocked: false,
          category: 'streak',
        },
        {
          id: 'perfect_week',
          title: 'Perfect Week',
          description: 'Get 7-9 hours of sleep for 7 days straight',
          icon: '⭐',
          unlocked: false,
          category: 'consistency',
        },
        {
          id: 'quality_master',
          title: 'Quality Master',
          description: 'Achieve 5-star quality rating 5 times',
          icon: '💎',
          unlocked: false,
          category: 'quality',
        },
        {
          id: 'early_bird',
          title: 'Early Bird',
          description: 'Log 10 sleep sessions',
          icon: '🐦',
          unlocked: false,
          category: 'milestone',
        },
        {
          id: 'sleep_champion',
          title: 'Sleep Champion',
          description: 'Log 50 sleep sessions',
          icon: '👑',
          unlocked: false,
          category: 'milestone',
        },
        {
          id: 'consistency_king',
          title: 'Consistency King',
          description: 'Maintain consistent sleep schedule for 14 days',
          icon: '🎯',
          unlocked: false,
          category: 'consistency',
        },
        {
          id: 'quality_streak',
          title: 'Quality Streak',
          description: 'Get 4+ star rating for 10 consecutive sessions',
          icon: '✨',
          unlocked: false,
          category: 'quality',
        },
        {
          id: 'hundred_club',
          title: '100 Club',
          description: 'Log 100 sleep sessions',
          icon: '💯',
          unlocked: false,
          category: 'milestone',
        },
      ];
      setData(prev => ({ ...prev, achievements: allAchievements }));
    }
  }, [achievements.length, setData]);

  // Check and unlock achievements
  useEffect(() => {
    if (sleepSessions.length === 0 || achievements.length === 0) return;

    let updated = false;
    const newAchievements = achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_sleep':
          shouldUnlock = sleepSessions.length >= 1;
          break;
        case 'early_bird':
          shouldUnlock = sleepSessions.length >= 10;
          break;
        case 'sleep_champion':
          shouldUnlock = sleepSessions.length >= 50;
          break;
        case 'hundred_club':
          shouldUnlock = sleepSessions.length >= 100;
          break;
        case 'quality_master':
          shouldUnlock = sleepSessions.filter(s => s.quality === 5).length >= 5;
          break;
        case 'week_streak':
          shouldUnlock = checkConsecutiveDays(7);
          break;
        case 'month_streak':
          shouldUnlock = checkConsecutiveDays(30);
          break;
        case 'perfect_week':
          shouldUnlock = checkPerfectWeek();
          break;
        case 'consistency_king':
          shouldUnlock = checkConsistency(14);
          break;
        case 'quality_streak':
          shouldUnlock = checkQualityStreak();
          break;
      }

      if (shouldUnlock) {
        updated = true;
        return { ...achievement, unlocked: true, unlockedDate: new Date().toISOString() };
      }
      return achievement;
    });

    if (updated) {
      setData(prev => ({ ...prev, achievements: newAchievements }));
    }
  }, [sleepSessions, achievements, setData]);

  // Update goal progress
  useEffect(() => {
    if (sleepSessions.length === 0 || goals.length === 0) return;

    const last7Days = sleepSessions.slice(-7);
    const avgDuration = last7Days.length > 0
      ? last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length
      : 0;
    const avgQuality = last7Days.length > 0
      ? last7Days.reduce((sum, s) => sum + s.quality, 0) / last7Days.length
      : 0;

    const updatedGoals = goals.map(goal => {
      switch (goal.type) {
        case 'duration':
          return { ...goal, current: Math.round(avgDuration) };
        case 'quality':
          return { ...goal, current: Math.round(avgQuality * 10) / 10 };
        case 'consistency':
          return { ...goal, current: checkConsecutiveDays(Infinity) };
        case 'streak':
          return { ...goal, current: checkConsecutiveDays(Infinity) };
        default:
          return goal;
      }
    });

    setData(prev => ({ ...prev, goals: updatedGoals }));
  }, [sleepSessions]);

  const checkConsecutiveDays = (target: number): number => {
    if (sleepSessions.length === 0) return 0;

    const sortedSessions = [...sleepSessions].sort((a, b) => 
      new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
    );

    let streak = 1;
    let currentDate = new Date(sortedSessions[0].endTime);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].endTime);
      sessionDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
        currentDate = sessionDate;
        if (streak >= target && target !== Infinity) break;
      } else if (dayDiff > 1) {
        break;
      }
    }

    return streak;
  };

  const checkPerfectWeek = (): boolean => {
    const last7 = sleepSessions.slice(-7);
    if (last7.length < 7) return false;
    return last7.every(s => s.duration >= 420 && s.duration <= 540);
  };

  const checkConsistency = (days: number): boolean => {
    const recent = sleepSessions.slice(-days);
    if (recent.length < days) return false;
    
    const avgDuration = recent.reduce((sum, s) => sum + s.duration, 0) / recent.length;
    const variance = recent.reduce((sum, s) => sum + Math.abs(s.duration - avgDuration), 0) / recent.length;
    
    return variance < 60; // Less than 1 hour variance
  };

  const checkQualityStreak = (): boolean => {
    const last10 = sleepSessions.slice(-10);
    if (last10.length < 10) return false;
    return last10.every(s => s.quality >= 4);
  };

  const updateGoal = (id: string, target: number) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, target } : g),
    }));
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'duration': return Clock;
      case 'quality': return Star;
      case 'consistency': return Calendar;
      case 'streak': return Flame;
      default: return Target;
    }
  };

  const getGoalTitle = (type: string) => {
    switch (type) {
      case 'duration': return 'Average Sleep Duration';
      case 'quality': return 'Average Sleep Quality';
      case 'consistency': return 'Consistency Streak';
      case 'streak': return 'Current Streak';
      default: return 'Goal';
    }
  };

  const formatGoalValue = (goal: SleepGoal) => {
    if (goal.type === 'duration') {
      const hours = Math.floor(goal.current / 60);
      const mins = goal.current % 60;
      return `${hours}h ${mins}m`;
    }
    return `${goal.current}${goal.type === 'quality' ? '' : ' days'}`;
  };

  const formatGoalTarget = (goal: SleepGoal) => {
    if (goal.type === 'duration') {
      const hours = Math.floor(goal.target / 60);
      const mins = goal.target % 60;
      return `${hours}h ${mins}m`;
    }
    return `${goal.target}${goal.type === 'quality' ? '' : ' days'}`;
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      <div>
        <h2 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Goals & Achievements</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your progress and unlock achievements</p>
      </div>

      {/* Goals Section */}
      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Your Goals</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const Icon = getGoalIcon(goal.type);
            const progress = goal.type === 'quality' 
              ? (goal.current / goal.target) * 100
              : Math.min((goal.current / goal.target) * 100, 100);
            const isComplete = goal.current >= goal.target;

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-900/30 border-gray-700/30' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isComplete
                        ? 'bg-green-500/20'
                        : darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isComplete 
                          ? 'text-green-500' 
                          : darkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className={darkMode ? 'text-white' : 'text-gray-900'}>{getGoalTitle(goal.type)}</h4>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {formatGoalValue(goal)} / {formatGoalTarget(goal)}
                      </p>
                    </div>
                  </div>
                  {isComplete && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <div className={`w-full rounded-full h-2 overflow-hidden ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete 
                        ? 'bg-green-500' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Achievements</h3>
          </div>
          <div className={`px-3 py-1 rounded-full ${
            darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
          }`}>
            {unlockedAchievements.length}/{achievements.length}
          </div>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h4 className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unlocked</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border ${
                    darkMode 
                      ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-700/30' 
                      : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className={darkMode ? 'text-white mb-1' : 'text-gray-900 mb-1'}>{achievement.title}</h4>
                    <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    {achievement.unlockedDate && (
                      <p className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {new Date(achievement.unlockedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h4 className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Locked</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {lockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-900/30 border-gray-700/30' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 opacity-30 grayscale">{achievement.icon}</div>
                    <h4 className={darkMode ? 'text-gray-400 mb-1' : 'text-gray-600 mb-1'}>{achievement.title}</h4>
                    <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Motivational Stats */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-white mb-4">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-indigo-100 mb-1">Total Sleep</p>
            <p className="text-white">
              {(sleepSessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(0)}h
            </p>
          </div>
          <div>
            <p className="text-indigo-100 mb-1">Sessions</p>
            <p className="text-white">{sleepSessions.length}</p>
          </div>
          <div>
            <p className="text-indigo-100 mb-1">Current Streak</p>
            <p className="text-white">{checkConsecutiveDays(Infinity)} days</p>
          </div>
          <div>
            <p className="text-indigo-100 mb-1">Achievements</p>
            <p className="text-white">{unlockedAchievements.length}/{achievements.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
