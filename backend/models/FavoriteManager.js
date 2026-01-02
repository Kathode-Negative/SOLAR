
import { FavoriteFactory } from "./FavoriteFactory.js";
import db from "../models/database/db.js";
import { Favorite } from "./Favorite.js";
import PlanetFactory from "./PlanetFactory.js";
import { Planet } from "./Planet.js";

/**
 * Manager-Klasse zur Verwaltung von Favoriten.
 */
class FavoriteManager {
  
  /**
     * Fügt einen Planeten zu den Favoriten eines Benutzers hinzu.
     * @param {number} userId - Die Benutzer-ID.
     * @param {number} planetId - Die ID des Planeten.
     * @returns {Promise<Favorite>} - Gibt das erstellte Favoriten-Objekt zurück.
     */
    static async addFavorite(userId, planetId) {
        try {
            return await FavoriteFactory.createFavorite(userId, planetId)
        }
        catch (error) {
            console.error("Error creating Favorite:", error)
        }
    }

    /**
     * Ruft die Daten eines Planeten anhand seines Namens ab.
     * @param {string} planetName - Der Name des Planeten.
     * @returns {Promise<Planet|null>} - Gibt das Planeten-Objekt oder null zurück.
     */
    static async getPlanet(planetName) {
      try{
          const planet = await PlanetFactory.findPlanetByName(planetName);
          if(!(planet instanceof Planet)){
              throw new Error(planet)
          }
          return planet;
      } catch (err){
          console.error(err)
          return null
      }
  }
  
  /**
     * Überprüft, ob ein Favorit existiert.
     * @param {number} userId - Die Benutzer-ID.
     * @param {number} planetId - Die Planeten-ID.
     * @returns {Promise<boolean>} - Gibt true zurück, falls der Favorit existiert, sonst false.
     */
  static async doesFavoriteExist(userId, planetId) {
    try{
        const favorite = await this.getFavorite(userId, planetId)
        if(favorite instanceof Favorite){
            return true;
        }else{
            return false;
        }
    }catch(err){
        return false;
    }
    
  }
  
  /**
  * Ruft die Favoriten eines Benutzers ab.
  * @param {number} userId - Die Benutzer-ID.
  * @returns {Promise<Favorite[]>} - Gibt eine Liste der Favoriten zurück.
  */
  static  async getFavorites(userId) {
      try{
        const favorites = await FavoriteFactory.findFavoritesByUser(userId);
        if (!Array.isArray(favorites)) {
          throw new Error("Expected an array but got: " + typeof favorites);
        }
          const validFavorites = favorites.filter(fav => fav instanceof Favorite);
          if (validFavorites.length !== favorites.length) {
            throw new Error("Some elements are not valid Favorite instances.");
          }
          return validFavorites;
        } catch (err) {
          console.error("Error fetching favorites:", err);
          return [];
        }

    }

    /**
     * Ruft die Namen der Favoriten eines Benutzers ab.
     * @param {number} userId - Die Benutzer-ID.
     * @returns {Promise<string[]>} - Gibt eine Liste der Namen der Favoriten zurück.
     */
    static  async getFavoritesNames(userId) {
      try{
        const favoritesNames = await FavoriteFactory.findFavoritesNamesByUser(userId);
          
          return favoritesNames;
        } catch (err) {
          console.error("Error fetching favorites:", err);
          return [];
        }

    }

    /**
     * Entfernt einen Planeten aus den Favoriten eines Benutzers.
     * @param {number} userId - Die Benutzer-ID.
     * @param {string} planetName - Der Name des Planeten.
     * @returns {Promise<{success: boolean, message: string}>} - Gibt eine Erfolgs- oder Fehlermeldung zurück.
     */
    static async removeFavorite(userId, planetName) {
      try {
        const planet = await PlanetFactory.findPlanetByName(planetName);
        const planetId = planet.id;
        const result =  await FavoriteFactory.deleteFavorite(userId, planetId);
        
        if (result.success) {
            return {
                success: true,
                message: `${planetName} has been removed from your favorites.`,
            };
        } else {
            return {
                success: false,
                message: result.message,
            };
        }
    } catch (error) {
        console.error("Error removing favorite:", error);
        return { success: false, message: "Failed to remove the favorite." };
    }
};
}
export default FavoriteManager
