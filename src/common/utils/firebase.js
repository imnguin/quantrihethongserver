import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";

// Cấu hình Firebase (thay bằng config của bạn)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Hàm lắng nghe dữ liệu tại một path
export const listenValue = (path, callback) => {
    const dbRef = ref(db, path);
    onValue(dbRef, (snapshot) => {
        callback(snapshot.val());
    });
};

// Hàm lắng nghe khi có child mới thêm vào
export const listenChildAdded = (path, callback) => {
    const dbRef = ref(db, path);
    onChildAdded(dbRef, (snapshot) => {
        callback(snapshot.key, snapshot.val());
    });
};

// Hàm lắng nghe khi có child bị thay đổi
export const listenChildChanged = (path, callback) => {
    const dbRef = ref(db, path);
    onChildChanged(dbRef, (snapshot) => {
        callback(snapshot.key, snapshot.val());
    });
};

// Hàm lắng nghe khi có child bị xóa
export const listenChildRemoved = (path, callback) => {
    const dbRef = ref(db, path);
    onChildRemoved(dbRef, (snapshot) => {
        callback(snapshot.key, snapshot.val());
    });
};