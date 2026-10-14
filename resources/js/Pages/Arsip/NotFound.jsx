import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function NotFound({ message = "Halaman atau arsip yang Anda cari tidak dapat ditemukan." }) {
    return (
        <AuthenticatedLayout>
            <Head title="Arsip Tidak Ditemukan" />

            <div className="py-12 bg-siarsip-canvas min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    
                    <div className="bg-white p-10 shadow-xl shadow-black/5 sm:rounded-xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-siarsip-terracotta"></div>
                        
                        <div className="mb-6 flex justify-center">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100">
                                <svg className="w-12 h-12 text-siarsip-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-siarsip-heroDark uppercase tracking-widest mb-4">
                            Data Tidak Ditemukan
                        </h2>
                        
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link 
                                href={route('arsip.index')}
                                className="px-6 py-3 bg-siarsip-terracotta text-white font-bold tracking-widest uppercase text-sm rounded shadow hover:bg-siarsip-terracottaDark transition"
                            >
                                Kembali ke Direktori
                            </Link>
                            <Link 
                                href={route('dashboard')}
                                className="px-6 py-3 bg-gray-200 text-gray-800 font-bold tracking-widest uppercase text-sm rounded shadow hover:bg-gray-300 transition"
                            >
                                Ke Beranda
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
