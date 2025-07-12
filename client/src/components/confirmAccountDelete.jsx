import { Trash2 } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-[#fffbea] border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_black] p-6 max-w-md w-full space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-black uppercase text-center">
          Confirm Deletion
        </h2>
        <p className="text-center text-sm sm:text-base font-semibold text-gray-800">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-gray-200 transition font-semibold w-full"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-red-700 transition font-semibold w-full flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
