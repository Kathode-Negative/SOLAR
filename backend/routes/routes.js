import express from 'express';
import { userController } from '../controllers/userController.js';
import multer from "multer";
import { favoriteController } from '../controllers/favoriteController.js';
import {routeController} from '../controllers/routeController.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null,'public/images'),
    filename: (req,file,cb) =>{
        const filename = Date.now() + '_' + '.png';
        cb(null,filename);
    }
})
const upload = multer({storage: storage});

/* router.get('/api/validateToken',userController.validateToken) */
// -> userController.validateToken vor jedem route call außer login, weil im login erst token erstellt wird

router.post('/login', userController.authenticateLogin)
router.post('/register',upload.single('file'), userController.register)

router.post('/profile',userController.validateToken)
router.post('/profile',upload.single('file'),userController.updateProfile)

router.get('/profile', userController.validateToken)
router.get('/profile', userController.getUser)

router.get('/validateToken',userController.validateToken)
router.get('/validateToken',function(req,res,next){
    return res.status(200).json({
        message: 'token validated'
    });
})

router.post('/route', userController.validateToken, routeController.createRoute)

router.get('/uploads')

router.get('/favorites', userController.validateToken, favoriteController.getFavorites)
router.delete('/favorites', userController.validateToken, favoriteController.deleteFavorite)
router.post('/favorites', userController.validateToken, favoriteController.createFavorite)

router.post('/addroute',userController.validateToken)
router.post('/addroute',routeController.createRoute)

router.post('/getPlanets', routeController.getPlanetsFromRoute)

router.get('/allPlanets',routeController.getAllPlanets)

router.get('/userRoutes', userController.validateToken, routeController.getUserRoutes);
 
export default router;
