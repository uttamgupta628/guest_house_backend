import mongoose from "mongoose";


const connectDB=async()=>{
    try {
        console.log(process.env.MONGODB_URL)
        const connectioninstance=await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
        console.log(`connection established on ${connectioninstance.connection.host}`)
    } catch (error) {
        console.log("connection error in mongodb ",error);
        process.exit(1);
    }
}
export default connectDB