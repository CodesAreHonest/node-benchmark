const numberOfCpus = require('os').cpus().length;

const seedData = (arr, count) => {
    for (let index = 0; index < count; index++) {
        let indexString = (index + 1).toString();
        arr.push({"id": indexString})
    }

    return arr;
};

const arrPluck = (array, key) => array.map(item => item[key]);

const cpuConsumed = cpuRequired => {
    if (cpuRequired >= numberOfCpus) {
        const cpuConsumed = Math.floor( numberOfCpus / 2);
        return cpuConsumed;
    }

    return cpuRequired;
};

module.exports.seedData = seedData;
module.exports.arrPluck = arrPluck;
module.exports.cpuConsumed = cpuConsumed;
