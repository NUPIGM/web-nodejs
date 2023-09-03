//增、删、改、查
import { MongoClient } from "mongodb";//VBcuXjIBazO1iowi
// const uri = "mongodb+srv://1633023423:5BfQUstnBX8vKumr@cluster0.5xzixyj.mongodb.net/?retryWrites=true&w=majority";
function dbCollection(params) {
  
}
const uri ="mongodb+srv://1633023423:VBcuXjIBazO1iowi@cluster0.0rhlwxe.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);
const collection = client.db("test").collection("test");
/*
client.connect().then(()=>{
  client.db("database_name").dropDatabase().then(()=>{
    console.log("dropped");
client.close()
})
*/

// collection.find({ age: 30 }, { name: "john" }).toArray().then(documents => console.log(documents)).then(() => client.close()).catch(err => console.error(err));
// collection.insertOne({ name: "John", age: 30 }).then(result => console.log("Document inserted", result)).then(() => client.close()).catch(err => { console.error(err); });
// collection.deleteOne({ name: "lihua" }).then(result =>   console.log("Document deleted")).then(() => client.close()).catch(err => console.error(err));
// collection.updateOne({ name: "kangkang" }, { $set: { age: 31, class: "hight school" } }).then(result => console.log("Document updated")).then(() => client.close()).catch(err => console.error(err));


export {client}