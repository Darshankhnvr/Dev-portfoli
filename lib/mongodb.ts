
import mongoose from "mongoose"


const MONGODB_URI = process.env.MONGODB_URI as string;
if(!MONGODB_URI){
    throw new Error("Connection failed")
}
declare global {
    // eslint-disable-next-line no-var
    var mongooseConn: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    } | undefined;
  }
  
  // ✅ Typecast global
  const globalWithMongoose = global as typeof globalThis & {
    mongooseConn: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  };

  const catched = globalWithMongoose.mongooseConn || { conn: null, promise: null };

  async function dbConnect() {
    if(catched.conn){
        return catched.conn
    }
    if(!catched.promise){
        catched.promise = mongoose.connect(MONGODB_URI, {
            dbName:'devportfolio'
        }).then((mongoose) => mongoose)
    }

    catched.conn = await catched.promise
    return catched.conn

  }

  export default dbConnect