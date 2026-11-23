import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;

const TesterProfileSchema = new mongoose.Schema(
  {
    profilePic: String,
    fullName: { type: String, required: true },
    post: { type: String, enum: ['Meter Tester', 'Meter Testing Supervisor'], required: true },
    pbs: { type: String, required: true },
    office: { type: String, required: true },
    ownDistrict: { type: String, required: true },
    transferChoice1: String, transferChoice2: String, transferChoice3: String,
    mobileNumber: { type: String, required: true, unique: true },
    whatsappNumber: String, facebookUrl: String,
    joiningDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TesterProfile = mongoose.models.TesterProfile || mongoose.model('TesterProfile', TesterProfileSchema);

const SAMPLES = [
  { fullName: 'Mohammad Shahriar Hossain', post: 'Meter Tester', pbs: 'Dhaka PBS-1', office: 'Demra Office', ownDistrict: 'Dhaka', mobileNumber: '01711234567', whatsappNumber: '01711234567', joiningDate: new Date('2018-03-15'), transferChoice1: 'Chittagong PBS', transferChoice2: 'Sylhet PBS', transferChoice3: 'Comilla PBS' },
  { fullName: 'Khaleda Akter Rahman', post: 'Meter Testing Supervisor', pbs: 'Dhaka PBS-2', office: 'Mirpur Office', ownDistrict: 'Faridpur', mobileNumber: '01812345678', whatsappNumber: '01812345678', joiningDate: new Date('2015-07-20'), transferChoice1: 'Dhaka PBS-1', transferChoice2: 'Mymensingh PBS', transferChoice3: '' },
  { fullName: 'Nurul Islam Bhuiyan', post: 'Meter Tester', pbs: 'Chittagong PBS', office: 'Pahartali Office', ownDistrict: 'Chittagong', mobileNumber: '01913456789', joiningDate: new Date('2020-01-10'), transferChoice1: 'Comilla PBS' },
  { fullName: 'Roksana Begum', post: 'Meter Testing Supervisor', pbs: 'Sylhet PBS', office: 'Sylhet Sadar Office', ownDistrict: 'Sylhet', mobileNumber: '01614567890', whatsappNumber: '01614567890', joiningDate: new Date('2012-11-05'), facebookUrl: 'https://facebook.com/roksana.pbs' },
  { fullName: 'Mizanur Rahman Khan', post: 'Meter Tester', pbs: 'Comilla PBS', office: 'Laksham Office', ownDistrict: 'Comilla', mobileNumber: '01515678901', joiningDate: new Date('2019-06-01'), transferChoice1: 'Dhaka PBS-1', transferChoice2: 'Dhaka PBS-2' },
  { fullName: 'Farzana Sultana', post: 'Meter Tester', pbs: 'Mymensingh PBS', office: 'Mymensingh Sadar Office', ownDistrict: 'Mymensingh', mobileNumber: '01316789012', whatsappNumber: '01316789012', joiningDate: new Date('2021-04-18') },
  { fullName: 'Abul Kalam Azad', post: 'Meter Testing Supervisor', pbs: 'Rajshahi PBS', office: 'Rajshahi City Office', ownDistrict: 'Rajshahi', mobileNumber: '01817890123', joiningDate: new Date('2010-09-25'), transferChoice1: 'Dhaka PBS-1', transferChoice2: 'Dhaka PBS-2', transferChoice3: 'Chittagong PBS' },
  { fullName: 'Sharmin Akter Nila', post: 'Meter Tester', pbs: 'Khulna PBS', office: 'Khulna Sadar Office', ownDistrict: 'Khulna', mobileNumber: '01718901234', whatsappNumber: '01718901234', joiningDate: new Date('2022-02-14'), facebookUrl: 'https://facebook.com/sharmin.nila' },
  { fullName: 'Kamal Hossain Sarker', post: 'Meter Tester', pbs: 'Barisal PBS', office: 'Barisal Sadar Office', ownDistrict: 'Barisal', mobileNumber: '01619012345', joiningDate: new Date('2017-08-30'), transferChoice1: 'Dhaka PBS-2' },
  { fullName: 'Nasrin Jahan Mitu', post: 'Meter Testing Supervisor', pbs: 'Rangpur PBS', office: 'Rangpur City Office', ownDistrict: 'Rangpur', mobileNumber: '01390123456', whatsappNumber: '01390123456', joiningDate: new Date('2014-05-12'), transferChoice1: 'Dhaka PBS-1', transferChoice2: 'Mymensingh PBS' },
];

async function seed() {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected. Seeding…');
  for (const s of SAMPLES) {
    await TesterProfile.findOneAndUpdate({ mobileNumber: s.mobileNumber }, s, { upsert: true, new: true });
  }
  console.log('Seeded 10 sample TesterProfile records.');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
