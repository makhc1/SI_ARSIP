import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import OfflineIndicator from '@/Components/OfflineIndicator';
import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    
    const [isArsipOpen, setIsArsipOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsArsipOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isTransparentNav = route().current('dashboard') || route().current('arsip.*');

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}>
            <div className="absolute inset-0 bg-black/75 z-0"></div>
            <div className="relative z-10 min-h-screen flex flex-col">
                <OfflineIndicator />
            <nav className={`${isTransparentNav ? 'absolute top-0 left-0 w-full z-50 bg-transparent' : 'sticky top-0 z-50 bg-transparent'}`}>
                <div className="w-full px-6 py-4 sm:px-10">
                    <div className="flex h-16 justify-between items-center w-full">
                        {/* Logo & Title - Aligned Left */}
                        <div className="flex items-center gap-4">
                            <Link href={route('dashboard')} className="flex items-center gap-4 group">
                                <img src="/images/kemenhan.png" alt="Logo Kemhan" width="256" height="256" decoding="async" className="h-12 w-auto drop-shadow-md group-hover:scale-105 transition-transform" />
                                <div className="hidden sm:block">
                                    <h1 className="text-white font-bold tracking-widest text-xl uppercase drop-shadow-md group-hover:text-gray-200 transition-colors">
                                        Sistem Informasi Arsip
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation - Aligned Right */}
                        <div className="hidden sm:flex sm:items-center space-x-8">
                            <Link
                                href={route('dashboard')}
                                className={`font-semibold tracking-wider uppercase text-sm inline-flex items-center transition-all focus:outline-none ${route().current('dashboard') ? 'text-white border-b-2 border-white pt-1 pb-1' : 'text-gray-200 hover:text-white border-b-2 border-transparent hover:border-white pt-1 pb-1'}`}
                            >
                                Beranda
                            </Link>
                            {/* Dropdown for Arsip */}
                            <div className="relative ms-3" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsArsipOpen(!isArsipOpen)}
                                    className={`font-semibold tracking-wider uppercase text-sm inline-flex items-center transition-all focus:outline-none ${route().current('arsip.*') ? 'text-white border-b-2 border-white pt-1 pb-1' : 'text-gray-200 hover:text-white border-b-2 border-transparent hover:border-white pt-1 pb-1'}`}
                                >
                                    <span>ARSIP</span>
                                    <svg className={`-me-0.5 ms-1 h-3.5 w-3.5 transition-transform duration-200 ${isArsipOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isArsipOpen && (
                                    <div className="absolute right-0 mt-2.5 w-44 bg-black/75 backdrop-blur-md border border-white/10 rounded-sm shadow-xl py-1 z-50">
                                        <Link
                                            href={route('arsip.year', { year: '2026' })}
                                            onClick={() => setIsArsipOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                                        >
                                            <span className="flex items-center justify-center w-4 h-4 border border-white/80 rounded-[2px] text-[10px]">▼</span>
                                            <span>2026</span>
                                        </Link>
                                        <Link
                                            href={route('arsip.year', { year: '2025' })}
                                            onClick={() => setIsArsipOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                                        >
                                            <span className="flex items-center justify-center w-4 h-4 border border-white/80 rounded-[2px] text-[10px]">▼</span>
                                            <span>2025</span>
                                        </Link>
                                        <div className="border-t border-white/20 my-1"></div>
                                        <Link
                                            href={route('arsip.index')}
                                            onClick={() => setIsArsipOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                                        >
                                            <span className="flex items-center justify-center w-4 h-4 border border-white/80 rounded-[2px] text-[10px]">▼</span>
                                            <span>Semua Direktori</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <Link
                                href={route('faq')}
                                className={`font-semibold tracking-wider uppercase text-sm inline-flex items-center transition-all focus:outline-none pt-1 pb-1 ${route().current('faq') ? 'text-white border-b-2 border-white' : 'text-gray-200 hover:text-white border-b-2 border-transparent hover:border-white'}`}
                            >
                                FAQ
                            </Link>

                            {/* Upload Link */}
                            {user.canUpload && (
                                <Link
                                    href={route('upload.index')}
                                    className={`font-semibold tracking-wider uppercase text-sm inline-flex items-center transition-all focus:outline-none pt-1 pb-1 ${route().current('upload.*') ? 'text-white border-b-2 border-white' : 'text-gray-200 hover:text-white border-b-2 border-transparent hover:border-white'}`}
                                >
                                    Upload
                                    {usePage().props.pendingUploadsCount > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                            {usePage().props.pendingUploadsCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Users Link */}
                            {(user.roles?.includes('Admin') || user.roles?.includes('Developer')) && (
                                <Link
                                    href={route('users.index')}
                                    className={`font-semibold tracking-wider uppercase text-sm inline-flex items-center transition-all focus:outline-none pt-1 pb-1 ${route().current('users.*') ? 'text-white border-b-2 border-white' : 'text-gray-200 hover:text-white border-b-2 border-transparent hover:border-white'}`}
                                >
                                    Pengguna
                                </Link>
                            )}

                            <div className="relative ms-3 border-l border-white/20 pl-6">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-transparent text-sm font-medium leading-4 text-white hover:text-gray-300 focus:outline-none transition-all"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-black/75 backdrop-blur-md border border-white/10">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="!text-white hover:!bg-white/10 focus:!bg-white/10"
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="!text-white hover:!bg-white/10 focus:!bg-white/10"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-all"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden bg-black/75 backdrop-blur-md border-b border-white/10'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="text-white hover:bg-white/10"
                        >
                            Beranda
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('arsip.index')}
                            active={route().current('arsip.*')}
                            className="text-white hover:bg-white/10"
                        >
                            Arsip
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('faq')}
                            active={route().current('faq')}
                            className="text-white hover:bg-white/10"
                        >
                            FAQ
                        </ResponsiveNavLink>
                        
                        {user.canUpload && (
                            <ResponsiveNavLink
                                href={route('upload.index')}
                                active={route().current('upload.*')}
                                className="text-white hover:bg-white/10 flex justify-between items-center"
                            >
                                <span>Upload</span>
                                {usePage().props.pendingUploadsCount > 0 && (
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                        {usePage().props.pendingUploadsCount}
                                    </span>
                                )}
                            </ResponsiveNavLink>
                        )}

                        {(user.roles?.includes('Admin') || user.roles?.includes('Developer')) && (
                            <ResponsiveNavLink
                                href={route('users.index')}
                                active={route().current('users.*')}
                                className="text-white hover:bg-white/10"
                            >
                                Pengguna
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-600 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')} className="text-white hover:bg-white/10">
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="text-white hover:bg-white/10"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main key={usePage().url} className="animate-fadeIn flex-grow">{children}</main>
            </div>
        </div>
    );
}
