export default function Loader() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="loader h-10 w-10 rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
      <span className="text-sm font-medium text-gray-600">
        Loading...
      </span>
    </div>
  );
}
