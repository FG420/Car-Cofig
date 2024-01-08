import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import CarModel, { tCar } from "@/models/car_model";



connect()

export async function POST(req: NextRequest) {
    try {

        const { name, price, photo } : tCar = await req.json();
        const check = await CarModel.findOne({ name: name });
        if (check) {
            return NextResponse.json({ message: "Error: this car already exist in the database" }, { status: 403 })
        }

        if (typeof price !== 'number') {
            return NextResponse.json({ message: "Error: please provide a float value for the price" }, { status: 400 });
        }
        const newCar = await CarModel.create({
            name: name,
            price: price,
            photo: photo
        })
        newCar.save()
        return NextResponse.json({ message: "car create successfully", newCar }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}