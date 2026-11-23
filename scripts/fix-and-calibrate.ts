import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const col = mongoose.connection.collection("testerprofiles");

  // Fix old post name first
  const fixResult = await col.updateMany(
    { post: "Meter Testing Supervisor" },
    { $set: { post: "Officer (Meter Testing)" } }
  );
  console.log(`Fixed post name: ${fixResult.modifiedCount} docs`);

  // Now sort by joiningDate and assign seniority per post
  const mt = await col.find({ isDeleted: { $ne: true }, post: "Meter Tester" })
    .sort({ joiningDate: 1, createdAt: 1 }).toArray();
  const officer = await col.find({ isDeleted: { $ne: true }, post: "Officer (Meter Testing)" })
    .sort({ joiningDate: 1, createdAt: 1 }).toArray();

  const updates = [
    ...mt.map((p, i) => col.updateOne({ _id: p._id }, { $set: { seniority: i + 1 } })),
    ...officer.map((p, i) => col.updateOne({ _id: p._id }, { $set: { seniority: i + 1 } })),
  ];
  await Promise.all(updates);

  console.log(`Seniority set — MT: ${mt.length}, Officer-MT: ${officer.length}`);

  // Verify
  const all = await col.find({ isDeleted: { $ne: true } }, {
    projection: { fullName: 1, post: 1, joiningDate: 1, seniority: 1 }
  }).sort({ post: 1, seniority: 1 }).toArray();
  all.forEach(d => console.log(`  [${d.post}] #${d.seniority} ${d.fullName}`));

  await mongoose.disconnect();
}
run().catch(console.error);