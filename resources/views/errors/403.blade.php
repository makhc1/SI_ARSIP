<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Akses Ditolak</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700|playfair-display:400,600,700&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css'])
</head>
<body class="font-sans antialiased text-white bg-black">
    <!-- Cinematic Background -->
    <div class="fixed inset-0 z-[-1]">
        <div class="absolute inset-0 bg-black/80 z-10"></div>
        <img src="/hero_bg.jpg" alt="Background" class="w-full h-full object-cover opacity-50" />
    </div>

    <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 md:p-12 text-center max-w-lg w-full">
            <div class="mb-6 flex justify-center">
                <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                    <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            </div>
            
            <h1 class="text-4xl font-bold font-serif text-white tracking-wider mb-2">403</h1>
            <h2 class="text-xl font-semibold text-siarsip-terracotta mb-4 uppercase tracking-widest">Akses Ditolak</h2>
            
            <p class="text-gray-300 mb-8">
                {{ $exception->getMessage() ?: 'Anda tidak memiliki izin (hak akses) untuk melihat halaman atau dokumen ini.' }}
            </p>

            <a href="{{ url('/') }}" class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md bg-siarsip-terracotta text-white font-medium hover:bg-siarsip-terracottaDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-lg shadow-red-900/50 uppercase tracking-widest text-sm">
                Kembali ke Beranda
            </a>
        </div>
    </div>
</body>
</html>
