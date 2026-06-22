/**
 * Toast Component
 *
 * Props:
 * @param {string} message
 */

function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded">
      {message}
    </div>
  );
}

export default Toast;