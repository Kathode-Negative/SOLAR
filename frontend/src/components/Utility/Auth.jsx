import { useEffect, useState } from "react";
import { deleteFromLocal, validateTokenFromBackend } from "./Data"
import { useNavigate } from "react-router-dom";


export const Auth = ({elements,path})=>{
    const navigate = useNavigate();
    const [render, setRender] = useState(false)
    useEffect (()=>{
        validateTokenFromBackend().then(res =>{
            if(!res){
                deleteFromLocal('authToken')
                navigate(path ? path : '/login')
            }
            setRender(res);
        })
    },[])
    return (
        render ? elements : null
    )
}