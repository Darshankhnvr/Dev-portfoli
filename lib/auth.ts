import CredentialsProvider from "next-auth/providers/credentials";
import type { SessionStrategy } from "next-auth";
import NextAuth from "next-auth";
import dbConnect from "./mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions ={
    providers :[
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                email :{},
                password: {}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing Credentials")
                }
                await dbConnect()
                const user = await User.findOne({email:credentials.email})

                if(!user){
                    throw new Error("User not found")
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password)
                if(!isMatch){
                    throw new Error("Invalid Credentials")
                }

                return{
                    id:user._id,
                    name:user.name,
                    email:user.email
                }
            }
        })
    ],
    session: {
        strategy : "jtw" as SessionStrategy,
    },
    pages:{
        signIn : "/login",
    },
    secret : process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}