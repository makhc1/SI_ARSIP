import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-siarsip-canvas flex flex-col items-center justify-center text-center p-4">
            <svg className="w-24 h-24 text-siarsip-terracotta mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636a9 9 0 00-12.728 0m12.728 0A9 9 0 0118.364 18.364M9.172 9.172a4 4 0 00-5.656 0m5.656 0a4 4 0 015.656 5.656" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
            </svg>
            <h1 className="text-3xl font-bold text-siarsip-heroDark uppercase tracking-widest mb-4">Koneksi Terputus</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
                Perangkat Anda kehilangan koneksi internet. Sistem Informasi Arsip (SIARSIP) membutuhkan koneksi internet aktif untuk berkomunikasi dengan server.
            </p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-siarsip-terracotta text-white font-bold tracking-widest uppercase text-sm rounded shadow hover:bg-siarsip-terracottaDark transition"
            >
                Coba Lagi
            </button>
        </div>
    );
}
