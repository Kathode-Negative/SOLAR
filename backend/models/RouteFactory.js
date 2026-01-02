import PlanetFactory from "./PlanetFactory.js";
import { Route } from "./Route.js";
import db from "./database/db.js";

/**
 * Die RouteFactory-Klasse verwaltet die Erstellung, Suche und Verwaltung von Routen in der Datenbank.
 */
class RouteFactory {

    /**
     * Erstellt eine neue Route mit Name, Benutzer und einer Liste von Planeten.
     * @param {string} name - Der Name der Route.
     * @param {Object} user - Der Benutzer, der die Route erstellt.
     * @param {Array<number>} planets - Eine Liste von Planeten-IDs.
     * @returns {Promise<Route>} Die erstellte Route.
     */
    static async createRoute(name, user, planets) {
        const route_id = await RouteFactory.addToRouteTable(name, user);
        var rank = 0;
        var error = null;
        for (let id of planets) {
            if (await RouteFactory.addPlanetToRoute(route_id, id, rank, true)) {
                break;
            }
            rank++;
        }
        return new Promise((resolve, reject) => {
            if (planets.length != rank) {
                reject(error)
            } else {
                resolve(RouteFactory.findRoute(route_id).then(route => { return route; }));
            }
        })

    }

    /**
     * Fügt eine neue Route in die Datenbank ein.
     * @param {string} name - Der Name der Route.
     * @param {Object} user - Der Benutzer, der die Route erstellt.
     * @returns {Promise<number>} Die ID der erstellten Route.
     */
    static addToRouteTable(name,user){
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO Routes (name,user_id) VALUES (?,?)", [name, user.id], function (err) {
                if (err) {
                    reject("Error creating Route: ", err);
                } else {
                    resolve(this.lastID);
                }
            });
        })
    }

    /**
     * Sucht eine Route anhand der ID.
     * @param {number} id - Die ID der Route.
     * @returns {Promise<Route>} Die gefundene Route.
     */
    static async findRoute(id){
        return new Promise((resolve,reject)=>{
            db.get("Select * from Routes Where route_id = ?", [id],function (err,row){
                if(err){
                    reject("Error finding Route: ", err.message)
                } else if (row) {

                    resolve(RouteFactory.getPlanetList(row.route_id).then(planets => {
                        return new Route(row.route_id, row.name, row.user_id, planets)
                    }))

                } else {
                    reject("Route not found.")
                }
            });
        })
    }

    /**
     * Löscht eine Route anhand der ID.
     * @param {number} id - Die ID der Route.
     * @returns {Promise<string>} Erfolgsmeldung.
     */
    static deleteRoute(id){
        return new Promise((resolve,reject)=>{
            db.run("Delete from Routes where route_id = ?",[id],function (err){
                if(err){
                    reject("Error deleting Route: ",err.message)
                }else{
                    resolve("Deleted Route successfully")
                }
            })

        })
    }

    /**
     * Entfernt einen Planeten aus einer Route.
     * @param {number} route_id - Die ID der Route.
     * @param {number} planet_id - Die ID des zu entfernenden Planeten.
     * @returns {Promise<Route>} Die aktualisierte Route.
     */
    static removePlanetFromRoute(route_id,planet_id){
        return new Promise((resolve,reject)=>{
            db.run("Delete from Planet_Route where route_id = ? and planet_id = ?",[route_id,planet_id],function(err) {
                if(err){
                    reject("Error removing planet: ",err.message)
                }else{
                    RouteFactory.findRoute(route_id).then(route =>{resolve(route)})
                }
            })
        })
    }

    /**
     * Fügt einen Planeten zu einer Route hinzu.
     * @param {number} route_id - Die ID der Route.
     * @param {number} planet_id - Die ID des hinzuzufügenden Planeten.
     * @param {number} rank - Die Position des Planeten in der Route.
     * @param {boolean} noReturn - Ob die Route zurückgegeben wird oder nicht.
     * @returns {Promise<Route|boolean>} Die aktualisierte Route oder false.
     */
    static addPlanetToRoute(route_id, planet_id,rank,noReturn) {

        return new Promise((resolve, reject) => {
            db.run("Insert Into Planet_Route (route_id,planet_id,rank) values (?,?,?)", [route_id, planet_id, rank], function (err) {
                if (err) {
                    console.error(err)
                    reject("Error adding planet: ", err.message)
                } else {
                    const returnal = noReturn ? false : RouteFactory.findRoute(route_id).then(route => { return route; })
                    resolve(returnal)
                }
            })
        })
    }
    
    /**
     * Holt eine Liste aller Planeten einer Route.
     * @param {number} route_id - Die ID der Route.
     * @returns {Promise<Array>} Eine Liste der Planeten.
     */
    static getPlanetList(route_id){
        return new Promise((resolve,reject)=>{
            db.all("Select planet_id from Planet_Route Where route_id = ?",[route_id],function(err,rows) {
                if(err){
                    throw "Error finding Planets: ",err.message
                }else if(rows){
                    resolve(RouteFactory.idsToPlanets(rows).then(planets =>{return planets;}));
                } else {
                    return [];
                }
            })
        })
    }

    /**
     * Konvertiert Planeten-IDs in Planet-Objekte.
     * @param {Array} ids - Die Planeten-IDs.
     * @returns {Promise<Array>} Eine Liste von Planet-Objekten.
     */
    static idsToPlanets(ids) {
        return new Promise((resolve, reject) => {
            const func = async (ids) => {
                var planets = [];
                if (!ids instanceof Array) {
                    const p = await PlanetFactory.getPlanet(ids.planet_id);
                    planets.push(p);
                } else {
                    for (let i = 0; i < ids.length; i++) {
                        const element = ids[i].planet_id;
                        const p = await PlanetFactory.getPlanet(element);
                        planets.push(p);
                    };
                }
                return planets;
            }
            resolve(func(ids));
        })
    }

    /**
     * Ruft alle Routen eines bestimmten Benutzers ab.
     * @param {number} userId - Die ID des Benutzers.
     * @returns {Promise<Array<Route>>} Eine Liste der gefundenen Routen.
     */
    static findRoutesByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Routes WHERE user_id = ?", [userId], (err, rows) => {
                if (err) {
                    reject("Error fetching Routes: " + err.message);
                } else if (rows.length > 0) {
                    const routes = rows.map(row => new Route(row.route_id, row.name, row.user_id, row.booked, row.favourite));
                    resolve(routes);
                } else {
                    resolve([]);
                }
            });
        });
    }
}
export { RouteFactory };

