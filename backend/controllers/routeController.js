import PlanetFactory from "../models/PlanetFactory.js";
import { RouteFactory } from "../models/RouteFactory.js";
import { RouteManager } from "../models/RouteManager.js";
import { UserManager } from "../models/UserManager.js";

/**
 * Controller für die Verwaltung von Routen-APIs.
 * Bietet Funktionen zum Erstellen und Abrufen von Benutzer-Routen.
 */
export const routeController = {

    /**
     * Erstellt eine neue Route für einen Benutzer.
     * @param {Object} req - Die Request-Objekt mit den Routen-Daten.
     * @param {Object} res - Das Response-Objekt für die API-Antwort.
     * @returns {Promise<void>} Antwortet mit der erstellten Route oder einem Fehlerstatus.
     */
    async createRoute(req, res) {
        try {
            const { name, planets } = req.body;
            const { id } = req.userPayload;
            const user = await UserManager.getUser(id)

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const route = await RouteManager.addRoute(name, user, planets)

            if (route) {
                res.status(200).json({
                    message: "created Route",
                    body: JSON.stringify({
                        route
                    })
                })
            }
        }
        catch (error) {
            console.error("Error creating route:", error)
            res.status(500).json({ error: "Error creating route" })
        }

    },

    /**
         * Ruft alle Routen eines Benutzers ab.
         * @param {Object} req - Das Request-Objekt mit der Benutzer-ID.
         * @param {Object} res - Das Response-Objekt für die API-Antwort.
         * @returns {Promise<void>} Antwortet mit der Liste der Routen oder einem Fehlerstatus.
         */
    async getUserRoutes(req, res) {
        try {
            const { id } = req.userPayload;
            const userRoutes = await RouteManager.getRoutesByUserId(id);

            if (!userRoutes || userRoutes.length === 0) {
                return res.status(404).json({ error: "No routes found for this user" });
            }

            res.status(200).json({ routes: userRoutes });
        } catch (error) {
            console.error("Error fetching user routes:", error);
            res.status(500).json({ error: "Error fetching routes", message: error.message });
        }
    },

    async getPlanetsFromRoute(req, res) {
        try {
            const { id } = req.body;
            const planetList = await RouteManager.getPlanetsFromRoute(id);

            if (!planetList || planetList.length === 0) {
                return res.status(404).json({ error: "No planets found for this route" });
            }

            res.status(200).json({ planetList: planetList });
        } catch (error) {
            console.error("Error fetching route planets:", error);
            res.status(500).json({ error: "Error fetching planets", message: error.message });
        }
    },

    async getAllPlanets(req,res) {
        const planets = await PlanetFactory.getAllPlanets();

        if(planets instanceof Array){
            return res.status(200).json({planets})
        }else{
            return res.status(400).json({error: planets})
        }
    }

}