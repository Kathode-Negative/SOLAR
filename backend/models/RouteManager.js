import { RouteFactory } from "./RouteFactory.js";

/**
 * Die RouteManager-Klasse verwaltet die Erstellung, Verwaltung und Bearbeitung von Routen.
 */
export class RouteManager{

    /**
     * Erstellt eine neue Route mit Namen, Benutzer und einer Liste von Planeten.
     * @param {string} name - Der Name der Route.
     * @param {Object} user - Der Benutzer, der die Route erstellt.
     * @param {Array<number>} planets - Eine Liste von Planeten-IDs in der Route.
     * @returns {Promise<Object>} Die erstellte Route.
     */
    static async addRoute(name, user, planets) {
        return await RouteFactory.createRoute(name, user, planets)
    }

    /**
     * Ruft eine Route anhand der ID ab.
     * @param {number} id - Die ID der Route.
     * @returns {Promise<Object|null>} Die gefundene Route oder null, falls nicht gefunden.
     */
    static async getRoute(id){
        try{
            const route = await RouteFactory.findRoute(id);
            return route;
        } catch (err) {
            return null;
        }
    }

    /**
     * Löscht eine Route anhand ihrer ID.
     * @param {number} id - Die ID der zu löschenden Route.
     * @returns {Promise<void>}
     */
    static async deleteRoute(id){
        RouteFactory.deleteRoute(id);
    }

    /**
     * Entfernt einen Planeten aus einer Route.
     * @param {number} route_id - Die ID der Route.
     * @param {number} planet_id - Die ID des zu entfernenden Planeten.
     * @returns {Promise<Object>} Die aktualisierte Route.
     */
    static async popPlanet(route_id,planet_id){
        try{
            const route = await RouteFactory.removePlanetFromRoute(route_id,planet_id);
            return route;
        } catch (err) {
            return this.getRoute(route_id);
        }
    }

    /**
     * Fügt einen Planeten zu einer Route hinzu.
     * @param {number} route_id - Die ID der Route.
     * @param {number} planet_id - Die ID des hinzuzufügenden Planeten.
     * @returns {Promise<Object>} Die aktualisierte Route.
     */
    static async addPlanet(route_id,planet_id){
        try{
            const route = await RouteFactory.addPlanetToRoute(route_id,planet_id);
            return route;
        } catch (err) {
            return this.getRoute(route_id);
        }

    }

    /**
     * Ruft alle Routen für einen bestimmten Benutzer ab.
     * @param {number} userId - Die ID des Benutzers.
     * @returns {Promise<Array<Object>>} Eine Liste der gefundenen Routen.
     */
    static async getRoutesByUserId(userId) {
        return await RouteFactory.findRoutesByUser(userId); 
    }
    static async getRoutesByUserId(userId) {
        return await RouteFactory.findRoutesByUser(userId); 
    }
    static async getPlanetsFromRoute(routeId) {
        return await RouteFactory.getPlanetList(routeId); 
    }
}

