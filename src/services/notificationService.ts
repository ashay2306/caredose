import { Medicine, FamilyMember, DoseLog } from '../types/medicare';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

class NotificationService {
  private sentNotificationKeys: Set<string> = new Set();
  private listeners: Set<(status: NotificationPermissionStatus) => void> = new Set();

  // Check if browser supports Web Notifications API
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Get current permission status
  getPermission(): NotificationPermissionStatus {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission as NotificationPermissionStatus;
  }

  // Subscribe to permission changes
  subscribe(callback: (status: NotificationPermissionStatus) => void): () => void {
    this.listeners.add(callback);
    callback(this.getPermission());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    const current = this.getPermission();
    this.listeners.forEach((cb) => cb(current));
  }

  // Request notification permission from the user
  async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      this.notifyListeners();
      return permission as NotificationPermissionStatus;
    } catch (err) {
      console.warn('Error requesting Web Notification permission:', err);
      this.notifyListeners();
      return 'denied';
    }
  }

  // Send an immediate browser Web Notification
  sendNotification(title: string, options?: NotificationOptions): boolean {
    if (!this.isSupported()) {
      return false;
    }

    if (Notification.permission !== 'granted') {
      return false;
    }

    try {
      const notificationConfig: any = {
        icon: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=192&auto=format&fit=crop&q=80',
        badge: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=96&auto=format&fit=crop&q=80',
        tag: options?.tag || `caredose-${Date.now()}`,
        renotify: true,
        requireInteraction: true,
        ...options,
      };
      const notif = new Notification(title, notificationConfig);

      notif.onclick = () => {
        if (typeof window !== 'undefined') {
          window.focus();
        }
        notif.close();
      };

      return true;
    } catch (err) {
      console.warn('Failed to dispatch native Web Notification:', err);
      return false;
    }
  }

  // Dispatch dose reminder notification with medical context
  notifyDoseReminder(
    medicine: Medicine,
    member: FamilyMember,
    scheduledTime: string,
    onConfirm?: () => void
  ): boolean {
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `${medicine.id}-${todayStr}-${scheduledTime}`;

    if (this.sentNotificationKeys.has(key)) {
      return false;
    }
    this.sentNotificationKeys.add(key);

    const title = `💊 Dose Reminder: ${medicine.name} (${medicine.strength})`;
    const body = `${member.name}: Take ${medicine.doseAmount} · ${medicine.foodInstruction} · Scheduled for ${scheduledTime}. Click to view & confirm.`;

    const sent = this.sendNotification(title, {
      body,
      tag: key,
    });

    if (onConfirm) {
      onConfirm();
    }

    return sent;
  }

  // Inspect all today's medicines and trigger push notification for due pending doses
  checkScheduledDoses(
    medicines: Medicine[],
    members: FamilyMember[],
    doseLogs: DoseLog[],
    onTrigger?: (med: Medicine, member: FamilyMember, time: string) => void
  ): number {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTotalMin = currentHour * 60 + currentMin;
    const todayStr = now.toISOString().split('T')[0];

    let alertsDispatched = 0;

    medicines.forEach((med) => {
      const member = members.find((m) => m.id === med.profileId) || members[0];

      med.scheduleTimings.forEach((timing) => {
        const [hStr, mStr] = timing.split(':');
        const schedHour = parseInt(hStr, 10);
        const schedMin = parseInt(mStr, 10);
        const schedTotalMin = schedHour * 60 + schedMin;

        // Check if current time is within +/- 2 minutes of scheduled time
        const diff = Math.abs(currentTotalMin - schedTotalMin);
        if (diff <= 2) {
          // Check if dose has already been taken or skipped today
          const log = doseLogs.find(
            (l) => l.medicineId === med.id && l.scheduledDate === todayStr && l.scheduledTime === timing
          );

          if (!log || log.status === 'pending') {
            const key = `${med.id}-${todayStr}-${timing}`;
            if (!this.sentNotificationKeys.has(key)) {
              const dispatched = this.notifyDoseReminder(med, member, timing);
              if (dispatched) {
                alertsDispatched++;
              }
              if (onTrigger) {
                onTrigger(med, member, timing);
              }
            }
          }
        }
      });
    });

    return alertsDispatched;
  }

  // Trigger immediate test notification for user verification
  sendTestNotification(medicine?: Medicine, member?: FamilyMember): boolean {
    const medName = medicine?.name || 'Metformin';
    const medStrength = medicine?.strength || '500 mg';
    const dose = medicine?.doseAmount || '1 tablet';
    const food = medicine?.foodInstruction || 'After lunch';
    const patientName = member?.name || 'Arthur (Grandpa)';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const title = `🔔 Push Alert Test: ${medName} ${medStrength}`;
    const body = `${patientName}: Take ${dose} · ${food} · MediCare+ Web Notification verified at ${timeStr}.`;

    return this.sendNotification(title, {
      body,
      tag: `test-dose-${Date.now()}`,
    });
  }

  // Clear cache for testing/resetting
  resetSentKeys() {
    this.sentNotificationKeys.clear();
  }
}

export const notificationService = new NotificationService();
