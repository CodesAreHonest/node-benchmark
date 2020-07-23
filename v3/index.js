/**
 * Sequential For Loops Example
 */

const seedData = require('../helper').seedData;

let blockTransactions = [],
    ourAddresses = [];
const BLOCKTX_COUNT = 200,
      OURADDRESSES_COUNT = 500000;

// seeds data for block transactions and our transactions
blockTransactions = seedData(blockTransactions, BLOCKTX_COUNT);
ourAddresses = seedData(ourAddresses, OURADDRESSES_COUNT);

console.time('elapsedTime [v3]');

// map find actions as array of promises
const findTxInBlock = blockTransactions.map(blockTx => {
    const { id: blockTxId } = blockTx;

    for (let i = 0; i < ourAddresses.length; i++) {
        if ( ourAddresses[i].id === blockTxId ) {
            return blockTxId;
        }
    }
});

// execute array of promises to obtain the found ids.
Promise.all(findTxInBlock).then (foundIds => {

    // found ids.
    console.timeEnd('elapsedTime [v3]');
});

