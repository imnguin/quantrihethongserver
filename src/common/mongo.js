import mongodb from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectString = process.env.MONGO_URI ?? "";
const dbName = process.env.DBNAME_MONGO ?? "";

if (!connectString || !dbName) {
    console.warn('⚠️ Thiếu thông tin kết nối MongoDB! Kiểm tra biến môi trường MONGO_URI và DBNAME_MONGO.');
}

const MongoClient = mongodb.MongoClient;
let client = null;
let db = null;

const connect = async () => {
    if (client && client.topology && client.topology.isConnected()) {
        return;
    }
    try {
        client = await MongoClient.connect(connectString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 100,
            minPoolSize: 10,
        });
        db = client.db(dbName);
        console.log('✅ Đã kết nối MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};

const disConnect = async () => {
    try {
        if (client) {
            await client.close();
            client = null;
            db = null;
            console.log('🛑 Đã ngắt kết nối MongoDB');
        }
    } catch (error) {
        console.error('❌ MongoDB disconnect error:', error);
        throw error;
    }
};

const createdWithCollection = (collectionName) => {
    if (!db) {
        throw new Error('Database not initialized. Call connect before createdWithCollection.');
    }
    return db.collection(collectionName);
};

const get = async (collection, query = {}) => await collection.find(query).toArray();
const findOne = async (collection, query = {}) => await collection.findOne(query);

const insert = async (collection, object) => {
    if (Array.isArray(object)) {
        await collection.insertMany(object);
    } else {
        await collection.insertOne(object);
    }
};

const update = async (collection, object, filter, upsert = true) => {
    const newvalues = { $set: object };
    await collection.updateOne(filter, newvalues, { upsert });
};

const deleted = async (collection, filter) => await collection.deleteOne(filter);
const deleteMany = async (collection, filter) => await collection.deleteMany(filter);

const withMongo = async (collectionName, callback, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await connect();
            const collection = createdWithCollection(collectionName);
            const result = await callback(collection);
            return result;
        } catch (error) {
            console.error(`Attempt ${attempt}/${retries} failed for ${collectionName}:`, error);
            if (attempt === retries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        }
    }
};

process.on('SIGINT', async () => {
    await disConnect();
    process.exit(0);
});

export const MongoData = {
    connect,
    disConnect,
    createdWithCollection,
    get,
    findOne,
    insert,
    update,
    deleted,
    withMongo,
    deleteMany
};