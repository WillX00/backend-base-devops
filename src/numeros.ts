export const esPrimo = (numero: number): boolean => {
    if (numero < 2) {
        return false;
    }
    if (numero === 2) {
        return true; // 2 es el único número primo par .
    }
    if (numero % 2 === 0) {
        return false; // Eliminar todos los números pares mayores que 2
    }
    for (let i = 3; i <= Math.sqrt(numero); i += 2) {
        if (numero % i === 0) {
            return false;
        }
    }
    return true;
}
