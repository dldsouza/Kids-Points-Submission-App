
export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface SyncSettings {
  googleSheetUrl: string;
  lastSynced: number | null;
  familyId: string;
}

export interface Chore {
  id: string;
  title: string;
  points: number;
  icon: string;
  category: string;
}

export interface Transaction {
  id: string;
  kidId: string;
  description: string;
  amount: number;
  timestamp: number;
  type: 'gain' | 'loss';
}

export interface PurchaseRequest {
  id: string;
  kidId: string;
  itemName: string;
  pointCost: number;
  status: RequestStatus;
  timestamp: number;
  imageUrl?: string;
}

export interface Kid {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
}
