function xorEncrypt(text, key = 42) {
    return btoa([...text].map(char => char.charCodeAt(0) ^ key).join(','));
}
function xorDecrypt(encoded, key = 42) {
    const bytes = atob(encoded).split(',').map(n => parseInt(n, 10));
    return String.fromCharCode(...bytes.map(n => n ^ key));
}
export { xorEncrypt, xorDecrypt };