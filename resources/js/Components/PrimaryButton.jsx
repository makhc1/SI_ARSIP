export default function PrimaryButton({
    className = '',
    disabled,
    loading = false,
    children,
    ...props
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            {...props}
            disabled={isDisabled}
            aria-busy={loading}
            className={
                `inline-flex min-h-[44px] items-center justify-center rounded-md border border-transparent bg-siarsip-terracottaDark px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition duration-150 ease-in-out hover:bg-siarsip-heroDark focus:bg-siarsip-heroDark focus:outline-none focus:ring-2 focus:ring-siarsip-terracottaDark focus:ring-offset-2 focus:ring-offset-slate-950 active:bg-siarsip-heroDark disabled:cursor-not-allowed ${
                    isDisabled ? 'opacity-70 cursor-not-allowed' : ''
                } ` + className
            }
        >
            {loading && (
                <svg
                    className="animate-spin -ms-1 me-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
