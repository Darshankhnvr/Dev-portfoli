import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, password: hashed });
  await newUser.save();

  return NextResponse.json({ message: "User registered!" }, { status: 201 });
}
