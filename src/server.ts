import express from "express";
import { configuration } from "./config.js";
import { esPalindromo } from "./palindromo.js";
import { esPrimo } from "./numeros.js";
import request from "supertest";


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


test("Validar que el endpoint / devuelva el texto esperado", async () => {
    const response = await request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", /text/);
    
    expect(response.text).toBe(`Hola, esta api fue configurada por el usuario ${configuration.username}`);
});

test("Validar que el endpoint /key devuelva el apikey esperado", async () => {
    const response = await request(app)
        .get("/key")
        .expect(200)
        .expect("Content-Type", /text/);
    
    expect(response.text).toBe(`Hola, esta api contiene la siguiente api-key: ${configuration.apiKey}`);
});

test("Validar que el endpoint /palindromo responda correctamente si la frase es un palíndromo", async () => {
    // Caso donde es un palíndromo
    const responsePalindromo = await request(app)
        .get("/palindromo")
        .query({ texto: "anilina" })
        .expect(200);
    
    expect(responsePalindromo.body.esPalindromo).toBe(true);

    // Caso donde no es un palíndromo
    const responseNoPalindromo = await request(app)
        .get("/palindromo")
        .query({ texto: "hola" })
        .expect(200);

    expect(responseNoPalindromo.body.esPalindromo).toBe(false);

    // Caso borde: sin parámetro 'texto'
    const responseError = await request(app)
        .get("/palindromo")
        .expect(400);

    expect(responseError.body.error).toBe("Debe proporcionar un texto");
});
test("GET /palindromo con texto debe devolver si es palíndromo", async () => {
    const response = await request(app).get("/palindromo").query({ texto: "oso" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        texto: "oso",
        esPalindromo: true,
    });
});

test("Validar que el endpoint /primo indique correctamente si el número es primo", async () => {
    // Caso donde es un número primo
    const responsePrimo = await request(app)
        .get("/primo")
        .query({ numero: "7" })
        .expect(200);

    expect(responsePrimo.body.esPrimo).toBe(true);

    // Caso donde no es un número primo
    const responseNoPrimo = await request(app)
        .get("/primo")
        .query({ numero: "4" })
        .expect(200);

    expect(responseNoPrimo.body.esPrimo).toBe(false);

    // Caso borde: número menor que 2 (no es primo)
    const responseNoPrimoBorde = await request(app)
        .get("/primo")
        .query({ numero: "1" })
        .expect(200);

    expect(responseNoPrimoBorde.body.esPrimo).toBe(false);

    // Caso borde: sin parámetro 'numero'
    const responseError = await request(app)
        .get("/primo")
        .expect(400);

    expect(responseError.body.error).toBe("Debe proporcionar un número válido");
});
describe("Configuration Tests", () => {

    test("Debería usar los valores por defecto cuando no hay variables de entorno", () => {
        // Borramos las variables de entorno para simular que no están definidas
        delete process.env.USERNAME;
        delete process.env.PORT;
        delete process.env.API_KEY;

        const defaultConfig = configuration;

        expect(defaultConfig.username).toBe("Williams");
        expect(defaultConfig.port).toBe(3001);
        expect(defaultConfig.apiKey).toBe("Desconocida");
    });

    test("Debería usar las variables de entorno si están definidas", () => {
        // Simulamos variables de entorno
        process.env.USERNAME = "Carlos";
        process.env.PORT = "4000";
        process.env.API_KEY = "TestApiKey123";

        const envConfig = configuration;

        expect(envConfig.username).toBe("Carlos");
        expect(envConfig.port).toBe(4000);
        expect(envConfig.apiKey).toBe("TestApiKey123");
    });

    test("Debería manejar casos mixtos (algunas variables definidas y otras no)", () => {
        // Simulamos que solo algunas variables de entorno están definidas
        process.env.USERNAME = "Ana";
        delete process.env.PORT; // No está definida
        process.env.API_KEY = "MiApiKey";

        const mixedConfig = configuration;

        expect(mixedConfig.username).toBe("Ana");
        expect(mixedConfig.port).toBe(3001); // Debería usar el valor por defecto
        expect(mixedConfig.apiKey).toBe("MiApiKey");
    });
});

export default app;
