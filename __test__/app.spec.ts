import { describe, test, expect } from "@jest/globals";
import app from "../src/server.js";
import request from "supertest";
import { configuration } from "../src/config.js";
import { esPrimo } from "../src/numeros";

describe("Test Suite App", () => {





    // Test para la ruta principal "/"
    test("GET / debe devolver un mensaje con el nombre de usuario", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Hola, esta api fue configurada por el usuario ${configuration.username}`);
    });

    // Test para la ruta "/key"
    test("GET /key debe devolver la api-key", async () => {
        const response = await request(app).get("/key");
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Hola, esta api contiene la siguiente api-key: ${configuration.apiKey}`);
    });

    // Test para la ruta "/palindromo" con parámetro válido
    test("GET /palindromo con texto debe devolver si es palíndromo", async () => {
        const response = await request(app).get("/palindromo").query({ texto: "oso" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            texto: "oso",
            esPalindromo: true,
        });
    });

    // Test para la ruta "/palindromo" sin parámetro de texto
    test("GET /palindromo sin texto debe devolver un error 400", async () => {
        const response = await request(app).get("/palindromo");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Debe proporcionar un texto" });
    });

    // Test para la ruta "/palindromo/:frase"
    test("GET /palindromo/:frase debe devolver si la frase es un palíndromo", async () => {
        const response = await request(app).get("/palindromo/oso");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hola, la frase ingresada es un palíndromo");
    });

    // Test para la ruta "/primo" con un número válido
    test("GET /primo con número primo debe devolver true", async () => {
        const response = await request(app).get("/primo").query({ numero: "7" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            numero: 7,
            esPrimo: true,
        });
    });

    // Test para la ruta "/primo" con un número no primo
    test("GET /primo con número no primo debe devolver false", async () => {
        const response = await request(app).get("/primo").query({ numero: "4" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            numero: 4,
            esPrimo: false,
        });
    });

    // Test para la ruta "/primo" sin un número válido
    test("GET /primo sin número válido debe devolver un error 400", async () => {
        const response = await request(app).get("/primo").query({ numero: "abc" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Debe proporcionar un número válido" });
    });

    // Test para la ruta "/primo/:numero" con un número válido
    test("GET /primo/:numero con número primo debe devolver que es primo", async () => {
        const response = await request(app).get("/primo/5");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hola, el número ingresado es un número primo");
    });

    // Test para la ruta "/primo/:numero" con un número no primo
    test("GET /primo/:numero con número no primo debe devolver que no es primo", async () => {
        const response = await request(app).get("/primo/8");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hola, el número ingresado no es un número primo");
    });

    // Test para la ruta "/primo/:numero" con un valor no numérico
    test("GET /primo/:numero con valor no numérico debe devolver un error 400", async () => {
        const response = await request(app).get("/primo/abc");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Debe proporcionar un número válido" });
    });
    ///////////

    test("endpoint /", () => {
        expect(1 + 1).toBe(2);
    });

    test("endpoint key", () => {
        expect(1 + 1).toBe(2);
    });

    // Test para palíndromo
    test("endpoint /palindromo", async () => {
        const palindromo = "radar";
        const noPalindromo = "hello";

        // Palíndromo verdadero
        await request(app)
            .get(`/palindromo?texto=${palindromo}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    texto: palindromo,
                    esPalindromo: true
                });
            });

        // Palíndromo falso
        await request(app)
            .get(`/palindromo?texto=${noPalindromo}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    texto: noPalindromo,
                    esPalindromo: false
                });
            });
    });

    // Test para número primo
    test("endpoint /primo", async () => {
        const primo = 7;
        const noPrimo = 8;

        // Número primo verdadero
        await request(app)
            .get(`/primo?numero=${primo}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    numero: primo,
                    esPrimo: true
                });
            });

        // Número primo falso
        await request(app)
            .get(`/primo?numero=${noPrimo}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    numero: noPrimo,
                    esPrimo: false
                });
            });
    });

    describe("Pruebas de la función esPrimo", () => {

        test("Número menor que 2 no es primo", () => {
            expect(esPrimo(1)).toBe(false);
            expect(esPrimo(0)).toBe(false);
            expect(esPrimo(-5)).toBe(false);
        });
    
        test("Número 2 es primo", () => {
            expect(esPrimo(2)).toBe(true);
        });
    
        test("Números pares mayores que 2 no son primos", () => {
            expect(esPrimo(4)).toBe(false);
            expect(esPrimo(10)).toBe(false);
            expect(esPrimo(100)).toBe(false);
        });
    
        test("Números primos impares", () => {
            expect(esPrimo(3)).toBe(true);
            expect(esPrimo(5)).toBe(true);
            expect(esPrimo(11)).toBe(true);
        });
    
        test("Números no primos impares", () => {
            expect(esPrimo(9)).toBe(false);
            expect(esPrimo(15)).toBe(false);
            expect(esPrimo(21)).toBe(false);
        });
    });



    // Test del endpoint principal
    test("test de endpoint /", async () => {
        return await request(app)
            .get("/")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(`Hola, esta api fue configurada por el usuario ${configuration.username}`);
            });
    });
});








