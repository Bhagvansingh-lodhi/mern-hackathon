export default function Card({ title, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 
                  shadow-sm ring-1 ring-gray-100 
                  transition hover:shadow-md 
                  ${className}`}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-gray-800">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
