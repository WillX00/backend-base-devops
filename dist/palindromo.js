export const esPalindromo = (frase) => {
    const fraseSinEspacios = frase.replace(/\s/g, "").toLowerCase();
    const fraseInvertida = fraseSinEspacios.split("").reverse().join("");
    return fraseSinEspacios === fraseInvertida;
};
//# sourceMappingURL=palindromo.js.map