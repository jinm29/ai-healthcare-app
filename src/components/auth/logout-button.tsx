'use client';

export default function LogoutButton() {
  const handleLogout = () => {
    // Logout logic will be implemented later
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      Logout
    </button>
  );
} 