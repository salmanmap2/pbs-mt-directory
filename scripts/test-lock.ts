import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function test() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const col = mongoose.connection.collection('testerprofiles');

  // Show current state of all profiles
  const profiles = await col.find({ isDeleted: { $ne: true } }, {
    projection: { fullName: 1, editLimit: 1, isLocked: 1 }
  }).toArray();

  console.log('Current profile states:');
  profiles.forEach(p => {
    console.log(`  ${p.fullName}: editLimit=${p.editLimit} isLocked=${p.isLocked}`);
  });

  // Try locking the first profile directly
  const first = profiles[0];
  if (first) {
    const result = await col.findOneAndUpdate(
      { _id: first._id },
      { $set: { isLocked: true, editLimit: 0 } },
      { returnDocument: 'after' }
    );
    console.log(`\nAfter lock: editLimit=${result?.editLimit} isLocked=${result?.isLocked}`);
  }

  await mongoose.disconnect();
}
test().catch(console.error);