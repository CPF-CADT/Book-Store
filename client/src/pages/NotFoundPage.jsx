// client/src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
export function NotFoundPage() {
  return (
    <div className="text-center p-20">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="inline-block mt-6 bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600">
        Go Back Home
      </Link>
    </div>
  );
}