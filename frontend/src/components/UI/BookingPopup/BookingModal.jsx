

const BookingConfirmation = ({ isOpen, onConfirm }) => {

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onConfirm}>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="pacifico-regular italic text-2xl pb-4 font-semibold">Congratulations!</h2>
                <p className="text-gray-700">Your trip has been booked. Thank You for choosing Solar Travels!</p>
                <div className="mt-2 flex justify-end space-x-2">
                    <button
                        className="p-2 small-button text-black rounded"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}; export default BookingConfirmation