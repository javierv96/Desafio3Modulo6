const express = require('express');
const axios = require('axios');
const moment = require('moment')
const uuid = require('uuid');
const _ = require('lodash');
const chalk = require('chalk')

const app = express();
const PORT = 3000;

app.use(express.json());

// Se crea el arreglo que almacenera como Objeto cada usuario
const usuario = [];
// Se asigna a la variable today la fecha y hora actual como variable global
const today = moment().format('MMMM Do YYYY, h:mm:ss a');

app.get('/randomuser', async (req, res) => {
    try {
        //leyendo una api con Axios
        const response = await axios.get('https://randomuser.me/api/');
        // accediendo a la propiedad data del objeto responde de axios
        const objectData = response.data;
        const userData = objectData.results;
        // Se captura el Genero del usuario de la api
        const Genero = userData[0].gender;
        // Se captura el nombre del usuario de la api en un arreglo y se junta utilizando join
        const nombreFrag = [userData[0].name.first, userData[0].name.last];
        const nombreCompleto = nombreFrag.join(" ");
        // Se genera un UUID para el usuario utilizando los 8 primeros caracteres
        const newUuid = uuid.v4().slice(0, 6);
        // Se agregan como objeto los valores capturados al arreglo por cada usuario y incluyendo la fecha actual definida como variable global
        usuario.push({ nombreCompleto, Genero, today, newUuid })
        // Se separa por genero en un arreglo nuevo utilizando lodash
        const byGenero = _.partition(usuario, (n) => n.Genero == 'male');

        res.json(byGenero);

        console.log("-------------------------------------- Separador de Consultas --------------------------------------");
        console.log("Hombres: ");
        for (let i = 0; i < byGenero[0].length; i++){
            const persona = chalk.yellow("Nombre: ")+byGenero[0][i].nombreCompleto+chalk.yellow(" ID: ")+byGenero[0][i].newUuid+chalk.yellow(" Timestamp: ")+byGenero[0][i].today;
            console.log(chalk.bgWhite.blue(persona));
        }
        console.log("Mujeres: ");
        for (let i = 0; i < byGenero[1].length; i++){
            const persona = chalk.yellow("Nombre: ")+byGenero[1][i].nombreCompleto+chalk.yellow(" ID: ")+byGenero[1][i].newUuid+chalk.yellow(" Timestamp: ")+byGenero[1][i].today;
            console.log(chalk.bgWhite.blue(persona));
        }

    } catch (error) {
        res.status(500).json({ error: 'Error fetching random user data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
