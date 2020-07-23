/**
 * Parallel For Loops Example
 *
 * @references
 * https://stackoverflow.com/questions/50332627/how-to-use-nodes-child-process-exec-with-promises
 */

const cluster = require('cluster');
const cpuConsumed = require('../helper').cpuConsumed;
const childProcess = require('child_process');
const numberOfCPUs = cpuConsumed(2);

if (cluster.isMaster) {
    // Fork workers.
    for (let i = 0; i < numberOfCPUs; i++) {
        cluster.fork();
    }

    Object.keys(cluster.workers).forEach(function(id) {
        console.log("I am running with ID : " + cluster.workers[id].process.pid);
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    console.log ('do something');
}