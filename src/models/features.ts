import mongoose, { ObjectId, Schema } from "mongoose";


const featuresSchema = new mongoose.Schema({
    carModel: {
        type: Schema.Types.ObjectId, ref: 'tCar'
    },
    featuresCat:{
        type: Schema.Types.ObjectId, ref: 'tFeaturesCat'
    },
    name: {
        type: String,
        required: [true, 'Provide name of feature'],
    },
    price: {
        type: Number,
        required: [true, 'Provide price for feature'],
    },
    photo: {
        type: String,
        required: [true, 'Provide photo for feature'],
        unique: true
    },
    default: {
        type: Boolean,
        required: [true, 'Provide default for feature'],
    }
})

export type tFeatures = {
    carModel: ObjectId,
    featuresCat: ObjectId,
    name: string,
    price: number,
    photo: string,
    default: boolean

} 
const FeaturesModel = mongoose.models.features || mongoose.model('features', featuresSchema)
export default FeaturesModel