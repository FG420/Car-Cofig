import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.mongo_url!)
        const conn = mongoose.connection;
        conn.on('connected', () => {
            console.log('connection OK')
        })
        conn.on('err', (err) => {
            console.log('Error of connection: ' + err);
            process.exit();
        })
    } catch (error) {
        console.log(error)
    }
}