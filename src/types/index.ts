export interface TesterProfile {
  _id: string;
  profilePic?: string;
  fullName: string;
  post: 'Meter Tester' | 'Officer (Meter Testing)';
  pbs: string;
  office: string;
  ownDistrict: string;
  transferChoice1?: string;
  transferChoice2?: string;
  transferChoice3?: string;
  mobileNumber: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  joiningDate: string;
  isDeleted?: boolean;
  isLocked?: boolean;
  editLimit?: number;
  seniority?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MutualTransferRow {
  _id: string;
  name: string;
  mobileNumber: string;
  post: string;
  ownDistrict: string;
  workingPbs: string;
  mutualPossiblePbs: string;
  createdAt?: string;
}

export interface UpdateRequest {
  _id: string;
  testerId: TesterProfile | string;
  mobileNumber?: string;
  deviceId?: string;
  proposedChanges: Partial<TesterProfile>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface AuthPayload {
  userId?: string;
  mobileNumber?: string;
  role: 'user' | 'admin';
}

export interface SyncDelta {
  updated: TesterProfile[];
  deleted: string[];
}