import { UserFactory } from "./UserFactory.js";
import { User } from "./User.js";

/**
 * Manager-Klasse zur Verwaltung von Benutzern.
 */
class UserManager {
    
    /**
     * Erstellt einen neuen Benutzer.
     * @param {string} email - Die E-Mail-Adresse des Benutzers.
     * @param {string} password - Das Passwort des Benutzers.
     * @param {string} profileImage - Der Pfad zum Profilbild.
     * @returns {Promise<void>} - Gibt eine Bestätigung zurück.
     */
    static async addUser(email,password,profileImage) {
        UserFactory.createUser(email,"", password, profileImage).then(user=> {
            if (!(user instanceof User)) {
                throw new Error('Invalid user format');
            }
        })
    }

    /**
     * Setzt den Login-Status eines Benutzers.
     * @param {number} id - Die Benutzer-ID.
     */
    static setLoggedIn(id) {

        const user = this.getUserFromList(id)

        if (!user) {
            throw new Error('User does not exist / User not found')
        }
        if (user.isLoggedIn) {
            user.isLoggedIn = false;
        }
        else {
            user.isLoggedIn = true;
        }
    }

    /**
     * Ruft den Login-Status eines Benutzers ab.
     * @param {number} id - Die Benutzer-ID.
     * @returns {boolean} - Gibt den aktuellen Login-Status zurück.   
     */
    static getLoggedIn(id) {
        const user = this.getUserFromList(id);
        if (!user) {
            throw new Error('User does not exist / User not found')
        }
        return user.isLoggedIn;
    }

    /**
     * Überprüft, ob ein Benutzer mit der angegebenen E-Mail existiert.
     * @param {string} email - Die E-Mail-Adresse des Benutzers.
     * @returns {Promise<boolean>} - Gibt true zurück, falls der Benutzer existiert, sonst false.
     */
    static async validateUserCredentials(email) {
        const user = await this.getUserEmail(email)
        if(user){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Ruft die Daten eines Benutzers anhand der Benutzer-ID ab.
     * @param {number} id - Die Benutzer-ID.
     * @returns {Promise<User|null>} - Gibt das Benutzerobjekt oder null zurück.
     */
    static async getUser(id) {
        try{
            const user = await UserFactory.findUserByID(id);
            if(!(user instanceof User)){
                throw new Error(user)
            }
            return user;
        } catch (err){
            return null
        }
    }

    /**
     * Ruft die Daten eines Benutzers anhand der E-Mail-Adresse ab.
     * @param {string} email - Die E-Mail-Adresse des Benutzers.
     * @returns {Promise<User|null>} - Gibt das Benutzerobjekt oder null zurück.
     */
    static async getUserEmail(email){
        try {
            const user = await UserFactory.findUserByEmail(email);
            return user;
        } catch (err) {
            return null;
        }
    }

    /**
     * Ruft eine Liste aller Benutzer ab.
     * @returns {User[]} - Gibt eine Liste aller Benutzer zurück.
     */
    static getAllUsers() {
        return this.listOfUsers;
    }

    /**
     * Aktualisiert das Profil eines Benutzers.
     * @param {number} id - Die Benutzer-ID.
     * @param {string} email - Die neue E-Mail-Adresse.
     * @param {string} username - Der neue Benutzername.
     * @param {string} phoneNumber - Die neue Telefonnummer.
     * @param {string} profileImage - Der neue Pfad zum Profilbild.
     * @returns {Promise<User>} - Gibt das aktualisierte Benutzerobjekt zurück.
     */
    static updateUserProfile(id,email, username, phoneNumber, profileImage) {
        UserFactory.updateUser(id,email,username,phoneNumber,profileImage)
        const user = this.getUser(id)
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

export { UserManager };
