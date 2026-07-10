// pages/Unauthorized.jsx
export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center text-center flex-col">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">
        You must be logged in to access the restaurant dashboard.
      </p>
      <a
        href="/dashboard-login"
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Go to Login
      </a>
    </div>
  );
}
