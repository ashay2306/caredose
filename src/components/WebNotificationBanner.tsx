import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Volume2, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { notificationService, NotificationPermissionStatus } from '../services/notificationService';
import { soundService } from '../services/soundService';
import { Medicine, FamilyMember } from '../types/medicare';

interface WebNotificationBannerProps {
  medicines: Medicine[];
  members: FamilyMember[];
  onTriggerModalReminder?: () => void;
}

export const WebNotificationBanner: React.FC<WebNotificationBannerProps> = ({
  medicines,
  members,
  onTriggerModalReminder,
}) => {
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default');
  const [lastNotificationStatus, setLastNotificationStatus] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Initial status and subscription
    const unsubscribe = notificationService.subscribe((status) => {
      setPermission(status);
    });
    return unsubscribe;
  }, []);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const res = await notificationService.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        soundService.playSuccessDing();
        notificationService.sendTestNotification(medicines[0], members[0]);
        setLastNotificationStatus('✅ Push notifications activated! Sent sample dose alert.');
      } else if (res === 'denied') {
        setLastNotificationStatus('⚠️ Permission denied in browser settings.');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSendTestPush = () => {
    soundService.playReminderChime();
    const targetMed = medicines[0];
    const targetMember = members.find((m) => m.id === targetMed?.profileId) || members[0];
    const success = notificationService.sendTestNotification(targetMed, targetMember);

    if (success) {
      setLastNotificationStatus('🔔 Push alert delivered to browser / OS notification center!');
    } else {
      if (permission !== 'granted') {
        handleRequestPermission();
      } else {
        setLastNotificationStatus('⚠️ Could not dispatch notification.');
      }
    }

    setTimeout(() => {
      setLastNotificationStatus(null);
    }, 5000);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            permission === 'granted'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : permission === 'denied'
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-teal-50 text-teal-600 border border-teal-200'
          }`}>
            {permission === 'granted' ? (
              <BellRing className="w-5 h-5 animate-bounce" />
            ) : permission === 'denied' ? (
              <BellOff className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">
                Web Browser Push Notifications
              </h3>

              {permission === 'granted' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active & Armed
                </span>
              )}

              {permission === 'default' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Permission Needed
                </span>
              )}

              {permission === 'denied' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                  <BellOff className="w-3 h-3 text-rose-600" />
                  Blocked in Browser
                </span>
              )}

              {permission === 'unsupported' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                  Unsupported
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {permission === 'granted'
                ? 'Your device will receive native push alerts when scheduled medicine dose times arrive, even if this browser tab is in the background.'
                : permission === 'denied'
                ? 'Notifications were blocked in site settings. Click your browser URL bar lock icon to allow notifications for full alerts.'
                : 'Turn on native push alerts so you and family members get alerted promptly at every scheduled medication time.'}
            </p>

            {lastNotificationStatus && (
              <p className="text-xs font-medium text-emerald-700 mt-1.5 animate-fade-in flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lastNotificationStatus}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {permission !== 'granted' && permission !== 'unsupported' ? (
            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isRequesting ? 'Requesting...' : 'Enable Push Alerts'}</span>
            </button>
          ) : null}

          <button
            onClick={handleSendTestPush}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            title="Fire an immediate native Web Notification to test your setup"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-600" />
            <span>Test Push Alert</span>
          </button>

          {onTriggerModalReminder && (
            <button
              onClick={onTriggerModalReminder}
              className="hidden lg:flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              title="Preview the in-app Take Now dialog"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Sound Dialog</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
