import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import CarModel from "@/models/car_model";
import OptionalModel from "@/models/features";
import FeaturesCatModel, { tFeaturesCat } from "@/models/features_category";



connect()

export async function POST(req: NextRequest) {
    try {
        const { name } : tFeaturesCat = await req.json();
        const check = await FeaturesCatModel.findOne({ name: name });
        if (check) {
            return NextResponse.json({ message: "Error: this optional already exist in the database" }, { status: 403 })
        }
        const newOptional = await FeaturesCatModel.create({
            name: name
        })
        newOptional.save()
        return NextResponse.json({ message: "feature category create successfully", newOptional }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}