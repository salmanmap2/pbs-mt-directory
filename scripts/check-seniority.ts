import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const col = mongoose.connection.collection("testerprofiles");
  const docs = await col.find({ isDeleted: { $ne: true } }, {
    projection: { fullName: 1, post: 1, joiningDate: 1, seniority: 1 }
  }).sort({ post: 1, joiningDate: 1 }).toArray();
  docs.forEach(d => console.log(`${d.post} | ${d.fullName} | joining:${d.joiningDate?.toISOString().slice(0,10)} | seniority:${d.seniority}`));
  await mongoose.disconnect();
}
run().catch(console.error);