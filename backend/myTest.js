const ethUtil = require('ethereumjs-util');
const secp256k1 = require('secp256k1');
const ethers  = require('ethers');


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

// function signMessage1(message) {
//     const privateKeyBuffer = Buffer.from(PRIVATEKEY, 'hex');

//     // Step 1: Hash the original message
//     const messageHash = ethUtil.keccak256(Buffer.from(message));
//     console.log("Original Message Hash is:", Buffer.from(messageHash).toString('hex'));

//     // Step 2: Prefix the message hash
//     const prefix = "\x19Ethereum Signed Message:\n32";
//     const prefixedMessage = ethUtil.keccak256(Buffer.concat([Buffer.from(prefix), messageHash]));

//     console.log("Prefixed Message Hash is:", Buffer.from(prefixedMessage).toString('hex'));

//     // Step 3: Sign the final hash
//     const { signature } = secp256k1.ecdsaSign(prefixedMessage, privateKeyBuffer);

//     console.log("in bytes is : ", signature)
//     let signatureHex = Buffer.from(signature).toString('hex');
    
//     return signatureHex;
// }

// function signMessage1(message) {
//     const privateKeyBuffer = Buffer.from(PRIVATEKEY, 'hex');

//     // Step 1: Hash the original message
//     const messageHash = ethUtil.keccak256(Buffer.from(message));
//     console.log("Original Message Hash is:", messageHash.toString('hex'));

//     // Step 2: Prefix the message hash
//     const prefix = "\x19Ethereum Signed Message:\n32";
//     const prefixedMessage = ethUtil.keccak256(Buffer.concat([Buffer.from(prefix), messageHash]));

//     console.log("Prefixed Message Hash is:", prefixedMessage.toString('hex'));

//     // Step 3: Sign the final hash
//     const { signature, recid } = secp256k1.ecdsaSign(prefixedMessage, privateKeyBuffer);

//     console.log("Signature (r + s) in bytes:", signature);

//     // Step 4: Append the recovery id to the signature
//     const fullSignature = Buffer.concat([Buffer.from(signature), Buffer.from([recid])]);

//     console.log("Full signature with recovery id (v):", fullSignature.toString('hex'));

//     return fullSignature.toString('hex');
// }


// Function to sign a message
async function signMessage1(message) {
    // Initialize wallet with private key

    const originalMessageHash = ethUtil.keccak256(Buffer.from(message));

    const wallet = new ethers.Wallet(PRIVATEKEY);

    // Sign the message
    const signature = await wallet.signMessage(originalMessageHash);

    console.log("Signature:", signature);
    console.log("Signature length:", signature.length);

    return signature;
}



signMessage1(myString).then((signature) => {
    console.log("Signature:", signature);
}).catch((error) => {
    console.error("Error signing message:", error);
});
