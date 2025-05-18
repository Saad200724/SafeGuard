import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  users,
  children,
  activities,
  blockedSites,
  deviceSettings,
  type User,
  type InsertUser,
  type Child,
  type InsertChild,
  type Activity,
  type InsertActivity,
  type BlockedSite,
  type InsertBlockedSite,
  type DeviceSettings,
  type InsertDeviceSettings,
} from "@shared/schema";

// Firebase Initialization
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Child operations
  getChild(id: string): Promise<Child | undefined>;
  getAllChildren(): Promise<Child[]>;
  createChild(child: InsertChild): Promise<Child>;
  updateChild(id: string, data: Partial<InsertChild>): Promise<Child>;
  deleteChild(id: string): Promise<void>;

  // Activity operations
  getActivity(id: string): Promise<Activity | undefined>;
  getActivitiesByChildId(childId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Blocked site operations
  getBlockedSite(id: string): Promise<BlockedSite | undefined>;
  getBlockedSitesByChildId(childId: string): Promise<BlockedSite[]>;
  createBlockedSite(site: InsertBlockedSite): Promise<BlockedSite>;
  updateBlockedSite(
    id: string,
    data: Partial<InsertBlockedSite>
  ): Promise<BlockedSite>;
  deleteBlockedSite(id: string): Promise<void>;

  // Device settings operations
  getDeviceSettings(id: string): Promise<DeviceSettings | undefined>;
  getDeviceSettingsByChildId(
    childId: string
  ): Promise<DeviceSettings | undefined>;
  createDeviceSettings(settings: InsertDeviceSettings): Promise<DeviceSettings>;
  updateDeviceSettings(
    id: string,
    data: Partial<InsertDeviceSettings>
  ): Promise<DeviceSettings>;
}

export class FirebaseStorage implements IStorage {
  private usersCollection = collection(db, "users");
  private childrenCollection = collection(db, "children");
  private activitiesCollection = collection(db, "activities");
  private blockedSitesCollection = collection(db, "blockedSites");
  private deviceSettingsCollection = collection(db, "deviceSettings");

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const userDoc = await getDoc(doc(this.usersCollection, id));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const userQuery = query(
      this.usersCollection,
      where("username", "==", username)
    );
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as User;
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const userDocRef = doc(this.usersCollection);
    await setDoc(userDocRef, user);
    return { 
      ...user, 
      id: parseInt(userDocRef.id, 10),
      displayName: user.displayName || null
    }; // Return the created user with properly typed displayName
  }

  // Child operations
  async getChild(id: string): Promise<Child | undefined> {
    const childDoc = await getDoc(doc(this.childrenCollection, id));
    if (childDoc.exists()) {
      return childDoc.data() as Child;
    }
    return undefined;
  }

  async getAllChildren(): Promise<Child[]> {
    const querySnapshot = await getDocs(this.childrenCollection);
    return querySnapshot.docs.map((doc) => doc.data() as Child);
  }

  async createChild(child: InsertChild): Promise<Child> {
    const childDocRef = doc(this.childrenCollection);
    await setDoc(childDocRef, child);
    return { ...child, id: parseInt(childDocRef.id, 10) }; // Return the created child with id as number
  }

  async updateChild(id: string, data: Partial<InsertChild>): Promise<Child> {
    const childDocRef = doc(this.childrenCollection, id);
    await updateDoc(childDocRef, data);
    const updatedChildDoc = await getDoc(childDocRef);
    return updatedChildDoc.data() as Child;
  }

  async deleteChild(id: string): Promise<void> {
    const childDocRef = doc(this.childrenCollection, id);
    await deleteDoc(childDocRef);
  }

  // Activity operations
  async getActivity(id: string): Promise<Activity | undefined> {
    const activityDoc = await getDoc(doc(this.activitiesCollection, id));
    if (activityDoc.exists()) {
      return activityDoc.data() as Activity;
    }
    return undefined;
  }

  async getActivitiesByChildId(childId: string): Promise<Activity[]> {
    const activityQuery = query(
      this.activitiesCollection,
      where("childId", "==", childId)
    );
    const querySnapshot = await getDocs(activityQuery);
    return querySnapshot.docs.map((doc) => doc.data() as Activity);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const activityDocRef = doc(this.activitiesCollection);
    await setDoc(activityDocRef, activity);
    return { 
      ...activity, 
      id: parseInt(activityDocRef.id, 10),
      timestamp: new Date(),
      metadata: activity.metadata || null
    }; // Return the created activity with proper types
  }

  // Blocked site operations
  async getBlockedSite(id: string): Promise<BlockedSite | undefined> {
    const siteDoc = await getDoc(doc(this.blockedSitesCollection, id));
    if (siteDoc.exists()) {
      return siteDoc.data() as BlockedSite;
    }
    return undefined;
  }

  async getBlockedSitesByChildId(childId: string): Promise<BlockedSite[]> {
    const siteQuery = query(
      this.blockedSitesCollection,
      where("childId", "==", childId)
    );
    const querySnapshot = await getDocs(siteQuery);
    return querySnapshot.docs.map((doc) => doc.data() as BlockedSite);
  }

  async createBlockedSite(site: InsertBlockedSite): Promise<BlockedSite> {
    const siteDocRef = doc(this.blockedSitesCollection);
    await setDoc(siteDocRef, site);
    return { 
      ...site, 
      id: parseInt(siteDocRef.id, 10),
      isActive: site.isActive !== undefined ? site.isActive : true
    }; // Return the created site with id as number and proper isActive
  }

  async updateBlockedSite(
    id: string,
    data: Partial<InsertBlockedSite>
  ): Promise<BlockedSite> {
    const siteDocRef = doc(this.blockedSitesCollection, id);
    await updateDoc(siteDocRef, data);
    const updatedSiteDoc = await getDoc(siteDocRef);
    return updatedSiteDoc.data() as BlockedSite;
  }

  async deleteBlockedSite(id: string): Promise<void> {
    const siteDocRef = doc(this.blockedSitesCollection, id);
    await deleteDoc(siteDocRef);
  }

  // Device settings operations
  async getDeviceSettings(id: string): Promise<DeviceSettings | undefined> {
    const settingsDoc = await getDoc(doc(this.deviceSettingsCollection, id));
    if (settingsDoc.exists()) {
      return settingsDoc.data() as DeviceSettings;
    }
    return undefined;
  }

  async getDeviceSettingsByChildId(
    childId: string
  ): Promise<DeviceSettings | undefined> {
    const settingsQuery = query(
      this.deviceSettingsCollection,
      where("childId", "==", childId)
    );
    const querySnapshot = await getDocs(settingsQuery);
    if (!querySnapshot.empty) {
      const settingsDoc = querySnapshot.docs[0];
      return settingsDoc.data() as DeviceSettings;
    }
    return undefined;
  }

  async createDeviceSettings(
    settings: InsertDeviceSettings
  ): Promise<DeviceSettings> {
    const settingsDocRef = doc(this.deviceSettingsCollection);
    await setDoc(settingsDocRef, settings);
    return { 
      ...settings, 
      id: parseInt(settingsDocRef.id, 10),
      internetAccess: settings.internetAccess !== undefined ? settings.internetAccess : true,
      appInstallation: settings.appInstallation !== undefined ? settings.appInstallation : false,
      screenTimeBonus: settings.screenTimeBonus !== undefined ? settings.screenTimeBonus : false
    }; // Return the created settings with id as number and proper boolean defaults
  }

  async updateDeviceSettings(
    id: string,
    data: Partial<InsertDeviceSettings>
  ): Promise<DeviceSettings> {
    const settingsDocRef = doc(this.deviceSettingsCollection, id);
    await updateDoc(settingsDocRef, data);
    const updatedSettingsDoc = await getDoc(settingsDocRef);
    return updatedSettingsDoc.data() as DeviceSettings;
  }
}

export const storage = new FirebaseStorage();
