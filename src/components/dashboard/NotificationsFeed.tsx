import { CheckCircle, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsFeedProps {
  language: 'ar' | 'fr';
}

const notifications = {
  fr: [
    {
      icon: CheckCircle,
      title: 'Produit approuvé',
      message: 'iPhone 15 Pro Max a été approuvé',
      time: 'Il y a 2h',
      type: 'success',
    },
    {
      icon: MessageSquare,
      title: 'Nouveau message',
      message: 'Réponse du support reçue',
      time: 'Il y a 5h',
      type: 'info',
    },
    {
      icon: AlertCircle,
      title: 'Action requise',
      message: 'Mettez à jour les informations de paiement',
      time: 'Il y a 1j',
      type: 'warning',
    },
    {
      icon: Clock,
      title: 'Rappel',
      message: 'Abonnement expire dans 23 jours',
      time: 'Il y a 2j',
      type: 'info',
    },
  ],
  ar: [
    {
      icon: CheckCircle,
      title: 'تمت الموافقة على المنتج',
      message: 'تمت الموافقة على آيفون 15 برو ماكس',
      time: 'منذ ساعتين',
      type: 'success',
    },
    {
      icon: MessageSquare,
      title: 'رسالة جديدة',
      message: 'تم استلام رد الدعم',
      time: 'منذ 5 ساعات',
      type: 'info',
    },
    {
      icon: AlertCircle,
      title: 'مطلوب إجراء',
      message: 'قم بتحديث معلومات الدفع',
      time: 'منذ يوم',
      type: 'warning',
    },
    {
      icon: Clock,
      title: 'تذكير',
      message: 'ينتهي الاشتراك في 23 يومًا',
      time: 'منذ يومين',
      type: 'info',
    },
  ],
};

const typeColors = {
  success: 'text-success',
  info: 'text-accent',
  warning: 'text-warning',
};

export function NotificationsFeed({ language }: NotificationsFeedProps) {
  const items = notifications[language];

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className={`text-lg font-grotesk font-semibold mb-4 ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
        {language === 'fr' ? 'Notifications' : 'الإشعارات'}
      </h3>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {items.map((notification, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 border border-white/5"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${typeColors[notification.type as keyof typeof typeColors]}`}>
                  <notification.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium mb-1 ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
                    {notification.title}
                  </p>
                  <p className={`text-xs text-muted-foreground mb-2 ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono-jet">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
