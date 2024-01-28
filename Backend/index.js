const Express=require("express")
const MongoClient=require("mongodb").MongoClient
const cors=require("cors")
const multer=require("multer")

const {ObjectId}=require('mongodb')

const app=Express()
app.use(cors())
app.use(Express.json())


const backendPort=9000

const {connectToDb,getDb} = require('./router/db')
let database

connectToDb((err)=>{
    if(!err){
        app.listen(backendPort,()=>{
            console.log("Listenning on "+backendPort)   
        })
        database=getDb()
    }
})


app.get("/",(req,res)=>{
    res.send("welcome")
})

//complete holding
app.get("/holdings",(req,res)=>{
    let holdings=[]

    database.collection('holding')
    .find() //cursor
    .forEach(entry=>holdings.push(entry))  
    .then(()=>{
        res.status(200).json(holdings)
    })  
    .catch(()=>{
        res.status(500).json({err:'Holding collection fetching err'})
    })     
})

//single object:objectid
// app.get("/holdings/:id",(req,res)=>{

//     database.collection('holding')
//     .findOne({_id: ObjectId(req.params.id)}) //cursor 
//     .then(entry=>{
//         res.status(200).json(entry)
//     })  
//     .catch(()=>{
//         res.status(500).json({err:'Holding single collection fetching err'})
//     })     
// })

//single user:objectid
app.get("/holdings/:userid",(req,res)=>{
    database.collection('holding')
    .findOne({userID: req.params.userid}) //cursor 
    .then((entry)=>{
        res.status(200).json(entry)
    })  
    .catch(()=>{
        res.status(500).json({err:'Holding single collection fetching err'})
    })     
})

//single object:objectid
// app.get("/holdings/:userid/:grpname",(req,res)=>{
//     database.collection('holding')
//     .findOne({userID: req.params.userid, groupName: req.params.grpname}) //cursor 
//     .then((entry)=>{
//         res.status(200).json(entry)
//     })  
//     .catch(()=>{
//         res.status(500).json({err:'Holding single collection fetching err'})
//     })     
// })

app.post('/holdings',(req,res)=>{
    const entry=req.body
    database.collection('holding')
    .insertOne(entry)
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        res.status(200).json({err: 'Insert err'})
    })
    
})


app.get("/market",(req,res)=>{
    let holdings=[]

    database.collection('market')
    .find() //cursor
    .forEach(entry=>holdings.push(entry))  
    .then(()=>{
        res.status(200).json(holdings)
    })  
    .catch(()=>{
        res.status(500).json({err:'Market collection fetching err'})
    })
})