import mongoose, { ObjectId } from "mongoose";

const carModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide name of car'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Provide price for car'],
    },
    photo: {
        type: String,
        required: [true, 'Provide photo for car'],
        unique: true
    }
})

export type tCar = {
    name: string,
    price: number,
    photo: string,
    _id : ObjectId
}



const CarModel = mongoose.models.cars || mongoose.model('cars', carModelSchema)
export default CarModel