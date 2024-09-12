export const configuration = {
    username: process.env.USERNAME ?? "Williams",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001, // Asegurando que port sea un número
    apiKey: process.env.API_KEY ?? "Desconocida"
};

