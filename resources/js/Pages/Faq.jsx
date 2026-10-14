import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Faq() {
    const faqs = [
        {
            question: "Apa itu Sistem Informasi Arsip (SIARSIP)?",
            answer: "SIARSIP adalah sistem informasi kearsipan digital yang digunakan untuk menyimpan, mengelola, dan mendistribusikan arsip dokumen secara terpusat dan aman di lingkungan Kementerian Pertahanan."
        },
        {
            question: "Bagaimana cara mencari dokumen arsip?",
            answer: "Anda dapat menavigasi ke menu ARSIP pada bilah navigasi di atas, lalu memilih tahun dokumen yang dicari. Anda juga dapat melihat seluruh direktori untuk mencari Surat Masuk atau Surat Keluar pada tahun tertentu."
        },
        {
            question: "Siapa saja yang memiliki hak akses ke dalam sistem?",
            answer: "Sistem ini bersifat internal dan terbatas. Hanya pegawai atau staf yang telah didaftarkan oleh Administrator dan memiliki akun aktif yang dapat masuk (login) dan mengakses dokumen arsip."
        },
        {
            question: "Apa yang harus dilakukan jika arsip tidak ditemukan?",
            answer: "Pastikan Anda mencari pada direktori Tahun dan Kategori (Surat Masuk / Keluar) yang tepat. Jika dokumen tetap tidak ada, kemungkinan dokumen belum diunggah ke dalam sistem atau Anda tidak memiliki izin untuk melihatnya. Silakan hubungi bagian Administrator Kearsipan."
        },
        {
            question: "Bagaimana jika saya lupa password akun saya?",
            answer: "Anda dapat menggunakan fitur 'Forgot Password' pada halaman Login, lalu masukkan alamat email Anda. Sistem akan mengirimkan tautan untuk mengatur ulang kata sandi Anda."
        }
    ];

    const [openIndex, setOpenIndex] = useState(0);

    return (
        <AuthenticatedLayout>
            <Head title="FAQ - Pertanyaan Umum" />

            <div className="py-12 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest mb-4">
                            Pertanyaan Umum
                        </h2>
                        <div className="w-24 h-1 bg-siarsip-terracotta mx-auto mb-6"></div>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                            Panduan dan informasi seputar penggunaan Sistem Informasi Arsip (SIARSIP) di lingkungan Kementerian Pertahanan.
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="bg-black/40 backdrop-blur-md shadow-xl rounded-xl border border-white/10 overflow-hidden">
                        <div className="divide-y divide-white/10">
                            {faqs.map((faq, index) => (
                                <div 
                                    key={index} 
                                    className="transition-colors duration-200 hover:bg-white/5"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex justify-between items-center px-8 py-6 text-left focus:outline-none"
                                    >
                                        <span className={`font-semibold text-lg ${openIndex === index ? 'text-white' : 'text-gray-300'}`}>
                                            {faq.question}
                                        </span>
                                        <span className={`ml-6 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${openIndex === index ? 'border-siarsip-terracotta text-white bg-siarsip-terracotta' : 'border-gray-500 text-gray-400'}`}>
                                            <svg 
                                                className={`w-5 h-5 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </button>
                                    
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className="px-8 pb-6 text-gray-400 leading-relaxed border-l-4 border-siarsip-terracotta ml-8 mb-4">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-12 p-8 bg-siarsip-heroDark rounded-xl text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black opacity-10 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-2 tracking-wide uppercase">Butuh Bantuan Lebih Lanjut?</h3>
                            <p className="text-red-100 mb-6">Tim administrator kearsipan kami siap membantu Anda menyelesaikan kendala teknis.</p>
                            <a href="mailto:admin@example.com" className="inline-flex items-center px-6 py-3 bg-white text-siarsip-heroDark font-bold text-sm uppercase tracking-widest rounded shadow hover:bg-gray-100 transition duration-150 ease-in-out">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                Hubungi Administrator
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
