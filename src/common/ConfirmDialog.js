const ConfirmDialog = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card p-6 rounded-lg shadow-md w-96">
        <p className="mb-4 text-white text-lg">
          {message || "Are you sure?"}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition-all"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-input text-white rounded hover:opacity-90 transition-all"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
