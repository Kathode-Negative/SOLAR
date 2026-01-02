import fs from 'fs';
import path from 'path';
import db from "./database/db.js";
import { Planet } from "./Planet.js";

/**
 * Die PlanetFactory-Klasse verwaltet die Erstellung, Speicherung und Abfrage von Planeten.
 */
class PlanetFactory {
  
  /**
   * Erstellt einen neuen Planeten mit den angegebenen Parametern.
   * @param {string} name - Der Name des Planeten.
   * @param {number} orbitRadius - Der Orbit-Radius des Planeten.
   * @param {string} color - Die Farbe des Planeten.
   * @param {string} imagePath - Der Pfad zum Bild des Planeten.
   * @param {number} planetSpeed - Die Umlaufgeschwindigkeit des Planeten.
   * @returns {Promise<Object>} Das erstellte Planetenobjekt.
   */
  static createPlanet(name, orbitRadius, color, imagePath, planetSpeed) {
    return new Promise((resolve, reject) => {
      try {
        const angleVel = planetSpeed / orbitRadius;
        const image = fs.readFileSync(path.resolve(imagePath));
        resolve({ name, orbitRadius, color, angleVel, image });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Speichert einen Planeten in der Datenbank.
   * @param {Object} db - Die Datenbankverbindung.
   * @param {Object} planet - Das Planetenobjekt, das gespeichert werden soll.
   * @returns {Promise<void>} Bestätigt das erfolgreiche Speichern oder gibt einen Fehler zurück.
   */
  static savePlanetToDatabase(db, planet) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO Planet (name, orbit_radius, color, angle_velocity, image)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(planet_id) DO UPDATE SET
          orbit_radius = excluded.orbit_radius,
          color = excluded.color,
          angle_velocity = excluded.angle_velocity,
          image = excluded.image;
      `;

      db.run(query, [planet.name, planet.orbitRadius, planet.color, planet.angleVel, planet.image], function(err) {
        if (err) {
          console.error(`Fehler beim Speichern von ${planet.name}:`, err.message);
          reject(err);
        } else {

          resolve();
        }
      });
    });
  }

  /**
   * Findet einen Planeten anhand seines Namens.
   * @param {string} name - Der Name des Planeten.
   * @returns {Promise<Planet>} Der gefundene Planet oder ein Fehler.
   */
  static findPlanetByName(name) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM Planet WHERE name = ?", [name], (err, row) => {
            if (err) {
                reject("Error finding Planet: ", err.message)
            } else if (row) {
                resolve(new Planet(row.planet_id, row.name, row.image))
            } else {
                reject("Planet not found")
            }
        });

    });
    
  };
  /**
   * returns array of all planets currently in database
   */
  static getAllPlanets(){
    return new Promise((resolve,reject)=>{
      db.all('Select * from Planet',function(err,rows){
        if(err){
          reject('Error retrieving planets: ',err.message);
        }else{
          let planets = [];

          for(let n of rows){
            planets.push(new Planet(n.planet_id,n.name,n.image,n.orbit_radius,n.color,n.angle_velocity));
          }
          resolve(planets);
        }
      })
    })
  }
  
  /**
   * Ruft einen Planeten aus der Datenbank anhand seiner ID ab.
   * @param {number} id - Die ID des Planeten.
   * @returns {Promise<Planet|null>} Der gefundene Planet oder null, falls er nicht existiert.
   */
  static getPlanet(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Planet WHERE planet_id = ?`;

      db.get(query, [id], function(err, row) {
        if (err){
          console.error(`Fehler beim Abrufen von ${id}:`, err.message);
          reject(err);
        } else if (row) {
          row.image = Buffer.from(row.image);
          resolve(new Planet(row.planet_id,row.name,row.image,row.orbit_radius,row.color,row.angle_velocity));
        } else {
          console.error(`Planet ${id} nicht gefunden.`);
          resolve(null);
        }
      });
    });
  }
}

export default PlanetFactory;

