const ethUtil = require('ethereumjs-util');
const secp256k1 = require('secp256k1');


const PRIVATEKEY = '29a51884dea81b2eb575cd46bd51bd703cfb4c45e44ff0ee00f113b7b4339088'
const myString = "ejsd,dskdj,dsjkdj,dsk"

function signMessage(message)
{
    // const prefixedMessage = `\x19Ethereum Signed Message:\n32${message}`;
    const privateKeyBuffer = Buffer.from(PRIVATEKEY, 'hex');
    const originalMessageHash = ethUtil.keccak256(Buffer.from(message));
    let prefixedHash = "\x19Ethereum Signed Message:\n32"+Buffer.from(originalMessageHash).toString('hex')
    let messageHash = ethUtil.keccak256(Buffer.from(prefixedHash));
    // console.log("Pre Message Hash is : ", prefixedHash)
    // prefixedHash = Buffer.from(prefixedHash, 'hex');
    const { signature } = secp256k1.ecdsaSign(messageHash, privateKeyBuffer);
    console.log(Buffer.from(signature, 'hex'));
    const signatureHex = Buffer.from(signature).toString('hex');
    return signatureHex;
}

function signMessage1(message) {
    const privateKeyBuffer = Buffer.from(PRIVATEKEY, 'hex');

    // Step 1: Hash the original message
    const messageHash = ethUtil.keccak256(Buffer.from(message));
    console.log("Original Message Hash is:", Buffer.from(messageHash).toString('hex'));

    // Step 2: Prefix the message hash
    const prefix = "\x19Ethereum Signed Message:\n32";
    const prefixedMessage = ethUtil.keccak256(Buffer.concat([Buffer.from(prefix), messageHash]));

    console.log("Prefixed Message Hash is:", Buffer.from(prefixedMessage).toString('hex'));

    // Step 3: Sign the final hash
    const { signature } = secp256k1.ecdsaSign(prefixedMessage, privateKeyBuffer);
    const signatureHex = Buffer.from(signature).toString('hex');
    
    return signatureHex;
}

console.log("My signature is : " , signMessage(myString) )
console.log("my String is : ", signMessage1(myString))
