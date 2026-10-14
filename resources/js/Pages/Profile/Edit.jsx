import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profil Akun" />

            <div className="py-12 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Header Section */}
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest mb-4">
                            Pengaturan Profil
                        </h2>
                        <div className="w-24 h-1 bg-siarsip-terracotta mx-auto mb-6"></div>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                            Kelola informasi akun Anda dan pengaturan keamanan di bawah ini.
                        </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md p-8 shadow-xl sm:rounded-xl border border-white/10 border-t-4 border-t-siarsip-terracotta">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl text-gray-200"
                        />
                    </div>

                    <div className="bg-black/40 backdrop-blur-md p-8 shadow-xl sm:rounded-xl border border-white/10 border-t-4 border-t-siarsip-terracotta">
                        <UpdatePasswordForm className="max-w-xl text-gray-200" />
                    </div>

                    <div className="bg-black/40 backdrop-blur-md p-8 shadow-xl sm:rounded-xl border border-white/10 border-t-4 border-t-gray-600">
                        <DeleteUserForm className="max-w-xl text-gray-200" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
