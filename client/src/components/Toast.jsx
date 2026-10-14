import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = Info;
        let borderColor = 'rgba(99, 102, 241, 0.4)';
        let iconColor = '#818cf8';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'rgba(16, 185, 129, 0.4)';
          iconColor = '#34d399';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = 'rgba(239, 68, 68, 0.4)';
          iconColor = '#f87171';
        }

        return (
          <div key={toast.id} className="toast" style={{ borderColor }}>
            <Icon size={20} color={iconColor} style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {toast.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
