'use client';

import { useEffect, useState, useCallback } from 'react';

let showToastGlobal: ((message: string, type?: 'success' | 'error' | 'default') => void) | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'default' = 'default') {
  showToastGlobal?.(message, type);
}

export default function ToastContainer() {
  const [toast, setToast] = useState<{ message: string; type: string; visible: boolean }>({
    message: '',
    type: 'default',
    visible: false,
  });

  const show = useCallback((message: string, type: 'success' | 'error' | 'default' = 'default') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  useEffect(() => {
    showToastGlobal = show;
    return () => { showToastGlobal = null; };
  }, [show]);

  const bgColor = toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-gray-800';

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white text-sm z-[9999] transition-all duration-300 pointer-events-none ${bgColor} ${
        toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {toast.message}
    </div>
  );
}
