const { parentPort, workerData, isMainThread } = require("worker_threads");

// CPU consuming function
const findTransactions = async ({ blockTransactions, ourAddresses }) => {
    const findTxInBlock = blockTransactions.map(blockTx => {
        const { id: blockTxId } = blockTx;
        return new Promise((resolve) => {
            const itemFound = ourAddresses.find(ourAddress => ourAddress.id === blockTxId);
            return resolve(itemFound.id);
        })
    });

    // execute array of promises to obtain the found ids.
    return await Promise.all(findTxInBlock);
};


// verify whether find transaction was called as a worker thread
if (!isMainThread) {

    // we post a message through the parent port, to emit the "message" event
    // parentPort is used to communicate with the parent thread.
    findTransactions(workerData).then(obtainedTransactions => {
        parentPort.postMessage(obtainedTransactions);
    });
}