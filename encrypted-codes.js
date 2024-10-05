// encrypted-codes.js

// 使用 AES 加密的激活码
const encryptedCodes = [
    "U2FsdGVkX1+9X7S5xgp4VWUDTsQUL5Uf0Hs5BKLvxZk=",
    "U2FsdGVkX1/CsJ5lmjBROE745q7I2UgXKVGWTt8r1WE=",
    "U2FsdGVkX1+vOO7y1A5Uc0Mw6GwMrN6fCn5iVZNKHe8="
];

// 用于解密的密钥（在实际应用中，这应该是一个非常安全的密钥）
const decryptionKey = "VerySecretKey123!";

// 解密函数
function decryptCode(encryptedCode) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedCode, decryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

// 验证函数
function validateActivationCode(inputCode) {
    return encryptedCodes.some(encryptedCode => {
        const decryptedCode = decryptCode(encryptedCode);
        return decryptedCode && decryptedCode.toUpperCase() === inputCode.toUpperCase();
    });
}
