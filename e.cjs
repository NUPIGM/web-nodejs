const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017"; // 你的MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Connected successfully to server");
    // 在这里执行CRUD操作
    const collection = client.db("mydatabase").collection("users");
    collection.insertOne({ name: "John", age: 30 }, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Document inserted successfully");
    });
    client.close();
});