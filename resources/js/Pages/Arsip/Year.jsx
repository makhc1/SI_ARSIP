import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Year({ archiveYear, type, typeLabel, userIsAdmin, userCanViewTerbatas }) {
    const isTypeSelected = !!type;

    return (
        <AuthenticatedLayout>
            <Head title={isTypeSelected ? `${typeLabel} — T.A. ${archiveYear.year}` : `T.A. ${archiveYear.year}`} />

            <div className="pt-32 md:pt-40 pb-16 min-h-screen relative">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/20 pb-6">
                        <div>
                            {isTypeSelected ? (
                                <>
                                    <div className="flex items-center space-x-2 text-sm text-siarsip-terracotta font-semibold mb-2">
                                        <Link href={route('arsip.index')} className="hover:text-red-400 transition-colors">Direktori Arsip</Link>
                                        <span className="text-gray-500">&rarr;</span>
                                        <Link href={route('arsip.year', { year: archiveYear.year })} className="hover:text-red-400 transition-colors">T.A. {archiveYear.year}</Link>
                                        <span className="text-gray-500">&rarr;</span>
                                        <span className="text-gray-300">{typeLabel}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white font-serif uppercase tracking-widest drop-shadow-md">
                                        {typeLabel}
                                    </h2>
                                    <p className="text-gray-400 mt-2">Pilih klasifikasi dokumen</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-2 text-sm text-siarsip-terracotta font-semibold mb-2">
                                        <Link href={route('arsip.index')} className="hover:text-red-400 transition-colors">Direktori Arsip</Link>
                                        <span className="text-gray-500">&rarr;</span>
                                        <span className="text-gray-300">T.A. {archiveYear.year}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white font-serif uppercase tracking-widest drop-shadow-md">
                                        T.A. {archiveYear.year}
                                    </h2>
                                    <p className="text-gray-400 mt-2">{archiveYear.title}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {isTypeSelected ? (
                        /* Sub-Classification Cards */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

                            {/* BIASA — selalu tampil */}
                            <Link
                                href={route('arsip.show', { year: archiveYear.year, type: type, classification: 'biasa' })}
                                className="group relative rounded-xl overflow-hidden shadow-2xl border border-white/10 hover:shadow-emerald-900/50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 h-full flex flex-col items-center text-center hover:border-emerald-400/50 transition-colors">
                                    <div className="mb-4 p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                        <svg className="w-12 h-12 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                        </svg>
                                    </div>
                                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-widest rounded-full uppercase border border-emerald-500/30 mb-3">
                                        BIASA
                                    </span>
                                    <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-1">Dokumen Reguler</h3>
                                    <p className="text-gray-400 text-sm">Dapat diakses semua pegawai</p>
                                    <span className="mt-4 text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </div>
                            </Link>

                            {/* TERBATAS — tampil jika userCanViewTerbatas atau userIsAdmin */}
                            {(userCanViewTerbatas || userIsAdmin) && (
                                <Link
                                    href={route('arsip.show', { year: archiveYear.year, type: type, classification: 'terbatas' })}
                                    className="group relative rounded-xl overflow-hidden shadow-2xl border border-white/10 hover:shadow-amber-900/50 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="bg-black/40 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 h-full flex flex-col items-center text-center hover:border-amber-400/50 transition-colors">
                                        <div className="mb-4 p-4 bg-amber-500/10 rounded-full border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                                            <svg className="w-12 h-12 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                            </svg>
                                        </div>
                                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest rounded-full uppercase border border-amber-500/30 mb-3">
                                            TERBATAS
                                        </span>
                                        <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-1">Akses Terbatas</h3>
                                        <p className="text-gray-400 text-sm">Hanya untuk staf tertentu</p>
                                        <span className="mt-4 text-amber-400 font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </div>
                                </Link>
                            )}

                            {/* RAHASIA — tampil hanya jika userIsAdmin */}
                            {userIsAdmin && (
                                <Link
                                    href={route('arsip.show', { year: archiveYear.year, type: type, classification: 'rahasia' })}
                                    className="group relative rounded-xl overflow-hidden shadow-2xl border border-white/10 hover:shadow-red-900/50 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 h-full flex flex-col items-center text-center hover:border-red-400/50 transition-colors">
                                        <div className="mb-4 p-4 bg-red-500/10 rounded-full border border-red-500/20 group-hover:bg-red-500/20 transition-colors relative">
                                            <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                            </svg>
                                            <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-0.5">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="inline-block px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold tracking-widest rounded-full uppercase border border-red-500/30 mb-3">
                                            RAHASIA
                                        </span>
                                        <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-1">Dokumen Rahasia</h3>
                                        <p className="text-gray-400 text-sm">Hanya dapat diakses Admin</p>
                                        <span className="mt-4 text-red-400 font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ) : (
                        /* Filing Cabinet Cards */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* SURAT MASUK */}
                            <Link href={route('arsip.year.type', { year: archiveYear.year, type: 'masuk' })} className="group relative rounded-xl overflow-hidden shadow-2xl bg-white border border-white/10 hover:shadow-red-900/50 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="aspect-[4/3] bg-gradient-to-br from-siarsip-terracotta to-siarsip-terracottaDark relative">
                                    <img src="/images/box_surat_masuk.jpg" alt="" width="800" height="597" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-0"></div>
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] mix-blend-overlay z-0"></div>

                                    <div className="absolute bottom-4 left-4 z-10">
                                        <span className="text-white font-bold text-3xl tracking-wider drop-shadow-xl">
                                            SURAT MASUK
                                        </span>
                                        <div className="text-white/90 text-sm font-medium mt-1 uppercase tracking-widest bg-black/40 inline-block px-2 py-1 rounded">@{archiveYear.year}</div>
                                    </div>
                                </div>
                                <div className="p-5 bg-siarsip-heroCard flex justify-between items-center border-t border-gray-800">
                                    <span className="font-bold text-gray-800 text-lg uppercase tracking-wide group-hover:text-siarsip-terracotta transition-colors">Lihat Surat Masuk</span>
                                    <span className="text-siarsip-terracotta font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </div>
                            </Link>

                            {/* SURAT KELUAR */}
                            <Link href={route('arsip.year.type', { year: archiveYear.year, type: 'keluar' })} className="group relative rounded-xl overflow-hidden shadow-2xl bg-white border border-white/10 hover:shadow-red-900/50 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="aspect-[4/3] bg-gradient-to-br from-red-600 to-red-900 relative">
                                    <img src="/images/box_surat_keluar.jpg" alt="" width="800" height="597" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-0"></div>
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] mix-blend-overlay z-0"></div>

                                    <div className="absolute bottom-4 left-4 z-10">
                                        <span className="text-white font-bold text-3xl tracking-wider drop-shadow-xl">
                                            SURAT KELUAR
                                        </span>
                                        <div className="text-white/90 text-sm font-medium mt-1 uppercase tracking-widest bg-black/40 inline-block px-2 py-1 rounded">@{archiveYear.year}</div>
                                    </div>
                                </div>
                                <div className="p-5 bg-siarsip-heroCard flex justify-between items-center border-t border-gray-800">
                                    <span className="font-bold text-gray-800 text-lg uppercase tracking-wide group-hover:text-siarsip-terracotta transition-colors">Lihat Surat Keluar</span>
                                    <span className="text-siarsip-terracotta font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </div>
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
