export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guard'|'admin';
}

export interface Permit {
  permitId: string;
  type: 'permanent'|'temporary'|'banned';
  vehicle: { plate: string; model?: string; color?: string; photoUrl?: string };
  owner?: { name?: string; phone?: string };
  validFrom?: string | null;
  validTo?: string | null;
}

export interface ScanEvent {
  scanId?: string;
  permitId: string;
  guardId: string;
  action: 'allow'|'deny';
  reason?: string;
  direction: 'in'|'out';
  timestamp: string;
}
