import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import CarModel, { tCar } from "@/models/car_model";
import FeaturesModel from "@/models/features";
import FeaturesCatModel from "@/models/features_category";



connect()

export async function GET(req: NextRequest) {
    try {
        const photo = await req.nextUrl.searchParams.get('photo');
        const check = await FeaturesModel.find({ photo: photo });
        if (!check) {
            return NextResponse.json({ message: "Error: this doesn't exist in the database" }, { status: 404 })
        }

        return NextResponse.json({ check }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}