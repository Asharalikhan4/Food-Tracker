import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
};

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env");
};

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
  // In development mode, use a global variable so the client isn't recreated on every reload
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's safe to instantiate the client directly
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
