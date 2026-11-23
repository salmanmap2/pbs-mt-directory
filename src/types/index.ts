export interface TesterProfile {
  _id: string;
  profilePic?: string;
  fullName: string;
  post: 'Meter Tester' | 'Meter Testing Supervisor';
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
  createdAt?: string;
  updatedAt?: string;
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
