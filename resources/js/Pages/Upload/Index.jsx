import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ pendingUploads, archiveYears, pendingCount }) {
    const [approveModal, setApproveModal] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState(null);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        gdrive_folder_id: '',
    });

    const openApproveModal = (upload) => {
        setSelectedUpload(upload);
        // Pre-select the year if it exists in archiveYears
        const matchingYear = archiveYears.find(y => y.year === upload.year);
        if (matchingYear) {
            setData('gdrive_folder_id', matchingYear.gdrive_folder_id);
        } else {
            setData('gdrive_folder_id', '');
        }
        setApproveModal(true);
    };

    const closeApproveModal = () => {
        setApproveModal(false);
        setSelectedUpload(null);
        reset();
    };

    const submitApprove = (e) => {
        e.preventDefault();
        post(route('upload.approve', selectedUpload.id), {
            onSuccess: () => closeApproveModal(),
        });
    };

    const handleReject = (upload) => {
        if (confirm(`Apakah Anda yakin ingin menolak dan menghapus dokumen "${upload.title}"?`)) {
            setIsProcessingAction(true);
            router.post(route('upload.reject', upload.id), {}, {
                onFinish: () => setIsProcessingAction(false),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-sm text-siarsip-terracotta font-semibold mb-2">
                            <Link href={route('dashboard')} className="hover:text-red-400 transition-colors">Dashboard</Link>
                            <span className="text-gray-500">&rarr;</span>
                            <span className="text-gray-300">Upload Dokumen</span>
                        </div>
                        <h2 className="font-semibold text-xl text-white leading-tight">
                            Dokumen Pending
                        </h2>
                        <p className="text-gray-400 mt-1 text-sm">Menunggu persetujuan untuk diupload ke Google Drive</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link
                            href={route('upload.create')}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md bg-siarsip-terracotta text-white font-medium hover:bg-siarsip-terracottaDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-lg shadow-red-900/50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Upload Baru
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dokumen Pending" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/40 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-xl border border-white/10">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Dokumen</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Tujuan</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Klasifikasi</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Pengunggah</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Waktu Upload</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {pendingUploads.length > 0 ? (
                                        pendingUploads.map((upload) => (
                                            <tr key={upload.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-white">{upload.title}</div>
                                                    <div className="text-xs text-gray-400 mt-1">{upload.original_filename}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-white">T.A. {upload.year}</div>
                                                    <div className="text-xs text-gray-400 capitalize">{upload.type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                                                        upload.classification.value === 'biasa' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                                        upload.classification.value === 'terbatas' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                                        'bg-red-500/20 text-red-300 border-red-500/30'
                                                    }`}>
                                                        {upload.classification.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {upload.uploader_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {upload.created_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => openApproveModal(upload)}
                                                        disabled={isProcessingAction}
                                                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md text-xs mr-2 transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-green-500 disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(upload)}
                                                        disabled={isProcessingAction}
                                                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-xs transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                Tidak ada dokumen yang menunggu persetujuan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={approveModal} onClose={closeApproveModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-white mb-4">
                        Approve & Upload ke Google Drive
                    </h2>
                    
                    {selectedUpload && (
                        <div className="mb-6 bg-white/5 p-4 rounded-md border border-white/10">
                            <p className="text-sm text-gray-300 mb-2"><span className="font-semibold text-white">Judul:</span> {selectedUpload.title}</p>
                            <p className="text-sm text-gray-300 mb-2"><span className="font-semibold text-white">Tujuan:</span> {selectedUpload.type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar'} T.A. {selectedUpload.year}</p>
                            <p className="text-sm text-gray-300 mb-2">
                                <span className="font-semibold text-white">Klasifikasi:</span>{' '}
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                                    selectedUpload.classification.value === 'biasa' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                    selectedUpload.classification.value === 'terbatas' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                    'bg-red-500/20 text-red-300 border-red-500/30'
                                }`}>
                                    {selectedUpload.classification.label}
                                </span>
                            </p>
                            <p className="text-sm text-gray-300"><span className="font-semibold text-white">File:</span> {selectedUpload.original_filename}</p>
                        </div>
                    )}

                    <form onSubmit={submitApprove}>
                        <div className="mb-6">
                            <label htmlFor="gdrive_folder_id" className="block text-sm font-medium text-gray-300 mb-2">
                                Folder Tahun Anggaran di Google Drive
                            </label>
                            <select
                                id="gdrive_folder_id"
                                name="gdrive_folder_id"
                                value={data.gdrive_folder_id}
                                onChange={(e) => setData('gdrive_folder_id', e.target.value)}
                                className="mt-1 block w-full bg-white/5 border-white/20 text-white focus:border-white focus:ring-white rounded-md shadow-sm [&>option]:bg-gray-900"
                                required
                            >
                                <option value="" disabled>Pilih Folder Induk...</option>
                                {archiveYears.map((ay) => (
                                    <option key={ay.id} value={ay.gdrive_folder_id}>
                                        T.A. {ay.year} - {ay.title}
                                    </option>
                                ))}
                            </select>
                            {errors.gdrive_folder_id && (
                                <p className="mt-2 text-sm text-red-400">{errors.gdrive_folder_id}</p>
                            )}
                            <p className="mt-3 text-sm text-gray-400 flex items-start">
                                <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                    Sistem akan secara otomatis membuat dan/atau meletakkan file ke sub-folder: <br/>
                                    <strong className="text-gray-300">{selectedUpload?.type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar'} &rarr; {selectedUpload?.classification?.label || ''}</strong>
                                </span>
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeApproveModal} disabled={processing}>
                                Batal
                            </SecondaryButton>

                            <PrimaryButton className="ml-3" disabled={processing}>
                                {processing ? 'Memproses...' : 'Upload ke Google Drive'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
