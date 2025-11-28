import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Clock, Star, Calendar } from 'lucide-react';
import { SleepSession } from '../App';

interface SleepAnalyticsProps {
  sessions: SleepSession[];
  darkMode: boolean;
}

export function SleepAnalytics({ sessions, darkMode }: SleepAnalyticsProps) {
  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Sleep Analytics</h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your sleep patterns and quality over time</p>
        </div>
        <div className="text-center py-16">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <TrendingUp className={`w-10 h-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <p className={darkMode ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2'}>No sleep data yet</p>
          <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Start tracking your sleep to see analytics</p>
        </div>
      </div>
    );
  }

  const last30Sessions = sessions.slice(-30);
  
  const durationData = last30Sessions.map((session, index) => ({
    name: new Date(session.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    duration: Number((session.duration / 60).toFixed(1)),
    index: index + 1,
  }));

  const qualityData = last30Sessions.map((session, index) => ({
    name: new Date(session.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    quality: session.quality,
    index: index + 1,
  }));

  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 60;
  const avgQuality = sessions.reduce((sum, s) => sum + s.quality, 0) / sessions.length;
  
  const last7Days = sessions.slice(-7);
  const avgDuration7d = last7Days.length > 0 
    ? last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length / 60
    : 0;
  const avgQuality7d = last7Days.length > 0
    ? last7Days.reduce((sum, s) => sum + s.quality, 0) / last7Days.length
    : 0;

  const qualityDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star${rating > 1 ? 's' : ''}`,
    count: sessions.filter(s => s.quality === rating).length,
  }));

  const stats = [
    {
      label: 'Total Sleep Hours',
      value: `${totalHours.toFixed(1)}h`,
      icon: Clock,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      label: 'Avg Duration (All)',
      value: `${avgDuration.toFixed(1)}h`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Avg Quality (All)',
      value: `${avgQuality.toFixed(1)}/5`,
      icon: Star,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'Total Sessions',
      value: sessions.length.toString(),
      icon: Calendar,
      color: 'from-rose-500 to-orange-500',
    },
  ];

  const axisColor = darkMode ? '#9ca3af' : '#9ca3af';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="space-y-6">
      <div>
        <h2 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Sleep Analytics</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your sleep patterns and quality over time</p>
      </div>

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

      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <h3 className={darkMode ? 'text-white mb-4' : 'text-gray-900 mb-4'}>Sleep Duration Trend</h3>
        <div style={{ width: '100%', height: '256px' }}>
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={durationData}>
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <YAxis 
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: axisColor }}
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : 'white', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  padding: '8px 12px',
                  color: darkMode ? '#fff' : '#000',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="duration" 
                stroke="#6366f1" 
                strokeWidth={2}
                fill="url(#colorDuration)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last 7 Days Average</p>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{avgDuration7d.toFixed(1)} hours</p>
          </div>
          <div className="text-right">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Recommended</p>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>7-9 hours</p>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <h3 className={darkMode ? 'text-white mb-4' : 'text-gray-900 mb-4'}>Sleep Quality Trend</h3>
        <div style={{ width: '100%', height: '256px' }}>
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <YAxis 
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                label={{ value: 'Quality Rating', angle: -90, position: 'insideLeft', fill: axisColor }}
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : 'white', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  padding: '8px 12px',
                  color: darkMode ? '#fff' : '#000',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#ec4899" 
                strokeWidth={2}
                dot={{ fill: '#ec4899', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Last 7 Days Average</p>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{avgQuality7d.toFixed(1)}/5</p>
          </div>
          <div className="text-right">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Overall Average</p>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{avgQuality.toFixed(1)}/5</p>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <h3 className={darkMode ? 'text-white mb-4' : 'text-gray-900 mb-4'}>Quality Distribution</h3>
        <div style={{ width: '100%', height: '256px' }}>
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={qualityDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="rating" 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <YAxis 
                label={{ value: 'Sessions', angle: -90, position: 'insideLeft', fill: axisColor }}
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1f2937' : 'white', 
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '0.75rem',
                  padding: '8px 12px',
                  color: darkMode ? '#fff' : '#000',
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
