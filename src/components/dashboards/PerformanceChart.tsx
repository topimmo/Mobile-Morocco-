import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PerformanceChartProps {
  language: 'ar' | 'fr';
}

const data = [
  { date: '01/12', views: 420, clicks: 45 },
  { date: '05/12', views: 580, clicks: 62 },
  { date: '10/12', views: 720, clicks: 78 },
  { date: '15/12', views: 650, clicks: 71 },
  { date: '20/12', views: 890, clicks: 95 },
  { date: '25/12', views: 1020, clicks: 112 },
  { date: '30/12', views: 1240, clicks: 134 },
];

const CustomTooltip = ({ active, payload, label, language: _language }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border border-white/10 rounded-lg">
        <p className="font-mono-jet text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-mono-jet font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({ language }: PerformanceChartProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-grotesk font-semibold mb-1 ${language === 'ar' ? 'font-tajawal' : ''}`}>
            {language === 'fr' ? 'Performance des 30 Derniers Jours' : 'أداء آخر 30 يومًا'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'fr' ? 'Vues et clics de contact' : 'المشاهدات ونقرات الاتصال'}
          </p>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E67E22" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#E67E22" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip content={<CustomTooltip language={language} />} />
            <Legend 
              wrapperStyle={{ 
                fontFamily: language === 'ar' ? 'Tajawal' : 'Outfit',
                fontSize: '14px'
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              name={language === 'fr' ? 'Vues' : 'المشاهدات'}
              stroke="#00D9FF"
              strokeWidth={3}
              dot={{ fill: '#00D9FF', r: 5 }}
              activeDot={{ r: 7, fill: '#00D9FF', stroke: '#fff', strokeWidth: 2 }}
              fill="url(#colorViews)"
            />
            <Line
              type="monotone"
              dataKey="clicks"
              name={language === 'fr' ? 'Clics' : 'النقرات'}
              stroke="#E67E22"
              strokeWidth={3}
              dot={{ fill: '#E67E22', r: 5 }}
              activeDot={{ r: 7, fill: '#E67E22', stroke: '#fff', strokeWidth: 2 }}
              fill="url(#colorClicks)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
