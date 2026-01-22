const { MongoClient } = require("mongodb");

// الرابط الذي استخرجناه بشق الأنفس
const uri = "mongodb+srv://Admin:Admin2026@cluster0.rno4b1y.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const subscription = req.body; // بيانات المشترك القادمة من المتصفح

    try {
      await client.connect();
      const database = client.db("million_app"); // اسم قاعدة البيانات
      const collection = database.collection("subscribers");

      // حفظ الاشتراك في قاعدة البيانات
      // نستخدم updateOne مع upsert لمنع تكرار نفس الشخص
      await collection.updateOne(
        { endpoint: subscription.endpoint },
        { $set: subscription },
        { upsert: true }
      );

      res.status(201).json({ message: "تم الاشتراك بنجاح!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "حدث خطأ أثناء الحفظ" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
