import { UserManager } from '../models/UserManager.js';
import jwt from 'jsonwebtoken'
import fs from 'fs'

const SECRET_KEY = 'secretKeyTest'

/**
 * Controller zum Verwalten von Benutzerkonten
 */
export const userController = {
   /**
    * Registriert einen neuen Benutzer.
    * @param {Object} req - Das Anfrageobjekt. 
    * @param {Object} res - Das Antwortobjekt 
    * @returns {Promise<void>} - Sendet eine JSON-Antwort über den Registrierungsstatus.
    */
    async register(req, res) {
        const {email, password} = req.body;
        var image = null
        if(req.file){
            image = req.file;
        }
        
        if (!email || !password) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Email and password are required'
            });
        }
        const isUser = await UserManager.validateUserCredentials(email);

        if (isUser) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Account with this email already exists'
            });
        } else {
            UserManager.addUser(email, password, image == null ? 'null' : image.path.replace('public/',""));
            return res.status(200).json({ message: 'Account created' });
        }
    },

    /**
     * Authentifiziert einen Benutzer und erstellt ein JWT.
     * @param {Object} req - Das Anfrageobjekt.
     * @param {Object} req - Das Anfrageobjekt.
     */
    async authenticateLogin(req, res) {
        const { email, password } = req.body
    

        const user = await UserManager.getUserEmail(email)

        if (user && user.password == password) {

            const payload = { id: user.id, email: user.email }
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' })

            res.status(200).json({ token, message: "User Found - generated Token" })
        }
        else {
            res.status(401).json({ error: "Email or Password is wrong" })
        }
    },

    /**
     * Validiert das JWT-Token eines Benutzers.
     * @param {Object} req - Das Anfrageobjekt.
     * @param {Object} res - Das Antwortobjekt.
     * @param {Function} next - Die nächste Middleware-Funktion. 
     */
    validateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        if (!token) {
            return res.status(401).json({ error: 'no token - token required' })
        }
 
        jwt.verify(token, SECRET_KEY, (err, userPayload) => {
            if (err) {
                return res.status(401).json({ error: 'invalid token' })
            }
            // wenn alles passt, dann erhält user die payload daten aus dem jwt
            req.userPayload = userPayload
            next()
        })
    },
    /**
     * Aktualisiert das Benutzerprofil.
     * @param {Object} req - Das Anfrageobjekt.
     * @param {Object} res - Das Antwortobjekt.
     * @returns {Promise<void>} - Sendet eine JSON-Antwort über den Aktualisierungsstatus. 
     */
    updateProfile: async (req, res) => {
        try {
            const {email,name,phoneNumber} = req.body;
            var profileImage = null;
            if(req.file){
                profileImage = req.file;
            }
            
            const {id} = req.userPayload;

            if (!email) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Email is required'
                });
            }
            const previousUser = await UserManager.getUser(id);
            if(profileImage == null){
                profileImage = {path: previousUser.profileImage};
            }else{
                if(previousUser.profileImage){
                    fs.unlink('public/'+previousUser.profileImage,(err)=>{
                        if(err){console.error('no file found',err.message)}
                    })
                }
            }

            const updatedUser = UserManager.updateUserProfile(id,email, name, phoneNumber, profileImage.path.replace('public/',""));
            const user = {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.username,
                phoneNumber: updatedUser.phoneNumber,
                profileImage: updatedUser.profileImage
            };

            return res.status(200).json({
                message: 'Profile updated successfully', user
            });
        } catch (err) {
            if (err.message === 'User not found') {
                return res.status(404).json({
                    error: 'Not Found',
                    message: err.message
                });
            }
            return res.status(500).json({
                error: 'Internal Server Error',
                message: err.message
            });
        }
    },
    
    /**
     * Ruft die Benutzerdaten ab.
     * @param {Object} req - Das Anfrageobjekt.
     * @param {Object} res - Das Antwortobjekt.
     * @returns {Promise<void>} - Sendet eine JSON-Antwort mit den Benutzerdaten. 
     */
    getUser: async (req,res) => {
        const {id} = req.userPayload;
        const datauser = await UserManager.getUser(id);
        if (!datauser) {
            return res.status(500).json({
                message: 'User not found'
            })
        }
        const user = {
            id: datauser.id,
            email: datauser.email,
            name: datauser.username,
            phoneNumber: datauser.phoneNumber,
            profileImage: datauser.profileImage,
            userId: id
        }

        return res.status(200).json({
            message: 'User data returned',
            user
        })
    },
};