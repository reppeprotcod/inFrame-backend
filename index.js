const express = require('express');
const config = require('config');
const sequelize = require('./db');
const router = require('./router');

const app = express();

app.use(express.json());
app.use('/inFrame', router);

const PORT = config.get('port') || 5000;

async function start(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

start();