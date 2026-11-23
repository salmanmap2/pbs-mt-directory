// scripts/migrate-edit-limit.ts
// Run: npx ts-node --project tsconfig.json scripts/migrate-edit-limit.ts

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set in .env.local'); process.exit(1); }

async function migrate() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to MongoDB');

  const col = mongoose.connection.collection('testerprofiles');

  // Add editLimit:5 and isLocked:false to all docs missing these fields
  const result = await col.updateMany(
    { editLimit: { $exists: false } },
    { $set: { editLimit: 5, isLocked: false } }
  );

  console.log(`Updated ${result.modifiedCount} profiles — editLimit set to 5`);

  // Verify
  const total = await col.countDocuments({ isDeleted: { $ne: true } });
  const withLimit = await col.countDocuments({ editLimit: { $exists: true } });
  console.log(`Total active profiles: ${total}`);
  console.log(`Profiles with editLimit: ${withLimit}`);

  await mongoose.disconnect();
  console.log('Done.');
}

migrate().catch((e) => { console.error(e); process.exit(1); });