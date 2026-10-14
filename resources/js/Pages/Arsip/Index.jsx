import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ archiveYears, canManageArsip }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState(null);
    
    const { data, setData, post, processing, errors, reset, put } = useForm({
        year: '',
        title: '',
        description: '',
        gdrive_folder_id: '',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (year) => {
        setEditingYear(year);
        setData({
            year: year.year,
            title: year.title,
            description: year.description || '',
            gdrive_folder_id: year.gdrive_folder_id || '',
        });
        setIsEditModalOpen(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('arsip.store'), {
            onSuccess: () => setIsCreateModalOpen(false),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        put(route('arsip.update', editingYear.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const deleteYear = (id, yearName) => {
        if (confirm(`Apakah Anda yakin ingin menghapus direktori tahun anggaran ${yearName}? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('arsip.destroy', { id: id }));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Arsip" />

            <div className="pt-32 md:pt-40 pb-16 min-h-screen relative">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/20 pb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white font-serif tracking-widest drop-shadow-md">DIREKTORI ARSIP TAHUNAN</h2>
                            <p className="text-gray-300 mt-2 font-medium">Pilih tahun anggaran untuk melihat daftar dokumen Surat Masuk dan Surat Keluar.</p>
                        </div>
                        {canManageArsip && (
                            <button
                                onClick={openCreateModal}
                                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-siarsip-terracotta border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-siarsip-terracottaDark focus:bg-siarsip-terracottaDark active:bg-siarsip-terracottaDark focus:outline-none focus:ring-2 focus:ring-siarsip-terracotta focus:ring-offset-2 transition ease-in-out duration-150 shadow-md"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Tahun Anggaran
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {archiveYears && archiveYears.map((year) => (
                            <div key={year.id} className="relative group">
                                <Link href={route('arsip.year', { year: year.year })} className="block rounded-xl overflow-hidden shadow-2xl bg-white border border-white/10 hover:shadow-red-900/50 transition-all duration-300 transform group-hover:-translate-y-1">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-siarsip-terracotta to-siarsip-terracottaDark relative">
                                        <img src="/images/box_tahun.jpg" alt="" width="800" height="597" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors z-0"></div>
                                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] mix-blend-overlay z-0"></div>
                                        
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                            <span className="text-white font-serif font-bold text-5xl drop-shadow-2xl tracking-wider">
                                                {year.year}
                                            </span>
                                            <span className="text-white/90 text-sm mt-3 font-semibold tracking-widest uppercase bg-black/40 px-3 py-1 rounded">
                                                Tahun Anggaran
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-siarsip-heroCard flex flex-col items-center justify-center border-t border-gray-800">
                                        <span className="font-bold text-gray-800 text-lg tracking-wide group-hover:text-siarsip-terracotta transition-colors">{year.title}</span>
                                    </div>
                                </Link>
                                
                                {/* Edit and Delete buttons for Admin/Developer */}
                                {canManageArsip && (
                                    <div className="absolute top-3 right-3 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); openEditModal(year); }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg focus:outline-none"
                                            title="Edit Tahun Anggaran"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); deleteYear(year.id, year.year); }}
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg focus:outline-none"
                                            title="Hapus Tahun Anggaran"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {archiveYears && archiveYears.length === 0 && (
                        <div className="text-center py-16 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl shadow-xl">
                            <p className="text-gray-400">Belum ada direktori tahun anggaran.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <form onSubmit={submitCreate} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        Tambah Direktori Tahun Anggaran Baru
                    </h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="year" value="Tahun Anggaran" />
                        <TextInput
                            id="year"
                            type="text"
                            name="year"
                            value={data.year}
                            className="mt-1 block w-full"
                            placeholder="Contoh: 2027"
                            isFocused={true}
                            onChange={(e) => setData('year', e.target.value)}
                        />
                        <InputError message={errors.year} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="title" value="Judul / Nama Direktori" />
                        <TextInput
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            className="mt-1 block w-full"
                            placeholder="Contoh: Arsip T.A. 2027"
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="description" value="Deskripsi (Opsional)" />
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            className="mt-1 block w-full border-gray-300 focus:border-siarsip-terracotta focus:ring-siarsip-terracotta rounded-md shadow-sm"
                            rows="3"
                            placeholder="Deskripsi singkat..."
                            onChange={(e) => setData('description', e.target.value)}
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="mb-6">
                        <InputLabel htmlFor="gdrive_folder_id" value="Tautan (Link) atau ID Folder Google Drive" />
                        <TextInput
                            id="gdrive_folder_id"
                            type="text"
                            name="gdrive_folder_id"
                            value={data.gdrive_folder_id}
                            className="mt-1 block w-full"
                            placeholder="Contoh: https://drive.google.com/drive/folders/1vX9dabcde...xyz"
                            onChange={(e) => setData('gdrive_folder_id', e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Anda bisa langsung *copy-paste* link URL folder Google Drive atau memasukkan ID foldernya saja. Sistem akan otomatis mendeteksinya.
                        </p>
                        <InputError message={errors.gdrive_folder_id} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3 bg-siarsip-terracotta hover:bg-siarsip-terracottaDark" disabled={processing}>
                            Simpan Direktori
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={submitEdit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        Edit Direktori Tahun Anggaran
                    </h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="edit_year" value="Tahun Anggaran" />
                        <TextInput
                            id="edit_year"
                            type="text"
                            name="year"
                            value={data.year}
                            className="mt-1 block w-full"
                            placeholder="Contoh: 2027"
                            isFocused={true}
                            onChange={(e) => setData('year', e.target.value)}
                        />
                        <InputError message={errors.year} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="edit_title" value="Judul / Nama Direktori" />
                        <TextInput
                            id="edit_title"
                            type="text"
                            name="title"
                            value={data.title}
                            className="mt-1 block w-full"
                            placeholder="Contoh: Arsip T.A. 2027"
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="edit_description" value="Deskripsi (Opsional)" />
                        <textarea
                            id="edit_description"
                            name="description"
                            value={data.description}
                            className="mt-1 block w-full border-gray-300 focus:border-siarsip-terracotta focus:ring-siarsip-terracotta rounded-md shadow-sm"
                            rows="3"
                            placeholder="Deskripsi singkat..."
                            onChange={(e) => setData('description', e.target.value)}
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="mb-6">
                        <InputLabel htmlFor="edit_gdrive_folder_id" value="Tautan (Link) atau ID Folder Google Drive" />
                        <TextInput
                            id="edit_gdrive_folder_id"
                            type="text"
                            name="gdrive_folder_id"
                            value={data.gdrive_folder_id}
                            className="mt-1 block w-full"
                            placeholder="Contoh: https://drive.google.com/drive/folders/1vX9dabcde...xyz"
                            onChange={(e) => setData('gdrive_folder_id', e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Anda bisa langsung *copy-paste* link URL folder Google Drive atau memasukkan ID foldernya saja. Sistem akan otomatis mendeteksinya.
                        </p>
                        <InputError message={errors.gdrive_folder_id} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3 bg-siarsip-terracotta hover:bg-siarsip-terracottaDark" disabled={processing}>
                            Simpan Perubahan
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
