import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ archiveYears }) {
    return (
        <AuthenticatedLayout>
            <Head title="Beranda" />

            {/* Main Content Area */}
            <div className="relative w-full flex flex-col justify-center items-center text-center overflow-hidden h-screen">
                <div className="relative z-10 px-4 flex flex-col items-center justify-center h-full text-center">
                    
                    {/* Main Title Group */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
                        <h1 className="text-5xl md:text-6xl font-serif text-white tracking-widest font-bold drop-shadow-2xl leading-none">
                            BAG INSIPTALA
                        </h1>
                        <div className="hidden md:block w-1 h-16 bg-white/40 rounded-full"></div>
                        <div className="block md:hidden w-16 h-1 bg-white/40 rounded-full my-2"></div>
                        <h1 className="text-5xl md:text-6xl font-serif text-white tracking-widest font-bold drop-shadow-2xl leading-none">
                            SI ARSIP
                        </h1>
                    </div>
                    
                    {/* Combined Sub Title */}
                    <h2 className="text-sm md:text-xl font-sans text-gray-300 tracking-[0.15em] md:tracking-[0.2em] uppercase font-medium drop-shadow-md opacity-90 text-center max-w-4xl leading-relaxed">
                        Bagian Informasi Arsip Tata Laksana <span className="hidden md:inline px-2 text-white/50">•</span><br className="md:hidden" /> Sistem Informasi Arsip
                    </h2>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
