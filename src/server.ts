import express from "express";
import { configuration } from "./config.js";
import { esPalindromo } from "./palindromo.js";
import { esPrimo } from "./numeros.js";

const app = express();
app.use(express.json());

// Ruta principal "/"
app.get("/", (req, res) => {
    res.status(200).send(`Hola, esta api fue configurada por el usuario ${configuration.username}`);
});

// Ruta "/key" que muestra la API key de la configuración
app.get("/key", (req, res) => {
    res.status(200).send(`Hola, esta api contiene la siguiente api-key: ${configuration.apiKey}`);
});

// Ruta "/palindromo" que recibe un parámetro 'texto' y verifica si es un palíndromo
app.get("/palindromo", (req, res) => {
    const texto = req.query.texto as string;
    if (!texto) {
        return res.status(400).json({ error: "Debe proporcionar un texto" });
    }

    const resultado = esPalindromo(texto);
    res.json({
        texto,
        esPalindromo: resultado,
    });
});

// Ruta "/palindromo/:frase" que verifica si una frase es un palíndromo
app.get("/palindromo/:frase", (req, res) => {
    const { frase } = req.params;
    res.send(`Hola, la frase ingresada ${esPalindromo(frase) ? "es" : "no es"} un palíndromo`);
});

// Ruta "/primo" que recibe un parámetro 'numero' y verifica si es un número primo
app.get("/primo", (req, res) => {
    const numero = parseInt(req.query.numero as string, 10);
    if (isNaN(numero)) {
        return res.status(400).json({ error: "Debe proporcionar un número válido" });
    }

    const resultado = esPrimo(numero);
    res.json({
        numero,
        esPrimo: resultado,
    });
});

// Ruta "/primo/:numero" que verifica si un número dado en la URL es primo
app.get("/primo/:numero", (req, res) => {
    const { numero } = req.params;
    const numParsed = parseInt(numero, 10);

    if (isNaN(numParsed)) {
        return res.status(400).json({ error: "Debe proporcionar un número válido" });
    }

    res.send(`Hola, el número ingresado ${esPrimo(numParsed) ? "es" : "no es"} un número primo`);
});

export default app;
