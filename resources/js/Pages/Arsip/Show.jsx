import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Show({ archiveYear, type, typeLabel, files, errorMessage, classification, userIsAdmin }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    
    // States for editing
    const [editingFileId, setEditingFileId] = useState(null);
    const [editingFileName, setEditingFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // State for preview
    const [previewFile, setPreviewFile] = useState(null);

    const getPreviewUrl = (file) => {
        if (!file) return '';
        // Dummy data check
        if (file.id.startsWith('dummy-')) {
            return file.webViewLink;
        }
        // Proxy through our Laravel backend
        return route('arsip.file.stream', { id: file.id }) + '#toolbar=1&view=FitH';
    };

    const handleSearch = () => {
        setAppliedQuery(searchQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const startEditing = (file) => {
        setEditingFileId(file.id);
        setEditingFileName(file.name);
    };

    const cancelEditing = () => {
        setEditingFileId(null);
        setEditingFileName('');
    };

    const saveRename = (fileId) => {
        if (!editingFileName.trim()) return;
        
        setIsProcessing(true);
        router.put(route('arsip.file.update', { id: fileId }), {
            name: editingFileName,
            year: archiveYear.year,
            type: type,
            classification: classification?.value || 'biasa'
        }, {
            onSuccess: () => {
                setEditingFileId(null);
                setEditingFileName('');
                setIsProcessing(false);
            },
            onError: () => setIsProcessing(false)
        });
    };

    const deleteFile = (file) => {
        if (confirm(`Apakah Anda yakin ingin menghapus arsip "${file.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
            setIsProcessing(true);
            router.delete(route('arsip.file.destroy', { id: file.id }), {
                data: {
                    year: archiveYear.year,
                    type: type,
                    classification: classification?.value || 'biasa'
                },
                onSuccess: () => setIsProcessing(false),
                onError: () => setIsProcessing(false)
            });
        }
    };

    // Filter files based on search
    const filteredFiles = (files || []).filter(file => 
        file.name && file.name.toLowerCase().includes(appliedQuery.toLowerCase())
    );

    // Format bytes
    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${typeLabel} ${archiveYear.year}`} />

            <div className="pt-32 md:pt-40 pb-16 min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}>
                {/* Subtle dark gradient overlay same as dashboard */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 z-0"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/20 pb-6">
                        <div>
                            <div className="flex items-center space-x-2 text-sm text-siarsip-terracotta font-semibold mb-2">
                                <Link href={route('arsip.index')} className="hover:text-red-400 transition-colors">Direktori Arsip</Link>
                                <span className="text-gray-500">&rarr;</span>
                                <Link href={route('arsip.year', { year: archiveYear.year })} className="hover:text-red-400 transition-colors">T.A. {archiveYear.year}</Link>
                                <span className="text-gray-500">&rarr;</span>
                                <Link href={route('arsip.year.type', { year: archiveYear.year, type: type })} className="hover:text-red-400 transition-colors">{typeLabel}</Link>
                                <span className="text-gray-500">&rarr;</span>
                                <span className="text-gray-300">{classification?.label || 'Biasa'}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <h2 className="text-3xl font-bold text-white font-serif uppercase tracking-widest drop-shadow-md">
                                    {typeLabel}
                                </h2>
                                {classification && (
                                    <span className={`px-3 py-1 text-xs font-bold tracking-widest rounded-full uppercase border shadow-sm ${
                                        classification.value === 'biasa' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                        classification.value === 'terbatas' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                        'bg-red-500/20 text-red-300 border-red-500/30'
                                    }`}>
                                        {classification.label}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                            {/* Upload Button for Admin */}
                            {userIsAdmin && (
                                <Link
                                    href={route('upload.create')}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md bg-white text-siarsip-terracotta font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Upload Dokumen
                                </Link>
                            )}

                            {/* Search Bar with Button */}
                            <div className="flex rounded-md shadow-sm">
                                <input 
                                    type="text" 
                                    placeholder="Cari nama dokumen..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-siarsip-terracotta focus:border-siarsip-terracotta bg-white"
                                />
                                <button 
                                    onClick={handleSearch}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md bg-siarsip-terracotta text-white hover:bg-siarsip-terracottaDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                    Cari
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Nama Dokumen
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Tipe
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Ukuran
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Tanggal Dibuat
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFiles.length > 0 ? (
                                        filteredFiles.map((file) => (
                                            <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <svg className="flex-shrink-0 h-5 w-5 text-siarsip-terracotta" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                        <div className="ml-3 w-full">
                                                            {editingFileId === file.id ? (
                                                                <input
                                                                    type="text"
                                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-siarsip-terracotta focus:border-siarsip-terracotta"
                                                                    value={editingFileName}
                                                                    onChange={(e) => setEditingFileName(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && saveRename(file.id)}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {(file.mimeType || '').includes('pdf') ? 'PDF Document' : 'Document'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatBytes(file.size)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(file.createdTime).toLocaleDateString('id-ID', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {editingFileId === file.id ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => saveRename(file.id)}
                                                                    disabled={isProcessing}
                                                                    className="inline-flex items-center px-2 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                                                >
                                                                    Simpan
                                                                </button>
                                                                <button 
                                                                    onClick={cancelEditing}
                                                                    disabled={isProcessing}
                                                                    className="inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                                                >
                                                                    Batal
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button 
                                                                    onClick={() => setPreviewFile(file)}
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-siarsip-terracotta hover:bg-siarsip-terracottaDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                                >
                                                                    Pratinjau
                                                                </button>
                                                                <button 
                                                                    onClick={() => startEditing(file)}
                                                                    disabled={isProcessing}
                                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                                >
                                                                    Ubah Nama
                                                                </button>
                                                                <button 
                                                                    onClick={() => deleteFile(file)}
                                                                    disabled={isProcessing}
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                {searchQuery ? 'Tidak ada file yang cocok dengan pencarian Anda.' : 'Direktori kosong atau credentials Google Drive belum dikonfigurasi.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Preview */}
            <Modal show={previewFile !== null} onClose={() => setPreviewFile(null)} maxWidth="4xl">
                <div className="p-4 sm:p-6 bg-white flex flex-col h-[80vh]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 truncate pr-4">
                            {previewFile ? previewFile.name : 'Pratinjau Dokumen'}
                        </h3>
                        <button
                            onClick={() => setPreviewFile(null)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Tutup</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 w-full bg-gray-100 rounded-md overflow-hidden relative">
                        {previewFile ? (
                            <iframe 
                                src={getPreviewUrl(previewFile)} 
                                className="absolute inset-0 w-full h-full border-0"
                                title="Pratinjau Dokumen"
                                allow="autoplay"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Memuat...
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        {previewFile && (
                            <a 
                                href={previewFile.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-siarsip-terracotta transition-colors"
                            >
                                Buka di Tab Baru
                            </a>
                        )}
                        <button
                            onClick={() => setPreviewFile(null)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
