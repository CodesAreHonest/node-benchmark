/**
 * Parallel For Loops Example
 *
 * @references
 * https://nodejs.org/api/worker_threads.html#worker_threads_worker_threads
 *
 * */

const { Worker } = require("worker_threads");
const path = require("path");
const os = require("os");
const seedData = require('../helper').seedData;

// obtain the number of cpu in the server.
const cpuCount = os.cpus().length;

// seeds data for block transactions and our transactions
const BLOCKTX_COUNT = 200,
      OURADDRESSES_COUNT = 500000;
let blockTransactions = seedData([], BLOCKTX_COUNT);
let ourAddresses = seedData([], OURADDRESSES_COUNT);

const findTransactionWithWorker = (blockTransactions, ourAddresses) => {

    // obtain the tasks from the file.
    const workerScript = path.join(__dirname, "./findTransactions.js");

    const workerData = { blockTransactions, ourAddresses };

    return new Promise((resolve, reject) => {

        // assign an intensive work to the worker
        const worker = new Worker(workerScript, { workerData });

        // resolve the promise when the worker has done the job.
        worker.on('message', resolve);

        // reject the promise if the worker possess errors.
        worker.on('error', reject);
    })
};

// worker working together to distribute the tasks.
const distributeLoadAcrossWorkers = async numberOfWorkers => {

    // how many items should each worker should find the items (address).
    console.time(`elapsedTime [v4]`);
    const itemPerWorker = Math.round(OURADDRESSES_COUNT / numberOfWorkers);
    const promises = Array(numberOfWorkers)
        .fill()
        .map((_, index) => {
            let blockTransactionToFind = [];

            // the first worker 0 - 125000 (0)
            if (index === 0) {
                blockTransactionToFind = blockTransactions.slice(0, itemPerWorker);
            }
            // the last worker 375000 - 500000 (3)
            else if (index === numberOfWorkers - 1) {
                blockTransactionToFind = blockTransactions.slice(itemPerWorker * index);
            }
            // the second and third workers (125000 - 250000, 250000 - 375000)
            else {
                blockTransactionToFind = blockTransactions.slice(itemPerWorker * index,itemPerWorker * (index + 1))
            }

            return findTransactionWithWorker(blockTransactionToFind, ourAddresses);
        });

    const results = await Promise.all(promises);
    console.timeEnd(`elapsedTime [v4]`);
    return results.reduce((totalFoundTx, txFoundByOneWorker) => totalFoundTx.concat(txFoundByOneWorker), []);
};

// this is the main function (it's only to allow the use of async await for simplicity)
async function run() {

    // sort with multiple workers, based on the cpu count
    // console.time(`elapsedTime [v4]`);
    const result3 = await distributeLoadAcrossWorkers(cpuCount);
    // console.timeEnd(`elapsedTime [v4]`);
}

run();
