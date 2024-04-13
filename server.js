const express = require('express');
const axios = require('axios');
const moment = require('moment');
const uuid = require('uuid');
const _ = require('lodash');
const chalk = require('chalk');

const app = express();
const PORT = 3000;

app.use(express.json());

// Se crea el arreglo que almacenera como Objeto cada usuario
const usuario = [];
// Se declara byGenero como una variable global
let byGenero = [];

// Se asigna a la variable today la fecha y hora actual como variable global
const today = moment().format('MMMM Do YYYY, h:mm:ss a');

app.get('/registrar', async (req, res) => {
    try {
        //leyendo una api con Axios
        const response = await axios.get('https://randomuser.me/api/');
        // accediendo a la propiedad data del objeto responde de axios
        const objectData = response.data;
        const userData = objectData.results;
        // Se captura el Genero del usuario de la api
        const Genero = userData[0].gender;
        // se captura el Nombre del usuario de la api
        const Nombre = userData[0].name.first;
        // se captura el Apellido del usuario de la api
        const Apellido = userData[0].name.last;
        // Se genera un UUID para el usuario utilizando los 8 primeros caracteres
        const newUuid = uuid.v4().slice(0, 6);
        // Se agregan como objeto los valores capturados al arreglo por cada usuario y incluyendo la fecha actual definida como variable global
        usuario.push({ Nombre, Apellido, Genero, today, newUuid });
        // Se actualiza la variable global byGenero separando el arreglo por genero
        byGenero = _.partition(usuario, (n) => n.Genero == 'female');

        res.json(byGenero);

    } catch (error) {
        res.status(500).json({ error: 'Error fetching random user data' });
    }
});

app.get('/procesar', (req, res) => {
    try {

        console.log("-------------------------------------- Separador de Consultas --------------------------------------");
        console.log("Mujeres: ");
        byGenero[0].map(persona => {
            const datosPersona = chalk.yellow("Nombre: ") + persona.Nombre + chalk.yellow(" Apellido: ") + persona.Apellido + chalk.yellow(" ID: ") + persona.newUuid + chalk.yellow(" Timestamp: ") + persona.today;
            console.log(chalk.bgWhite.blue(datosPersona));
        });

        console.log("Hombres: ");
        byGenero[1].map(persona => {
            const datosPersona = chalk.yellow("Nombre: ") + persona.Nombre + chalk.yellow(" Apellido: ") + persona.Apellido + chalk.yellow(" ID: ") + persona.newUuid + chalk.yellow(" Timestamp: ") + persona.today;
            console.log(chalk.bgWhite.blue(datosPersona));
        });

        res.json(byGenero);

    } catch (error) {
        res.status(500).json({ error: 'Error fetching random user data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
