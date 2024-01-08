import { connect } from "@/dbConfig/dbConfig";
import CarModel from "@/models/car_model";
import FeaturesModel, { tFeatures } from "@/models/features";
import FeaturesCatModel from "@/models/features_category";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(req: NextRequest) {
    try {
        const { carModel, featuresCat, name, price, photo, defaultF } = await req.json();
        const checkCar = await CarModel.findOne({ name: carModel });
        const checkFeaturesCat = await FeaturesCatModel.findOne({ name: featuresCat });
        const checkName = await FeaturesCatModel.findOne({ name: name });
        if (!checkCar || !checkFeaturesCat || checkName) {
            return NextResponse.json({ message: "Error: Cannot find what you're looking for" }, { status: 403 })
        }
        const newFeatures = await FeaturesModel.create({
            carModel: checkCar._id,
            featuresCat: checkFeaturesCat._id,
            name: name,
            price,
            photo,
            default: defaultF
        })
        newFeatures.save()
        return NextResponse.json({ message: "Feature create successfully", newFeatures }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}