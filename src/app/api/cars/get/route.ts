import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import CarModel from "@/models/car_model";
import FeaturesModel from "@/models/features";

connect()

export async function GET(req: NextRequest) {
    try {
        const check = await req.nextUrl.searchParams.get('name');
        const car = await CarModel.find({ name: check});
        if (!car) {
            return NextResponse.json({ message: "Error: this model doesn't exist in the database" }, { status: 404 })
        }
        const getFeat = await FeaturesModel.find({carModel : car, default : true});
        return NextResponse.json({ getFeat, car }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}