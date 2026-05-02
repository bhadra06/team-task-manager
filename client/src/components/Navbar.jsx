export default function Navbar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="bg-black/30 backdrop-blur-lg text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-lg">🚀 Team Task Manager</h1>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}