const Atlas = require('atlas.db');

const Database = new Atlas.Database();

const MainStructures = new Atlas.Structure({
    totalVisits: { type: Number, default: 0 },
    totalGenerations: { type: Number, default: 0 },
<<<<<<< HEAD
    visits: { type: Object, default: {} },
    generations: { type: Object, default: {} }
=======
    visits: { type: Array, default: [] },
    generations: { type: Array, default: [] }
>>>>>>> 4339307990cad4e149fdc0fcc5989511f87e38f7
});

const Main = Database.createTable('main', MainStructures);

<<<<<<< HEAD
const main = Main.get('main') || Main.create({
    id: 'main',
    totalVisits: 0,
    totalGenerations: 0,
    visits: {},
    generations: {}
})



module.exports = { Main: Main, main: main };
=======
const main = Main.create({
    id: 'main',
    totalVisits: 0,
    totalGenerations: 0,
    visits: [],
    generations: []
})

module.exports = { main: main };
>>>>>>> 4339307990cad4e149fdc0fcc5989511f87e38f7
