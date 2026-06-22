/**
 * Modal Component
 *
 * Props:
 * @param {boolean} isOpen
 * @param {Function} onClose
 * @param {React.ReactNode} children
 */

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;