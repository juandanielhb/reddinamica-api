const mongoose = require('mongoose');
const { MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;
const connectionUrl = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`; 

module.exports = (()=>{
    let instance = null,
        isDisconnecting = false;

        
    function connect() {
        console.log("Starting mongodb connection.");
        return new Promise((resolve, reject)=>{
            mongoose.connect(connectionUrl, {useNewUrlParser: true}, (err) => {
                if(err) { reject(err); return; }
                console.log(`Mongo connection is up!`);
                instance = mongoose;
                resolve(instance);
            })
        });

    }
    

    function disconnect(){
        if (instance && !isDisconnecting){
            
            isDisconnecting = true;
            console.log("Disconnecting mongo instance");
            return new Promise((resolve, reject)=>{
                mongoose.disconnect((err)=>{
                    if (err) { reject(err); isDisconnecting=false; return; }
                    console.log("Mongo instance was disconnected");
                    resolve();
                });
            })
        }
    }

    return {
        connect,
        disconnect,
        mongoose
    }
})();
