import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  secondaryActionText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  onSecondaryAction?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  secondaryActionText,
  variant = 'danger',
  onConfirm,
  onCancel,
  onSecondaryAction,
}) => {
  const variantColors = {
    danger: { bg: 'bg-red-500/10', border: 'border-red-500/20', btn: 'bg-red-500 hover:bg-red-600', icon: 'text-red-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', btn: 'bg-amber-500 hover:bg-amber-600', icon: 'text-amber-400' },
    info: { bg: 'bg-primary-mint/10', border: 'border-primary-mint/20', btn: 'bg-primary-mint hover:opacity-90', icon: 'text-primary-mint' },
  };
  const colors = variantColors[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

          {/* Dialog */}
          <motion.div
            className="relative bg-surface-card border border-surface-alt rounded-2xl p-6 max-w-sm w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-2 rounded-xl ${colors.bg} ${colors.border} border`}>
                <AlertTriangle className={`w-5 h-5 ${colors.icon}`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-text">{title}</h3>
                <p className="text-xs text-muted-text mt-1 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={onCancel}
                className="flex-[0.8] py-2.5 px-3 text-xs font-semibold rounded-xl bg-surface-alt text-secondary-text hover:bg-surface-soft transition-colors"
              >
                {cancelText}
              </button>
              {secondaryActionText && onSecondaryAction && (
                <button
                  onClick={onSecondaryAction}
                  className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl bg-surface-soft text-primary-text border border-surface-alt hover:bg-surface-alt transition-colors"
                >
                  {secondaryActionText}
                </button>
              )}
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl text-white ${colors.btn} transition-colors`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
