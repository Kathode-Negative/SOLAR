import { getFromLocal } from "../components/Utility/Data";
import { Link, useNavigate } from 'react-router-dom';



export async function fetchFavorites(setFavorites) {
    const token = getFromLocal("authToken");
    if (!token) {
        navigate("/login");
        return;
    }
    try {
        const response = await fetch("/api/favorites", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: token,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setFavorites(data.favorites);
            return data.favorites
        } else {
            console.error("Failed to fetch favorites");
        }
    } catch (error) {
        console.error("Error fetching favorites:", error.message);
    }

};

export async function addFavorite(planet, setFavorites) {
    try {
        const token = getFromLocal('authToken')
        const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
            body: JSON.stringify({ planetName: planet })
        });

        if (!response.ok) {
            const { error, message, details } = await response.json();
            throw new Error(`[Favorite] HTTP error!
                        status: ${response.status}
                        error: ${error}
                            message: ${message}
                            details: ${details}`);
        }
        setFavorites(prev => [...prev, planet]);
    }
    catch (error) { 
        console.error("adding Favorite failed:", error.message || error);
        
    }
};

export async function removeFavorite(planet, setFavorites) {
    try {
        const token = getFromLocal('authToken');
        const response = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
            body: JSON.stringify({ planetName: planet })
        });

        /*if (!response.ok) {
            const { error, message, details } = await response.json();
            throw new Error(`[Favorite] HTTP error!
                status: ${response.status}
                error: ${error}
                    message: ${message}
                    details: ${details}`);
        }*/
        setFavorites(prev => prev.filter(fav => fav !== planet));
    } catch (error) {
        console.error("Removing Favorite failed:", error.message || error);
    }
};

