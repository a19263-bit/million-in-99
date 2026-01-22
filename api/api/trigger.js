const webPush = require('web-push');
const { MongoClient } = require("mongodb");

// إعدادات قاعدة البيانات والمفاتيح
const uri = "mongodb+srv://Admin:Admin2026@cluster0.rno4b1y.mongodb.net/?appName=Cluster0";
const publicVapidKey = 'BIIvyUEjY--Hhmg8QR5Q5KgfDVgU7Z-vIDZBEMqJ_EePty0Nd_RgKjB_PIZPL8016LjL4w9vtyqFWB3txudHr4k';
const privateVapidKey = 'TP0PWEyCcgwLrg9k1FwEepl0SCpapLwO8QlgwJc5g1g';

webPush.setVapidDetails(
  'mailto:admin@example.com',
  publicVapidKey,
  privateVapidKey
);

const client = new MongoClient(uri);

export default async function handler(req, res) {
  // هنا نتصل بقاعدة البيانات ونسحب جميع المشتركين
  try {
    await client.connect();
    const database = client.db("million_app");
    const collection = database.collection("subscribers");
    
    // جلب القائمة
    const subscribers = await collection.find({}).toArray();

    // رسالة الإشعار
    const payload = JSON.stringify({
      title: 'تذكير المليون! 💰',
      body: 'اليوم هو الموعد (15 أو 30)! هل راجعت أهدافك المالية؟'
    });

    // إرسال للجميع
    console.log(`Sending to ${subscribers.length} people...`);
    
    const promises = subscribers.map(sub => 
      webPush.sendNotification(sub, payload).catch(err => console.error("فشل الإرسال لشخص واحد", err))
    );

    await Promise.all(promises);

    res.status(200).json({ message: `تم إرسال الإشعارات بنجاح إلى ${subscribers.length} مشترك.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
} 
