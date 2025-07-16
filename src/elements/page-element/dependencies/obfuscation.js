function xorEncrypt(text, key = 42) {
    return btoa([...text].map(char => char.charCodeAt(0) ^ key).join(','));
}
function xorDecrypt(encoded, key = 42) {
    const bytes = encoded ? atob(encoded).split(',').map(n => parseInt(n, 10)) : '';
    const returnVal = bytes == '' ? '' : String.fromCharCode(...bytes.map(n => n ^ key));
    return returnVal;
}
export { xorEncrypt, xorDecrypt };