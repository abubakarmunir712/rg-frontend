import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
        404
      </h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
        Page not found
      </p>
      <p className="mt-2 text-gray-500 dark:text-gray-500">
        The page you're looking for doesn't exist.
      </p>
      <div className="mt-6 space-x-4">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </Link>
        <Link
          to="/about"
          className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
