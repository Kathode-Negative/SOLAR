import express, { response } from "express";
import { PORT } from "./config.js";
import routes from './routes/routes.js';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(cors())

app.use(express.json({limit: '5mb'}))

app.use('/api/', routes);
app.use('/api/images', express.static(path.resolve('public/images')));
app.use('/api/assets',express.static(path.resolve('public/assets')));

app.get('/insert-images', (req, res) => {
  insertPlanetImages();  // Ruft die Funktion zum Einfügen von Bildern auf
  res.send('Bilder wurden erfolgreich in die Datenbank eingefügt!');
});


app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});