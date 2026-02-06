import { useState } from 'react';
import { Sidebar, DashboardView } from './Sidebar';
import { TopNav } from './TopNav';
import { StatsOverview } from './StatsOverview';
import { QuickActions } from './QuickActions';
import { RecentProducts } from './RecentProducts';
import { SubscriptionWidget } from './SubscriptionWidget';
import { NotificationsFeed } from './NotificationsFeed';
import { PerformanceChart } from './PerformanceChart';
import { AdsManager } from './AdsManager';

function DashboardContent({ language, activeView }: { language: 'ar' | 'fr'; activeView: DashboardView }) {
  // Ads Manager view (Admin only)
  if (activeView === 'ads') {
    return <AdsManager language={language} />;
  }

  // Default dashboard view - NO ADS displayed here (vendor dashboard stays clean)
  return (
    <>
      {/* Stats Overview */}
      <StatsOverview language={language} />
      
      {/* Quick Actions */}
      <QuickActions language={language} />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Products - Takes 2 columns */}
        <div className="xl:col-span-2">
          <RecentProducts language={language} />
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          <SubscriptionWidget language={language} />
          <NotificationsFeed language={language} />
        </div>
      </div>
      
      {/* Performance Chart */}
      <PerformanceChart language={language} />
    </>
  );
}

export default function VendorDashboard() {
  const [language, setLanguage] = useState<'ar' | 'fr'>('fr');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('dashboard');

  return (
    <div className={`min-h-screen bg-background grid-pattern ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        language={language}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <div className={`transition-all duration-300 ${language === 'ar' ? 'lg:mr-[280px]' : 'lg:ml-[280px]'} ${sidebarCollapsed && language !== 'ar' ? 'lg:ml-[72px]' : ''} ${sidebarCollapsed && language === 'ar' ? 'lg:mr-[72px]' : ''}`}>
        <TopNav 
          language={language} 
          onLanguageChange={setLanguage}
        />
        
        <main className="p-4 md:p-6 lg:p-12 space-y-8 lg:space-y-12">
          <DashboardContent language={language} activeView={activeView} />
        </main>
      </div>
    </div>
  );
}
