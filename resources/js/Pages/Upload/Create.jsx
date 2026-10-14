import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ archiveYears }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        year: archiveYears.length > 0 ? archiveYears[0].year : '',
        type: 'masuk',
        classification: 'biasa',
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('upload.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center space-x-2 text-sm text-siarsip-terracotta font-semibold mb-2">
                            <Link href={route('dashboard')} className="hover:text-red-400 transition-colors">Dashboard</Link>
                            <span className="text-gray-500">&rarr;</span>
                            <Link href={route('upload.index')} className="hover:text-red-400 transition-colors">Upload Dokumen</Link>
                            <span className="text-gray-500">&rarr;</span>
                            <span className="text-gray-300">Form Upload</span>
                        </div>
                        <h2 className="font-semibold text-xl text-white leading-tight">
                            Upload Dokumen
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Upload Dokumen" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-xl border border-white/10 overflow-hidden p-6 sm:p-10">
                        <form onSubmit={submit} encType="multipart/form-data">
                            {/* Judul Dokumen */}
                            <div className="mb-6">
                                <InputLabel htmlFor="title" value="Judul Dokumen" className="text-gray-300" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full bg-white/5 border-white/20 text-white focus:border-white focus:ring-white"
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Tahun Anggaran */}
                                <div>
                                    <InputLabel htmlFor="year" value="Tahun Anggaran" className="text-gray-300" />
                                    <select
                                        id="year"
                                        name="year"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        className="mt-1 block w-full bg-white/5 border-white/20 text-white focus:border-white focus:ring-white rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="" disabled>Pilih Tahun Anggaran</option>
                                        {archiveYears.map((ay) => (
                                            <option key={ay.id} value={ay.year} className="bg-gray-800">T.A. {ay.year} - {ay.title}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.year} className="mt-2" />
                                </div>

                                {/* Tipe Surat */}
                                <div>
                                    <InputLabel htmlFor="type" value="Tipe Surat" className="text-gray-300" />
                                    <select
                                        id="type"
                                        name="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="mt-1 block w-full bg-white/5 border-white/20 text-white focus:border-white focus:ring-white rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="masuk" className="bg-gray-800">Surat Masuk</option>
                                        <option value="keluar" className="bg-gray-800">Surat Keluar</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>
                            </div>

                            {/* Klasifikasi */}
                            <div className="mb-6">
                                <InputLabel value="Klasifikasi Keamanan" className="mb-3 text-gray-300" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className={`cursor-pointer border rounded-lg p-4 transition-all ${data.classification === 'biasa' ? 'border-emerald-500 bg-emerald-500/20 ring-1 ring-emerald-500' : 'border-white/20 hover:bg-white/5'}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="classification"
                                                value="biasa"
                                                checked={data.classification === 'biasa'}
                                                onChange={(e) => setData('classification', e.target.value)}
                                                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-white/20 bg-white/10"
                                            />
                                            <span className="ml-3 block">
                                                <span className="block text-sm font-medium text-white">Biasa</span>
                                                <span className="block text-xs text-gray-400 mt-1">Dokumen reguler, dapat diakses semua pegawai.</span>
                                            </span>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer border rounded-lg p-4 transition-all ${data.classification === 'terbatas' ? 'border-amber-500 bg-amber-500/20 ring-1 ring-amber-500' : 'border-white/20 hover:bg-white/5'}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="classification"
                                                value="terbatas"
                                                checked={data.classification === 'terbatas'}
                                                onChange={(e) => setData('classification', e.target.value)}
                                                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-white/20 bg-white/10"
                                            />
                                            <span className="ml-3 block">
                                                <span className="block text-sm font-medium text-white">Terbatas</span>
                                                <span className="block text-xs text-gray-400 mt-1">Akses terbatas untuk staf tertentu.</span>
                                            </span>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer border rounded-lg p-4 transition-all ${data.classification === 'rahasia' ? 'border-red-500 bg-red-500/20 ring-1 ring-red-500' : 'border-white/20 hover:bg-white/5'}`}>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="classification"
                                                value="rahasia"
                                                checked={data.classification === 'rahasia'}
                                                onChange={(e) => setData('classification', e.target.value)}
                                                className="h-4 w-4 text-red-500 focus:ring-red-500 border-white/20 bg-white/10"
                                            />
                                            <span className="ml-3 block">
                                                <span className="block text-sm font-medium text-white">Rahasia</span>
                                                <span className="block text-xs text-gray-400 mt-1">Hanya dapat diakses Admin.</span>
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                <InputError message={errors.classification} className="mt-2" />
                            </div>

                            {/* Keterangan */}
                            <div className="mb-6">
                                <InputLabel htmlFor="description" value="Keterangan (Opsional)" className="text-gray-300" />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full bg-white/5 border-white/20 text-white focus:border-white focus:ring-white rounded-md shadow-sm"
                                    rows="3"
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* File Upload */}
                            <div className="mb-8">
                                <InputLabel value="File Dokumen (Max 50MB)" className="mb-2 text-gray-300" />
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Klik untuk upload</span> atau drag and drop</p>
                                            <p className="text-xs text-gray-500">PDF, DOCX, XLSX, JPEG, PNG</p>
                                            {data.file && (
                                                <p className="mt-2 text-sm font-semibold text-siarsip-terracotta">{data.file.name}</p>
                                            )}
                                        </div>
                                        <input 
                                            id="file-upload" 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => setData('file', e.target.files[0])}
                                        />
                                    </label>
                                </div>
                                <InputError message={errors.file} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Upload Dokumen'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
