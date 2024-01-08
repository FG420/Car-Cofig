import { connect } from "@/dbConfig/dbConfig";
import CarModel from "@/models/car_model";
import FeaturesModel from "@/models/features";
import FeaturesCatModel from "@/models/features_category";
import { NextRequest, NextResponse } from "next/server";

connect()


export async function GET(req: NextRequest) {
    try {
        const check = await req.nextUrl.searchParams.get('car');
        const car = await CarModel.find({ name: check });
        const check2 = await req.nextUrl.searchParams.get('cat');
        const cat = await FeaturesCatModel.find({ name: check2 })
        if (!car || !cat) {
            return NextResponse.json({ message: "Error: what you're trying to search doesn't exist in the database" }, { status: 404 })
        }
        const getCat = await FeaturesModel.find({ carModel: car, featuresCat: cat });
        return NextResponse.json({ car, cat, getCat }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}