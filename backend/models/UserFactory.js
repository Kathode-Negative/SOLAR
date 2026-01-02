import { User } from "./User.js";
import db from "./database/db.js";



/**
 * Factory-Klasse zur Verwaltung von Benutzern.
 */
class UserFactory {

    /**
     * Erstellt einen neuen Benutzer.
     * @param {string} email - Die E-Mail-Adresse des Benutzers.
     * @param {string} name - Der Name des Benutzers.
     * @param {string} password - Das Passwort des Benutzers.
     * @param {string} profileImage - Der Pfad zum Profilbild des Benutzers.
     * @returns {Promise<User>} - Gibt das erstellte Benutzerobjekt zurück.
     */
    static createUser(email,name, password, profileImage) {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO Users (email,password,image) VALUES (?,?,?)", [email, password, profileImage], function (err) {
                if (err) {
                    reject("Error creating User: ", err.message)
                } else {
                    resolve(new User(this.lastID, email, password, profileImage, name, ""))
                    resolve("User created: ", email)
                }
            });

        });

    };

    /**
     * Findet einen Benutzer anhand der Benutzer-ID.
     * @param {number} id - Die Benutzer-ID.
     * @returns {Promise<User>} - Gibt das Benutzerobjekt zurück.
     */
    static findUserByID(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE user_id = ?", [id], (err, row) => {
                if (err) {
                    reject("Error finding User: ", err.message)
                } else if (row) {
                    resolve(new User(row.user_id, row.email, row.password, row.image, row.name, row.phone_number))
                } else {
                    reject("User not found")
                }

            });

        });

    };

     /**
     * Findet einen Benutzer anhand der E-Mail-Adresse.
     * @param {string} email - Die E-Mail-Adresse des Benutzers.
     * @returns {Promise<User>} - Gibt das Benutzerobjekt zurück.
     */
    static findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
                if (err) {
                    reject("Error finding User: ", err.message)
                } else if (row) {
                    resolve(new User(row.user_id, row.email, row.password, row.image, row.name, row.phone_number))
                } else {
                    reject("User not found")
                }
            });

        });
        
    };

    /**
     * Aktualisiert die Daten eines Benutzers.
     * @param {number} id - Die Benutzer-ID.
     * @param {string} email - Die neue E-Mail-Adresse.
     * @param {string} username - Der neue Benutzername.
     * @param {string} phoneNumber - Die neue Telefonnummer.
     * @param {string} profileImage - Der neue Pfad zum Profilbild.
     * @returns {Promise<string>} - Gibt eine Bestätigungsmeldung zurück.
     */
    static updateUser(id,email,username,phoneNumber,profileImage){
        return new Promise((resolve,reject)=> {
            db.run("UPDATE Users SET email=?,image=?,name=?,phone_number=? WHERE user_id = ?", [email,profileImage,username,phoneNumber,id], function(err){
                if (err) {
                    reject("Error updating User: ", err.message)
                } else {
                    resolve("User updated")
                }
            })
        })
    }

    /**
     * Löscht einen Benutzer anhand der Benutzer-ID.
     * @param {number} id - Die Benutzer-ID.
     * @returns {Promise<string>} - Gibt eine Bestätigungsmeldung zurück.
     */
    static deleteUserByID(id) {
        return new Promise((resolve, reject) => {
            db.get("DELETE FROM Users WHERE user_id = ?", [id], (err) => {
                if (err) {
                    reject("Error deleting User: ", err.message)
                } else {
                    resolve("User deleted")
                }
            });

        });

    };
}

export { UserFactory };

