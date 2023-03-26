const Atlas = require('atlas.db');

const Database = new Atlas.Database();

const MainStructures = new Atlas.Structure({
    totalVisits: { type: Number, default: 0 },
    totalGenerations: { type: Number, default: 0 },
    visits: { type: Object, default: {} },
    generations: { type: Object, default: {} }
});

const Main = Database.createTable('main', MainStructures);

const main = Main.get('main') || Main.create({
    id: 'main',
    totalVisits: 0,
    totalGenerations: 0,
    visits: {},
    generations: {}
})



module.exports = { Main: Main, main: main };