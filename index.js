const Express=require("express")
const MongoClient=require("mongodb").MongoClient
const cors=require("cors")
const multer=require("multer")

let app=Express()
app.use(cors())

let connection_str="mongodb+srv://fundman:fundman123@fundman.axijm8u.mongodb.net/"

const DatabaseName="FundMan"
let database
const backendPort=9000

app.listen(backendPort,()=>{
    MongoClient.connect(connection_str,(error,client)=>{
        database=client.db(DatabaseName)
        console.log("Connection to database successful")
    })
})