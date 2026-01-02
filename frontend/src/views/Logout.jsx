import React from "react";
import { deleteFromLocal} from "../components/Utility/Data";
const Logout = ()=>{
    
    return (
    <div className="flex items-center justify-center h-full bg-black overflow-hidden">
        <div className="bg-large justify-center items-center pl-48 pr-48 pt-20 pb-20 overflow-hidden rounded-lg">
            <h1 className="text-white text-7xl m-10 text-center">
                You are logged out now!
            </h1>     
        </div>
    </div>)
}

export default Logout