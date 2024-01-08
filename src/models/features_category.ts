import mongoose, { ObjectId } from "mongoose";

const featuresCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Provide name of feature category'],
        unique: true
    },
    
})

export type tFeaturesCat = {
    name: string,
    _id : ObjectId
}


const FeaturesCatModel = mongoose.models.features_category || mongoose.model('features_category', featuresCategorySchema)
export default FeaturesCatModel