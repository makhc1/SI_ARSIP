export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-siarsip-terracottaDark shadow-sm focus:ring-siarsip-terracottaDark ' +
                className
            }
        />
    );
}
