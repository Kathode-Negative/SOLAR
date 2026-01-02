
import FavoriteManager from "../models/FavoriteManager.js";
import { UserManager } from "../models/UserManager.js";


    
/**
 * Controller zum Verwalten von Benutzerfavoriten.
 */
export const favoriteController = {
    

    /**
     * Erstellt einen neuen Favoritenplaneten für einen Benutzer.
     * @param {Object} req - Das Anfrageobjekt.
     * @param {Object} res - Das Antwortobjekt.
     * @returns {Promise<void>} - Sendet eine JSON-Antwort mit dem erstellten Favoriten oder einer Fehlermeldung. 
     */
    async createFavorite(req, res) {
        try {
            const { planetName } = req.body;
            const { id } = req.userPayload;
            const user = await UserManager.getUser(id)
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

        const planet = await FavoriteManager.getPlanet(planetName);
        const planetId=planet.id;
        const favorite = await FavoriteManager.addFavorite(id, planetId)
           
            if (favorite) {
                res.status(200).json({
                    message: "created Favorite",
                    body: JSON.stringify({
                        favorite
                    })
                })
            }
        }
        catch (error) {
            console.error("Error creating favorite:", error)
            res.status(500).json({ error: "Error creating favorite", message: error.message })
        }
    },

    /**
     * Ruft die Favoriten eines Benutzers ab.
     * @param {Object} req - Das Anfrageobjekt. 
     * @param {Object} res - Das Antwortobjekt. 
     * @returns {Promise<void>} - Sendet eine JSON-Antwort mit den Favoriten des Benutzers. 
     */
    getFavorites: async (req,res) => {
        const {id} = req.userPayload;
        const favorites = await FavoriteManager.getFavoritesNames(id);
        return res.status(200).json({
            message: 'Favorite data returned',
            favorites
        })
    },

    /**
     * Löscht einen Favoritenplaneten aus der Favoritenliste eines Benutzers.
     * @param {Object} req - Das Anfrageobjekt. 
     * @param {Object} res - Das Antwortobjekt 
     * @returns {Promise<void>} - Sendet eine JSON-Antwort zur Bestätigung der Löschung oder eine Fehlermeldung.
     */
    deleteFavorite: async (req,res) => {
        try{
        const {id} = req.userPayload;
        const { planetName } = req.body;
        const result = await FavoriteManager.removeFavorite(id, planetName);

        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error in removing Favorite:", error);
        return res.status(500).json({ message: "Server error" });
    }

    },
    
}
