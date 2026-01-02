import { useNavigate } from "react-router-dom";



const LoginCheck = ({ isOpen, onConfirm }) => {
    
    const navigate = useNavigate();
    

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-large p-6 rounded-lg shadow-lg border-4 border-red-900">
                <h2 className="roboto-light-semibold text-2xl text-red-500 pb-4 font-semibold">Error!</h2>
                <p className="text-gray-200">There has been an error with your request. Please make sure you're logged in!</p>
                <div className="mt-2 flex justify-end space-x-2">
                    <button
                        className="p-2 small-button text-black rounded"
                        onClick={onConfirm}
                    >
                        Exit
                    </button>
                    <button
                        className="p-2 small-button text-black rounded"
                        onClick={() => { navigate("/login") }}
                    >
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
}; export default LoginCheck