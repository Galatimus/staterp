let { loadEMS } = require('./plugins/ems');

let factions = exports;

factions.init = () => {
    loadEMS();
}