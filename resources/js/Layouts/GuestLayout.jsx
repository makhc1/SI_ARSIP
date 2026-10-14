import { Link } from '@inertiajs/react';
import OfflineIndicator from '@/Components/OfflineIndicator';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen">
            <OfflineIndicator />
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 grid w-full min-h-screen grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                {/* Empty column for the left side of the split screen */}
                <div className="hidden md:block lg:col-span-3"></div>
                
                {/* Full Height Right Panel - Solid Ground Surface */}
                <div className="flex flex-col justify-center items-center px-4 sm:px-12 py-12 bg-slate-950/95 shadow-2xl md:border-l-4 md:border-l-siarsip-kemhanGold lg:col-span-2">
                    <div className="w-full max-w-md">
                        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
                            <Link href="/">
                                <img src="/images/kemenhan.png" alt="Logo Kemhan" width="256" height="256" decoding="async" className="h-20 sm:h-24 w-auto drop-shadow-md" />
                            </Link>
                            <h1 className="mt-4 text-xl sm:text-2xl font-bold tracking-widest text-white uppercase text-center leading-snug">
                                Sistem Informasi Arsip
                            </h1>
                        </div>
                        
                        {children}
                        
                        {/* Footer text */}
                        <div className="mt-8 text-slate-400 font-medium text-xs sm:text-sm text-center">
                            &copy; {new Date().getFullYear()} Kementerian Pertahanan Republik Indonesia
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
