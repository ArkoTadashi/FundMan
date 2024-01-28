const Express=require("express")
const MongoClient=require("mongodb").MongoClient
const cors=require("cors")
const multer=require("multer")
const SHA3 = require('crypto-js/sha3');



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


//single user's holding
app.get("/holding/:userid",(req,res)=>{
    database.collection('holding')
    .findOne({userID: req.params.userid}) //cursor 
    .then((entry)=>{
        res.status(200).json(entry)
    })  
    .catch(()=>{
        res.status(500).json({err:'Holding single collection fetching err'})
    })     
})

//db.holding.find({userID: "1"}, {assets: {$slice:[2,1]}})
app.get("/holding/:userid/group/:grpid", (req, res) => {
    const gid = req.params.grpid;

    database.collection('holding')
        .findOne({ userID: req.params.userid })
        .then((entry) => {
            if (entry) {
                if (Array.isArray(entry.assets)) {
                    const result = entry.assets.slice(gid, gid + 1);
                    res.status(200).json(result[0]);
                } else {
                    res.status(404).json({ err: 'Assets not found in the entry' });
                }
            } else {
                res.status(404).json({ err: 'Holding not found' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ err: 'Holding single grp fetching err' });
        });
});

//tokens
app.get("/holding/:userid/group/:grpid/token/:tid", (req, res) => {
    const gid = req.params.grpid;
    const tid=req.params.tid;
    database.collection('holding')
        .findOne({ userID: req.params.userid })
        .then((entry) => {
            if (entry) {
                if (Array.isArray(entry.assets)) {
                    const result = entry.assets.slice(gid, gid + 1);
                    if(Array.isArray(result[0].tokens)){    
                        res.status(200).json(result[0].tokens[tid]);
                    }
                    else{
                        res.status(404).json({ err: 'Tokens not found in the entry' });
                    }
                } else {
                    res.status(404).json({ err: 'Assets not found in the entry' });
                }
            } else {
                res.status(404).json({ err: 'Holding not found' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ err: 'Holding single grp fetching err' });
        });
});


app.post('/holding',(req,res)=>{
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

//signup
app.post("/signup",async (req, res) => {
    const entry = req.body;

    try {
        const existingUser = await database.collection('user').findOne({ username: req.body.username });

        if (existingUser) {
            res.status(400).json({ err: 'Username already exists' });
        } else if (!req.body.password) {
            res.status(400).json({ err: 'Must provide a password' });
        } else {    
            entry.password = SHA3(entry.password, { outputLength: 256 }).toString();
            // console.log('SHA-3 Hash:', entry.password);
            await database.collection('user')
                .insertOne(entry);
            let user=await database.collection('user').findOne({ username: req.body.username },{_id: 1});
            let hdentry={
                userID:user._id.toString(),
                assets:[]
            }
            await database.collection('holding').insertOne(hdentry)
            res.status(200).json({ success: true, userId:user._id.toString() });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Signup error' });
    }
})


//login
app.post("/login",async (req, res) => {
    const entry = req.body;

    try {
        const existingUser = await database.collection('user').findOne({ username: req.body.username });

        if (existingUser) {
            const sha3=SHA3(req.body.password, { outputLength: 256 }).toString()
            if(existingUser.password==sha3){
                //send uid to front
                console.log(existingUser)
                res.status(200).json(existingUser);
            }
            else{
                res.status(400).json({err: "Incorrect pass"});
            }
        } else {            
            res.status(400).json({ err: "User does not exist" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Signup error' });
    }
})

//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//check user debug
app.get("/user/:userid", async (req, res) => {
    try {
        // Use ObjectId to convert the userid parameter to a proper ObjectId
        const existingUser = await database.collection('user').findOne({ userId: req.params.userid });
        
        if (existingUser) {
            res.status(200).json(existingUser);
        } else {
            // If no user is found with the specified ID, return a 404 status
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//single object:objectid
// app.get("/holding/:userid/:grpname",(req,res)=>{
//     database.collection('holding')
//     .findOne({userID: req.params.userid, groupName: req.params.grpname}) //cursor 
//     .then((entry)=>{
//         res.status(200).json(entry)
//     })  
//     .catch(()=>{
//         res.status(500).json({err:'Holding single collection fetching err'})
//     })     
// })

//complete holding debug
app.get("/holding",(req,res)=>{
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
