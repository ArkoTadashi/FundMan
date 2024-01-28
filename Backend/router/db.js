const express=require('express')
const {MongoClient}=require('mongodb')

let connection_str="mongodb+srv://fundman:fundman123@fundman.axijm8u.mongodb.net/"

const DatabaseName="FundMan"

let database

module.exports={
    connectToDb:(cb) =>{
        MongoClient.connect(connection_str)
        .then((client)=>{
            database=client.db(DatabaseName)
            console.log("Connected to database")
            return cb()
        })
        .catch(err=>{
            console.log(err)
            return cb(err)
        })
    },
    getDb: ()=> database
}