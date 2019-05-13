require('dotenv').config();

const PORT = process.env.PORT || 3800;
const mongoose = require("./db/connect");
const app = require('./app');

async function initDB(){
    const db = await mongoose.connect();
    if (db) { initApp(); }
}

function initApp(){
    console.log("Starting server");
    app.listen(PORT, ()=>{
        console.log(`Server is up on port: ${PORT}`);
    });
    process.on("SIGINT", closeApp);
    process.on("SIGTERM", closeApp);
}

function closeApp(){
    mongoose.disconnect()
        .then(()=>process.exit(0));
}

initDB();


