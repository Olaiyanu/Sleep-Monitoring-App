import { useState, useEffect } from 'react';
import { Moon, Sun, Activity, CheckCircle2, Lightbulb, Target } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { SleepTracker } from './components/SleepTracker';
import { BedtimeRoutines } from './components/BedtimeRoutines';
import { SleepAnalytics } from './components/SleepAnalytics';
import { SleepHistory } from './components/SleepHistory';
import { SleepInsights } from './components/SleepInsights';
import { SleepGoals } from './components/SleepGoals';

export interface SleepSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  quality: number; // 1-5
  notes: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface SleepGoal {
  id: string;
  type: 'duration' | 'quality' | 'consistency' | 'streak';
  target: number;
  current: number;
  unit: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: 'milestone' | 'streak' | 'quality' | 'consistency';
}

export interface AppData {
  sleepSessions: SleepSession[];
  routineItems: RoutineItem[];
  currentSession: { startTime: string } | null;
  goals: SleepGoal[];
  achievements: Achievement[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracker' | 'routines' | 'analytics' | 'history' | 'insights' | 'goals'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState<AppData>({
    sleepSessions: [],
    routineItems: [],
    currentSession: null,
    goals: [],
    achievements: [],
  });

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('sleepMonitorData');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      // Initialize with default routine items
      setData(prev => ({
        ...prev,
        routineItems: [
          { id: '1', title: 'Brush teeth', completed: false },
          { id: '2', title: 'Take a warm shower', completed: false },
          { id: '3', title: 'Read for 15 minutes', completed: false },
          { id: '4', title: 'Dim the lights', completed: false },
          { id: '5', title: 'Set phone to Do Not Disturb', completed: false },
        ],
      }));
    }
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('sleepMonitorDarkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('sleepMonitorData', JSON.stringify(data));
  }, [data]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('sleepMonitorDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Activity },
    { id: 'tracker' as const, label: 'Sleep Tracker', icon: Moon },
    { id: 'routines' as const, label: 'Routines', icon: CheckCircle2 },
    { id: 'goals' as const, label: 'Goals', icon: Target },
    { id: 'insights' as const, label: 'Insights', icon: Lightbulb },
    { id: 'analytics' as const, label: 'Analytics', icon: Activity },
    { id: 'history' as const, label: 'History', icon: Sun },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950' 
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={darkMode ? 'text-white' : 'text-gray-900'}>Sleep Monitor</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your sleep and improve your rest</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } shadow-sm`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`rounded-2xl shadow-sm mb-6 p-2 flex flex-wrap gap-2 ${
          darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
        }`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className={`rounded-2xl shadow-sm p-6 ${
          darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
        }`}>
          {activeTab === 'dashboard' && <Dashboard data={data} setData={setData} darkMode={darkMode} />}
          {activeTab === 'tracker' && <SleepTracker data={data} setData={setData} darkMode={darkMode} />}
          {activeTab === 'routines' && <BedtimeRoutines data={data} setData={setData} darkMode={darkMode} />}
          {activeTab === 'goals' && <SleepGoals data={data} setData={setData} darkMode={darkMode} />}
          {activeTab === 'insights' && <SleepInsights sessions={data.sleepSessions} darkMode={darkMode} />}
          {activeTab === 'analytics' && <SleepAnalytics sessions={data.sleepSessions} darkMode={darkMode} />}
          {activeTab === 'history' && <SleepHistory sessions={data.sleepSessions} setData={setData} darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}
