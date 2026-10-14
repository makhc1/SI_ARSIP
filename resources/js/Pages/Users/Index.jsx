import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

export default function Index({ auth, users, roles }) {
    const [editRoleModal, setEditRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        roles: [],
    });

    const openEditRoleModal = (user) => {
        setSelectedUser(user);
        setData('roles', user.roles || []);
        setEditRoleModal(true);
    };

    const closeEditRoleModal = () => {
        setEditRoleModal(false);
        setSelectedUser(null);
        reset();
    };

    const handleRoleChange = (role, isChecked) => {
        if (isChecked) {
            setData('roles', [...data.roles, role]);
        } else {
            setData('roles', data.roles.filter(r => r !== role));
        }
    };

    const submitRoles = (e) => {
        e.preventDefault();
        put(route('users.update-roles', selectedUser.id), {
            onSuccess: () => closeEditRoleModal(),
        });
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-white leading-tight">Manajemen Pengguna</h2>
                    <PrimaryButton className="bg-siarsip-terracotta hover:bg-[#851C0C] focus:bg-[#851C0C] active:bg-siarsip-terracottaDark">
                        + Tambah Pengguna
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Pengguna" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-black/40 overflow-hidden shadow-sm sm:rounded-xl border border-white/10 backdrop-blur-md">
                        <div className="p-6 text-gray-100">
                            {users.length === 0 ? (
                                <div className="text-center py-12">
                                    <h3 className="text-lg font-medium text-white mb-2">Belum ada pengguna</h3>
                                    <p className="text-gray-400 mb-6">Tambahkan pengguna untuk memberikan akses ke sistem.</p>
                                    <PrimaryButton className="bg-siarsip-terracotta">
                                        + Tambah Pengguna Pertama
                                    </PrimaryButton>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Nama & Email
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Jabatan / Peran
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Terdaftar
                                                </th>
                                                <th scope="col" className="relative px-6 py-3 text-right">
                                                    <span className="sr-only">Aksi</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-white">{user.name}</div>
                                                        <div className="text-sm text-gray-400">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.roles.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {user.roles.map((role) => (
                                                                    <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-siarsip-terracotta/20 text-red-200 border border-siarsip-terracotta/30">
                                                                        {role}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-500 italic">Tidak ada peran</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {user.created_at}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button 
                                                            onClick={() => openEditRoleModal(user)}
                                                            className="text-siarsip-terracotta hover:text-red-400 transition-colors"
                                                        >
                                                            Edit Peran
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={editRoleModal} onClose={closeEditRoleModal}>
                <div className="p-6 text-white">
                    <h2 className="text-lg font-medium text-white mb-4">
                        Edit Peran Pengguna
                    </h2>
                    
                    {selectedUser && (
                        <div className="mb-6 bg-white/5 p-4 rounded-md border border-white/10">
                            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Nama:</span> {selectedUser.name}</p>
                            <p className="text-sm text-gray-300"><span className="font-semibold text-white">Email:</span> {selectedUser.email}</p>
                        </div>
                    )}

                    <form onSubmit={submitRoles}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Pilih Peran:
                            </label>
                            <div className="space-y-3">
                                {roles.map((role) => (
                                    <div key={role} className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id={`role-${role}`}
                                                name="roles"
                                                type="checkbox"
                                                value={role}
                                                checked={data.roles.includes(role)}
                                                onChange={(e) => handleRoleChange(role, e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 bg-white/5 text-siarsip-terracotta focus:ring-siarsip-terracotta"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={`role-${role}`} className="font-medium text-gray-300">
                                                {role}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.roles && (
                                <p className="mt-2 text-sm text-red-400">{errors.roles}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeEditRoleModal} disabled={processing}>
                                Batal
                            </SecondaryButton>

                            <PrimaryButton className="ml-3" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
