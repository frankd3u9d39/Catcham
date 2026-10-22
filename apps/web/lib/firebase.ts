/**
 * Firebase Firestore Client & Integration for CATCHAM
 * Connected to Firebase project: catcham-app
 */

export const firebaseConfig = {
  apiKey: "AIzaSyCKvV5k1O6p7-nLLZSvJp6ANslv7Da_aOk",
  authDomain: "catcham-app.firebaseapp.com",
  projectId: "catcham-app",
  storageBucket: "catcham-app.firebasestorage.app",
  messagingSenderId: "364589352951",
  appId: "1:364589352951:web:24dbe08c958b1eb28250f2",
  measurementId: "G-QQ0SR4WQKB"
};

const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

export interface FirestoreReport {
  id?: string;
  referenceNumber: string;
  trackingCode: string;
  title: string;
  category: string;
  narrative?: string;
  assignedAgency: string;
  state: string;
  status: string;
  priority: string;
  isAnonymous?: boolean;
  contactEmail?: string;
  submittedAt: string;
  updatedAt: string;
  timeline?: Array<{ action: string; description: string; at: string }>;
}

export interface CredicorpApplication {
  id?: string;
  applicationRef: string;
  applicantName: string;
  email: string;
  phone: string;
  nin: string;
  category: string;
  institutionOrOrg?: string;
  preferredDevice: string;
  deviceModelSelected: string;
  repaymentPlan: string;
  state: string;
  lga?: string;
  status: string;
  appliedAt: string;
}

export interface FirestoreUser {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
}

function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      fields[key] = { integerValue: value.toString() };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map((v) =>
            typeof v === 'object'
              ? { mapValue: { fields: toFirestoreFields(v) } }
              : { stringValue: String(v) }
          ),
        },
      };
    } else if (typeof value === 'object') {
      fields[key] = { mapValue: { fields: toFirestoreFields(value) } };
    }
  }
  return fields;
}

function fromFirestoreFields(fields: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.integerValue !== undefined) result[key] = Number(val.integerValue);
    else if (val.booleanValue !== undefined) result[key] = val.booleanValue;
    else if (val.timestampValue !== undefined) result[key] = val.timestampValue;
    else if (val.arrayValue?.values) {
      result[key] = val.arrayValue.values.map((v: any) =>
        v.mapValue ? fromFirestoreFields(v.mapValue.fields) : v.stringValue
      );
    } else if (val.mapValue?.fields) {
      result[key] = fromFirestoreFields(val.mapValue.fields);
    }
  }
  return result;
}

export const firestoreService = {
  /**
   * Save a report directly into Firestore
   */
  async saveReport(report: FirestoreReport): Promise<{ success: boolean; firestoreId?: string }> {
    try {
      const response = await fetch(`${FIRESTORE_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: toFirestoreFields(report),
        }),
      });

      if (!response.ok) {
        throw new Error(`Firestore error: ${response.statusText}`);
      }

      const data = await response.json();
      const firestoreId = data.name?.split('/').pop();
      return { success: true, firestoreId };
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
      return { success: false };
    }
  },

  /**
   * Fetch all reports from Firestore
   */
  async getReports(): Promise<FirestoreReport[]> {
    try {
      const response = await fetch(`${FIRESTORE_BASE_URL}/reports`);
      if (!response.ok) return [];
      const data = await response.json();
      if (!data.documents) return [];

      return data.documents.map((doc: any) => {
        const id = doc.name?.split('/').pop();
        const parsed = fromFirestoreFields(doc.fields || {});
        return { id, ...parsed } as FirestoreReport;
      });
    } catch (err) {
      console.error('Failed to fetch from Firestore:', err);
      return [];
    }
  },

  /**
   * Look up report by Reference Number
   */
  async getReportByReference(refNumber: string): Promise<FirestoreReport | null> {
    try {
      const all = await this.getReports();
      return all.find((r) => r.referenceNumber?.toUpperCase() === refNumber.trim().toUpperCase()) || null;
    } catch (err) {
      console.error('Failed to query report by reference:', err);
      return null;
    }
  },

  /**
   * Save a CREDICORP C.L.I.C.K.D Expression of Interest / Device Credit Application
   */
  async saveCredicorpApplication(app: CredicorpApplication): Promise<{ success: boolean; firestoreId?: string }> {
    try {
      const response = await fetch(`${FIRESTORE_BASE_URL}/credicorp_applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: toFirestoreFields(app),
        }),
      });

      if (!response.ok) {
        throw new Error(`Firestore error: ${response.statusText}`);
      }

      const data = await response.json();
      const firestoreId = data.name?.split('/').pop();
      return { success: true, firestoreId };
    } catch (err) {
      console.error('Failed to save Credicorp application to Firestore:', err);
      return { success: false };
    }
  },

  /**
   * Fetch CREDICORP applications from Firestore
   */
  async getCredicorpApplications(): Promise<CredicorpApplication[]> {
    try {
      const response = await fetch(`${FIRESTORE_BASE_URL}/credicorp_applications`);
      if (!response.ok) return [];
      const data = await response.json();
      if (!data.documents) return [];

      return data.documents.map((doc: any) => {
        const id = doc.name?.split('/').pop();
        const parsed = fromFirestoreFields(doc.fields || {});
        return { id, ...parsed } as CredicorpApplication;
      });
    } catch (err) {
      console.error('Failed to fetch Credicorp applications from Firestore:', err);
      return [];
    }
  },

  /**
   * Save / register a citizen user directly in Firestore
   */
  async saveUser(userData: {
    fullName: string;
    email: string;
    phoneNumber?: string;
  }): Promise<{ success: boolean; firestoreId?: string }> {
    try {
      const response = await fetch(`${FIRESTORE_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: toFirestoreFields({
            fullName: userData.fullName,
            email: userData.email.toLowerCase().trim(),
            phoneNumber: userData.phoneNumber || '',
            role: 'CITIZEN',
            createdAt: new Date().toISOString(),
          }),
        }),
      });

      const data = await response.json().catch(() => ({}));
      const firestoreId = data.name?.split('/').pop();
      return { success: response.ok, firestoreId };
    } catch (err) {
      console.warn('Firestore saveUser warning:', err);
      return { success: false };
    }
  },

  /**
   * Get user by email from Firestore
   */
  async getUserByEmail(email: string): Promise<FirestoreUser | null> {
    try {
      const response = await fetch(`${FIRESTORE_BASE_URL}/users`);
      if (!response.ok) return null;
      const data = await response.json();
      if (!data.documents) return null;

      const users: FirestoreUser[] = data.documents.map((doc: any) => {
        const id = doc.name?.split('/').pop();
        const parsed = fromFirestoreFields(doc.fields || {});
        return { id, ...parsed } as FirestoreUser;
      });

      return users.find((u) => u.email?.toLowerCase() === email.toLowerCase().trim()) || null;
    } catch {
      return null;
    }
  },
};
