import mongoose from "mongoose"

type Connection = {
    isConnected?: number
}

let connection: Connection = {}

async function connectToDB(){
    if(connection.isConnected){
        console.log("Connection already exists");
        return
    }

    try {
        const response = await mongoose.connect(process.env.MONGODB_URI || '')
        if(!response.connection.host){
            console.log("DB connection failed");
            return
        }

        connection.isConnected = response.connections[0].readyState
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed");
    }
}

export default connectToDB