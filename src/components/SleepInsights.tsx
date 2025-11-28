import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Star, Calendar } from 'lucide-react';
import { SleepSession } from '../App';

interface SleepInsightsProps {
  sessions: SleepSession[];
  darkMode: boolean;
}

interface Insight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  icon: any;
}

export function SleepInsights({ sessions, darkMode }: SleepInsightsProps) {
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    
    if (sessions.length === 0) {
      return [{
        type: 'info',
        title: 'Start Tracking Your Sleep',
        description: 'Begin logging your sleep sessions to receive personalized insights and recommendations.',
        icon: Lightbulb,
      }];
    }

    const last7Days = sessions.slice(-7);
    const last30Days = sessions.slice(-30);
    
    // Calculate averages
    const avgDuration7d = last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length;
    const avgQuality7d = last7Days.reduce((sum, s) => sum + s.quality, 0) / last7Days.length;
    const avgDuration30d = last30Days.length > 0 ? last30Days.reduce((sum, s) => sum + s.duration, 0) / last30Days.length : 0;
    
    // Sleep duration insights
    if (avgDuration7d < 420) { // Less than 7 hours
      insights.push({
        type: 'warning',
        title: 'Increase Sleep Duration',
        description: `Your average sleep is ${(avgDuration7d / 60).toFixed(1)} hours. Adults need 7-9 hours for optimal health. Try going to bed 30 minutes earlier.`,
        icon: Clock,
      });
    } else if (avgDuration7d >= 420 && avgDuration7d <= 540) {
      insights.push({
        type: 'positive',
        title: 'Great Sleep Duration!',
        description: `You're averaging ${(avgDuration7d / 60).toFixed(1)} hours of sleep, which is in the optimal range of 7-9 hours. Keep it up!`,
        icon: CheckCircle,
      });
    } else if (avgDuration7d > 540) { // More than 9 hours
      insights.push({
        type: 'info',
        title: 'Consider Sleep Quality',
        description: `You're sleeping ${(avgDuration7d / 60).toFixed(1)} hours on average. If you still feel tired, focus on improving sleep quality rather than duration.`,
        icon: Star,
      });
    }

    // Sleep quality insights
    if (avgQuality7d < 3) {
      insights.push({
        type: 'warning',
        title: 'Improve Sleep Quality',
        description: `Your average sleep quality is ${avgQuality7d.toFixed(1)}/5. Try establishing a consistent bedtime routine and creating a comfortable sleep environment.`,
        icon: Star,
      });
    } else if (avgQuality7d >= 4) {
      insights.push({
        type: 'positive',
        title: 'Excellent Sleep Quality!',
        description: `Your sleep quality rating is ${avgQuality7d.toFixed(1)}/5. Whatever you're doing is working great!`,
        icon: Star,
      });
    }

    // Consistency insights
    if (last7Days.length >= 5) {
      const durations = last7Days.map(s => s.duration);
      const variance = durations.reduce((sum, d) => sum + Math.abs(d - avgDuration7d), 0) / durations.length;
      
      if (variance > 90) { // More than 1.5 hours variation
        insights.push({
          type: 'info',
          title: 'Improve Sleep Consistency',
          description: 'Your sleep duration varies significantly. Try to go to bed and wake up at the same time each day for better sleep quality.',
          icon: Calendar,
        });
      } else {
        insights.push({
          type: 'positive',
          title: 'Consistent Sleep Schedule',
          description: 'You maintain a consistent sleep schedule! This helps regulate your circadian rhythm.',
          icon: CheckCircle,
        });
      }
    }

    // Trend insights
    if (last30Days.length >= 14) {
      const recent = last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length;
      const previous = last30Days.slice(-14, -7);
      if (previous.length >= 7) {
        const prevAvg = previous.reduce((sum, s) => sum + s.duration, 0) / previous.length;
        
        if (recent > prevAvg + 30) {
          insights.push({
            type: 'positive',
            title: 'Improving Sleep Duration',
            description: `Your sleep has increased by ${Math.round((recent - prevAvg) / 60 * 10) / 10} hours compared to the previous week. Great progress!`,
            icon: TrendingUp,
          });
        } else if (recent < prevAvg - 30) {
          insights.push({
            type: 'warning',
            title: 'Declining Sleep Duration',
            description: `Your sleep has decreased by ${Math.round((prevAvg - recent) / 60 * 10) / 10} hours compared to the previous week. Try to prioritize rest.`,
            icon: TrendingDown,
          });
        }
      }
    }

    return insights.slice(0, 6); // Limit to 6 insights
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [
      'Maintain a consistent sleep schedule, even on weekends',
      'Create a relaxing bedtime routine 30-60 minutes before sleep',
      'Keep your bedroom cool, dark, and quiet',
      'Avoid screens and blue light 1-2 hours before bedtime',
      'Limit caffeine intake after 2 PM',
      'Get regular exercise, but not close to bedtime',
      'Avoid large meals and alcohol before bed',
      'Use your bed only for sleep (not work or entertainment)',
    ];

    const last7Days = sessions.slice(-7);
    const avgQuality7d = last7Days.length > 0 
      ? last7Days.reduce((sum, s) => sum + s.quality, 0) / last7Days.length 
      : 0;
    const avgDuration7d = last7Days.length > 0
      ? last7Days.reduce((sum, s) => sum + s.duration, 0) / last7Days.length
      : 0;

    const personalizedRecs: string[] = [];

    if (avgDuration7d < 420) {
      personalizedRecs.push('Set a bedtime alarm to remind you to start winding down');
      personalizedRecs.push('Try gradually moving your bedtime 15 minutes earlier each week');
    }

    if (avgQuality7d < 3) {
      personalizedRecs.push('Consider using relaxation techniques like deep breathing or meditation');
      personalizedRecs.push('Evaluate your mattress and pillow - they should be comfortable and supportive');
    }

    return [...personalizedRecs, ...recommendations].slice(0, 8);
  };

  const insights = generateInsights();
  const recommendations = getRecommendations();

  const getInsightStyle = (type: string) => {
    if (type === 'positive') {
      return darkMode 
        ? 'from-green-900/50 to-emerald-900/50 border-green-700/30' 
        : 'from-green-50 to-emerald-50 border-green-200';
    }
    if (type === 'warning') {
      return darkMode 
        ? 'from-orange-900/50 to-amber-900/50 border-orange-700/30' 
        : 'from-orange-50 to-amber-50 border-orange-200';
    }
    return darkMode 
      ? 'from-blue-900/50 to-indigo-900/50 border-blue-700/30' 
      : 'from-blue-50 to-indigo-50 border-blue-200';
  };

  const getIconColor = (type: string) => {
    if (type === 'positive') return 'text-green-500';
    if (type === 'warning') return 'text-orange-500';
    return 'text-blue-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>Sleep Insights</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Personalized insights and recommendations based on your sleep patterns
        </p>
      </div>

      {/* Insights Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Your Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br rounded-2xl p-6 border ${getInsightStyle(insight.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    darkMode ? 'bg-gray-900/50' : 'bg-white/80'
                  }`}>
                    <Icon className={`w-6 h-6 ${getIconColor(insight.type)}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={darkMode ? 'text-white mb-2' : 'text-gray-900 mb-2'}>
                      {insight.title}
                    </h4>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-slate-800/50 border-gray-700/30' 
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Recommended Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-xl ${
                darkMode ? 'bg-gray-900/30' : 'bg-white'
              }`}
            >
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} />
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Health Tips */}
      <div className={`rounded-2xl p-6 border ${
        darkMode 
          ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700/30' 
          : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Did You Know?</h3>
        </div>
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/30' : 'bg-white/80'}`}>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>Sleep Cycles:</span> A complete sleep cycle lasts about 90 minutes. Waking up at the end of a cycle (after 6, 7.5, or 9 hours) can help you feel more refreshed.
            </p>
          </div>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/30' : 'bg-white/80'}`}>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>Body Temperature:</span> Your body temperature naturally drops during sleep. A cool room (60-67°F) can help signal to your body that it's time to rest.
            </p>
          </div>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/30' : 'bg-white/80'}`}>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>The 10-3-2-1-0 Rule:</span> No caffeine 10 hours before bed, no food or alcohol 3 hours before, no work 2 hours before, no screens 1 hour before, and 0 times hitting snooze in the morning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
