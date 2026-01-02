import { Favorite } from "./Favorite.js";
import PlanetFactory from "./PlanetFactory.js";
import db from "./database/db.js";

/**
 * Factory-Klasse zur Verwaltung von Favoriten.
 */
class FavoriteFactory{
    
    /**
     * Erstellt einen neuen Favoriten für einen Benutzer.
     * @param {number} userId - Die Benutzer-ID.
     * @param {number} planetId - Die ID des Planeten.
     * @returns {Promise<Favorite>} - Gibt das erstellte Favoriten-Objekt zurück. 
     */
    static createFavorite(userId, planetId) {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO Favorites (user_id, planet_id) VALUES (?,?)", [userId, planetId], (err) => {
                if (err) {
                    const errorMessage = "Error creating Favorite: " + (err.message || err);
                    reject(errorMessage);
                    console.error(errorMessage);
                } else {
                    resolve(new Favorite(this.lastID, userId, planetId))
                }
            })
        });
    }
    
    /**
     * Sucht die ID eines Planeten anhand seines Namens.
     * @param {string} name - Der Name des Planeten.
     * @returns {Promise<Planet>} - Gibt das Planeten-Objekt zurück. 
     */
    static planetToId(name) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Planets WHERE name = ?", [name], (err, row) => {
                if (err) {
                    reject("Error finding Planet: ", err.message)
                } 
                else if (row) {
                    resolve(new Planet(row.planet_id, row.image, row.name, row.orbit, row.color, row.angle_velocity))
                } else {
                    reject("Planet not found")
                }
            });

        });
        
    };

    /**
     * Ruft die Namen der Favoriten eines Benutzers ab.
     * @param {number} userId - Die Benutzer-ID.
     * @returns {Promise<string[]>} - Gibt eine Liste der Namen der Favoriten zurück. 
     */
    static findFavoritesNamesByUser(userId){
        return new Promise((resolve, reject) => {
            db.all("SELECT p.name FROM Favorites f JOIN Planets p ON f.planet_id = p.planet_id WHERE f.user_id = ?",
           [userId], (err, rows) => {
                if (err) {
                    reject("Error fetching favorites: " + err.message);
                } else {
                    const planetNames = rows.map(row => row.name)
                    resolve(planetNames);
                }
            });
        });
    
    }

    /**
     * Ruft die Favoriten eines Benutzers ab.
     * @param {number} userId - Die Benutzer-ID.
     * @returns {Promise<Favorite[]>} - Gibt eine Liste der Favoriten zurück.
     */
    static findFavoritesByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Favorites WHERE user_id = ?", [userId], (err, rows) => {
                if (err) {
                    reject("Error fetching favorites: " + err.message);
                } else {
                    const favorites = rows.map(row => new Favorite(row.favorite_id, row.user_id, row.planet_id));
                    resolve(favorites);
                }
            });
        });
    }

    static findFavoritesNamesByUser(userId){
        return new Promise((resolve, reject) => {
            db.all("SELECT p.name FROM Favorites f JOIN Planet p ON f.planet_id = p.planet_id WHERE f.user_id = ?",
           [userId], (err, rows) => {
                if (err) {
                    reject("Error fetching favorites: " + err.message);
                } else {
                    const planetNames = rows.map(row => row.name)
                    resolve(planetNames);
                }
            });
        });
    
    }
    
    /**
     * Löscht einen Favoriten eines Benutzers.
     * @param {number} userId - Die Benutzer-ID.
     * @param {number} planetId - Die ID des Planeten.
     * @returns {Promise<string>} - Gibt eine Bestätigung zurück. 
     */
    static deleteFavorite(userId, planetId){
        return new Promise((resolve, reject) => {
            db.get("DELETE FROM Favorites WHERE user_id = ? AND planet_id= ?", [userId, planetId], (err) => {
                if (err) {
                    reject("Error deleting Favorite: ", err.message)
                } else {
                    resolve("Favorite deleted")
                }
            });

        });
    }


}
export { FavoriteFactory };
