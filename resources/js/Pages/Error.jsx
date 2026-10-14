import { Link } from '@inertiajs/react';

export default function Error({ status, message }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status];

    const defaultDescription = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    // Use the exception message if provided and relevant (like for 403 Access Denied), otherwise fallback
    const description = (status === 403 && message && message !== 'This action is unauthorized.') 
        ? message 
        : defaultDescription;

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center p-10">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                    <div className="mt-4 flex justify-center">
                        {status === 403 && (
                            <svg className="w-24 h-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        )}
                        {status === 404 && (
                            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        )}
                        {(status === 500 || status === 503) && (
                            <svg className="w-24 h-24 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        )}
                    </div>
                    <p className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-100">
                        {description}
                    </p>
                </div>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-siarsip-terracotta hover:bg-siarsip-terracottaDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-siarsip-terracotta transition-colors duration-200"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
