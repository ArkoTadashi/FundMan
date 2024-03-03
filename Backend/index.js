const { useEffect } = require('react');
const Express=require("express")
const MongoClient=require("mongodb").MongoClient
const cors=require("cors")
const multer=require("multer")
const SHA3 = require('crypto-js/sha3');
const { ObjectId } = require('mongodb');



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

// setInterval(async () => {
//     let tokens = []

//     database.collection('token')
//     .find() //cursor
//     .forEach(entry=>tokens.push(entry))  //toArray
//     .then(async ()=>{
//         console.log("123");
//         for (let entry of tokens) {
//             let address = entry.address;
//             let _res = await fetch(`https://api.coingecko.com/api/v3/coins/polygon-pos/contract/${address}`);
//             let res = await _res.json();

//             database.collection('market')
//             .updateOne(
//                 { "token":  entry.token},
//                 { $push: { "dailyPrice": res.market_data.current_price.usd } }
//             )
//             .then(result => {
//                 console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
//             })
//             .catch(error => {
//                 console.error('Error updating document:', error);
//             });
//             database.collection('market')
//             .updateOne(
//                 { "token":  entry.token},
//                 { $pop: { "dailyPrice": -1 } }
//             )
//             .then(result => {
//                 console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
//             })
//             .catch(error => {
//                 console.error('Error updating document:', error);
//             });
//             database.collection('market')
//             .updateOne(
//                 { "token":  entry.token},
//                 { $set: { "circulatingSupply": res.market_data.circulating_supply } }
//             )
//             .then(result => {
//                 console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
//             })
//             .catch(error => {
//                 console.error('Error updating document:', error);
//             });

//             await new Promise(resolve => setTimeout(resolve, 5000));
//         }
        
//     })
    
// }, 30000);

setInterval(async () => {
    var res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false&locale=en&x_cg_demo_api_key=CG-DXyth2fs4WGhHT5LZUu18m41`);
    var _res = await res.json();


    _res.forEach(obj => {
        database.collection('market')
        .updateOne(
            { "token":  obj.symbol},
            { $push: { "dailyPrice": obj.current_price } }
        )
        .then(result => {
            if(result.matchedCount)
                console.log(obj.symbol)
            console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
        })
        .catch(error => {
            console.error('Error updating document:', error);
        });

        database.collection('market')
        .updateOne(
            { "token":  obj.symbol},
            { $set: { "currentPrice": obj.current_price } }
        )
        .then(result => {
            if(result.matchedCount)
                console.log(obj.symbol)
            console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
        })
        .catch(error => {
            console.error('Error updating document:', error);
        });

        database.collection('market')
        .updateOne(
            { "token":  obj.symbol},
            { $pop: { "dailyPrice": -1 } }
        )
        .then(result => {
            console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
        })
        .catch(error => {
            console.error('Error updating document:', error);
        });

        database.collection('market')
        .updateOne(
            { "token":  obj.symbol},
            { $set: { "circulatingSupply": obj.circulating_supply } }
        )
        .then(result => {
            console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
        })
        .catch(error => {
            console.error('Error updating document:', error);
        });
    })

    

}, 360000);




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

//create asset group
app.patch('/holding/:userid',(req,res)=>{
    const entry=req.body //front theke json create korte hobe(tokens:[])

    database.collection('holding')
    .updateOne(
        { "userID": req.params.userid },
        { $push: { "assets": entry } }
    )
    .then(result => {
        res.status(200).json({success:"patched"})
        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
    })
    .catch(error => {
        console.error('Error updating document:', error);
    });
})

//add token
//create asset group
app.patch('/holding/:userid/group/:grpid',(req,res)=>{
    const upd=req.body //front theke json create korte hobe(tokens:[])
    const gid=req.params.grpid
    let result

    database.collection('holding')
        .findOne({ userID: req.params.userid })
        .then((entry) => {
            if (entry) {
                if (Array.isArray(entry.assets)) {
                    result = entry.assets.slice(gid, gid + 1);
                    console.log(result[0]);

                    //or update token
                    database.collection('holding')
                    .updateOne(
                        { "userID": req.params.userid, "assets.groupName": result[0].groupName},  // specify the document using both userID and asset name
                        { $push: { "assets.$.tokens": upd } }  // $ specifies the positional operator to update the correct array element
                    )
                    .then(result => {
                        res.status(200).json({success:"token added"})
                        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
                    })
                    .catch(error => {
                        console.error('Error updating document:', error);
                    });
                    /////////////////
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
})

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
    .find({},{projection: {token: 1, circulatingSupply: 1, currentPrice: 1}}) //cursor
    .forEach(entry=>holdings.push(entry))  //toArray
    .then(()=>{
        res.status(200).json(holdings)
    })  
    .catch(()=>{
        res.status(500).json({err:'Market collection fetching err'})
    })
})

app.get("/market/:token",(req,res)=>{

    database.collection('market')
    .findOne({token: req.params.token}, {projection: {currentPrice: 1, _id: 0}}) //cursor
    .then((entry)=>{
        console.log(entry)
        res.status(200).json(entry)
    })  
    .catch(()=>{
        res.status(500).json({err:'Market collection fetching err'})
    })
})

//monthly
app.get("/market/:token/monthly",(req,res)=>{

    database.collection('market')
    .findOne({token: req.params.token}, {projection: {monthlyPrice: 1, _id: 0}}) //cursor
    .then((entry)=>{
        console.log(entry)
        res.status(200).json(entry)
    })  
    .catch(()=>{
        res.status(500).json({err:'Market collection fetching err'})
    })
})

//yearly
app.get("/market/:token/yearly",(req,res)=>{

    database.collection('market')
    .findOne({token: req.params.token}, {projection: {yearlyPrice: 1, _id: 0}}) //cursor
    .then((entry)=>{
        console.log(entry)
        res.status(200).json(entry)
    })  
    .catch(()=>{
        res.status(500).json({err:'Market collection fetching err'})
    })
})

//daily
app.get("/market/:token/daily",(req,res)=>{

    database.collection('market')
    .findOne({token: req.params.token}, {projection: {dailyPrice: 1, _id: 0}}) //cursor
    .then((entry)=>{
        console.log(entry)
        res.status(200).json(entry)
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

            hdentry={
                userID:user._id.toString(),
                funds:[]
            }
            await database.collection('umanagement').insertOne(hdentry)


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

//login
app.post("/panelLogin",async (req, res) => {
    const entry = req.body;

    try {
        const existingUser = await database.collection('panel').findOne({ username: req.body.username });

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


app.get("/token/:tname",(req,res)=>{
    database.collection('token')
    .findOne({token: req.params.tname})  
    .then((entry)=>{
        res.status(200).json(entry)
    })  
    .catch(()=>{
        res.status(500).json({err:'Token fetching err'})
    })
})


//panel
app.get('/panel',(req,res)=>{
    let panel=[]
    database.collection('panel')
    .find()
    .forEach(entry=>panel.push(entry)) 
    .then(()=>{
        res.status(200).json(panel)
    })  
    .catch(()=>{
        res.status(500).json({err:'Panel collection fetching err'})
    })
})

app.get('/panel/:pname',(req,res)=>{
    database.collection('panel')
    .findOne({username : req.params.pname}) 
    .then((panel)=>{
        res.status(200).json(panel)
    })  
    .catch(()=>{
        res.status(500).json({err:'Panel collection fetching err'})
    })
})


app.get("/panel/id/:userid", async (req, res) => {
    try {
        const userId = req.params.userid;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const existingUser = await database.collection('panel').findOne({ '_id': new ObjectId(userId) },{projection:{username:1,name:1,manageCount:1,rating:1}});
        if (existingUser) {
            res.status(200).json(existingUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



//management
app.patch('/management/:pid',(req,res)=>{
    const entry=req.body //front theke json create korte hobe(tokens:[])
    console.log("mmmmmmmmm",entry)

    database.collection('management')
    .updateOne(
        { "panelID": req.params.pid },
        { $push: { "funds": entry } }
    )
    .then(result => {
        res.status(200).json({success:"patched"})
        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
    })
    .catch(error => {
        console.error('Error updating management:', error);
    });
})

app.get('/management/:pid',(req,res)=>{   
    database.collection('management')
    .findOne(
        { "panelID": req.params.pid }
    )
    .then(result => {
        res.status(200).json(result)
    })
    .catch(error => {
        console.error('Error fetching management:', error);
    });
})

//management
app.patch('/umanagement/:pid',(req,res)=>{
    const entry=req.body //front theke json create korte hobe(tokens:[])
    console.log("uuuuuuuuu",entry)

    database.collection('umanagement')
    .updateOne(
        { "userID": req.params.pid },
        { $push: { "funds": entry } }
    )
    .then(result => {
        res.status(200).json({success:"patched"})
        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);
    })
    .catch(error => {
        console.error('Error updating umanagement:', error);
    });
})

app.get('/umanagement/:pid',(req,res)=>{   
    database.collection('umanagement')
    .findOne(
        { "userID": req.params.pid }
    )
    .then(result => {
        res.status(200).json(result)
    })
    .catch(error => {
        console.error('Error fetching umanagement:', error);
    });
})

//fundraise request
//whole-admin
app.get('/fundraiserequest',(req,res)=>{
    let panel=[]
    database.collection('fundraiserequest')
    .find()
    .forEach(entry=>panel.push(entry)) 
    .then(()=>{
        res.status(200).json(panel)
    })  
    .catch(()=>{
        res.status(500).json({err:'Panel collection fetching err'})
    })
})

app.get('/fundraiserequest/count', (req, res) => {
    database.collection('fundraiserequest')
        .countDocuments()
        .then((count) => {
            res.status(200).json({ count: count });
        })
        .catch((error) => {
            console.error('Error fetching count:', error);
            res.status(500).json({ error: 'Error fetching count' });
        });
});

//patch status
app.patch('/fundraiserequest/:pid',(req,res)=>{
    const entry=req.body //front theke json create korte hobe(tokens:[])
    

    database.collection('fundraiserequest')
    .updateOne(
        { "_id":new ObjectId(req.params.pid) },
        { $set: { "status": entry.status } }
    )
    .then(result => {
        res.status(200).json({success:"patched"})
        })
    .catch(error => {
        console.error('Error updating fund raise req:', error);
    });
})


//user only
app.get('/fundraiserequest/:userid',(req,res)=>{
    let panel=[]
    database.collection('fundraiserequest')
    .find({"userID":req.params.userid})
    .forEach(entry=>panel.push(entry)) 
    .then(()=>{
        res.status(200).json(panel)
    })  
    .catch(()=>{
        res.status(500).json({err:'Panel collection fetching err'})
    })
})

app.post('/fundraiserequest', async (req, res) => {
    let entry = req.body;
    try {
        await database.collection('fundraiserequest').insertOne(entry);
        res.status(200).json({ success: true }); 
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Request making error' }); 
    }
});

//donar, all without doner
app.get('/fundraiserequestdonar/:uid', (req, res) => {
    let panel = [];
    database.collection('fundraiserequest')
        .find({ "status": "accepted" ,"userID": { $ne: req.params.uid } })
        .toArray() 
        .then(entries => {
            panel = entries;
            res.status(200).json(panel);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ err: 'Panel collection fetching err' });
        });
});

//one req
app.get('/fundraiserequest/donar/:id',(req,res)=>{
    database.collection('fundraiserequest')
    .findOne({ '_id': new ObjectId(req.params.id) })
    .then((result)=>{
        res.status(200).json(result)
    })  
    .catch(()=>{
        res.status(500).json({err:'Panel collection fetching err'})
    })
})

//pay
// app.patch('/fundraiserequest/donar/:id/pay', (req, res) => {
//     const entry = req.body;

//     database.collection('fundraiserequest')
//         .updateOne(
//             { "_id": new ObjectId(req.params.id) },
//             {
//                 $set: { "currentAmount": entry.currentAmount },
//                 $push: { "payee": { "payeeID": entry.payeeID, "amount": entry.amount } }
//             }
//         )
//         .then(result => {
//             res.status(200).json({ success: "patched" });
//         })
//         .catch(error => {
//             console.error('Error updating fund raise req:', error);
//             res.status(500).json({ success: 'Error updating fund raise req' });
//         });
// });

app.patch('/fundraiserequest/donar/:id/pay', (req, res) => {
    const entry = req.body;

    database.collection('fundraiserequest')
        .updateOne(
            { "_id": new ObjectId(req.params.id) },
            {
                 $set: { "currentAmount": entry.currentAmount }                
            }
        )
        .then(result => {
            res.status(200).json({ success: "patched" });
        })
        .catch(error => {
            console.error('Error updating fund raise req:', error);
            res.status(500).json({ success: 'Error updating fund raise req' });
        });
});

app.patch('/fundraiserequest/donar/:id/payee', async (req, res) => {
    const entry = req.body;

    try {
        const existing = await database.collection('fundraiserequest').findOne({"_id": new ObjectId(req.params.id)});

        if (existing) {
            //upd payment
            const existingPayment = existing.payee.find(p => p.payeeID === entry.payeeID);

            if (existingPayment) {
                await database.collection('fundraiserequest').updateOne(
                    { "_id": new ObjectId(req.params.id), "payee.payeeID":entry.payeeID },
                    { $inc: { "payee.$.amount": entry.amount } } // Increment the amount by newAmount
                );
            } 
            else{
            // Update the existing document
            await database.collection('fundraiserequest').updateOne(
                { "_id": new ObjectId(req.params.id) },
                { $push: { "payee": entry } }
            );
            }
            res.status(200).json({ success: "patched" });
        }
    } catch (error) {
        console.error('Error updating/inserting payee entry:', error);
        res.status(500).json({ error: 'Error updating/inserting payee entry' });
    }
});



app.patch('/fundraisepayee/:uid', async (req, res) => {
    const entry = req.body;

    try {
        const existingUser = await database.collection('fundraisepayee').findOne({ userID: req.params.uid });

        if (existingUser) {
            //upd payment
            const existingPayment = existingUser.payments.find(payment => payment.requestID === entry.requestID);

            if (existingPayment) {
                await database.collection('fundraisepayee').updateOne(
                    { "userID": req.params.uid, "payments.requestID":entry.requestID },
                    { $inc: { "payments.$.amount": entry.amount } } // Increment the amount by newAmount
                );
            } 
            else{
            // Update the existing document
            await database.collection('fundraisepayee').updateOne(
                { "userID": req.params.uid },
                { $push: { "payments": entry } }
            );
            }
        } else {
            // Insert a new document
            await database.collection('fundraisepayee').insertOne(
                { "userID": req.params.uid, "payments": [entry] }
            );
        }

        res.status(200).json({ success: "patched" });
    } catch (error) {
        console.error('Error updating/inserting payee entry:', error);
        res.status(500).json({ error: 'Error updating/inserting payee entry' });
    }
});

app.get('/fundraisepayee/:id',(req,res)=>{
    database.collection('fundraisepayee')
    .findOne({ 'userID': req.params.id })
    .then((result)=>{
        res.status(200).json(result)
    })  
    .catch(()=>{
        res.status(500).json({err:'Panel collection fetching err'})
    })
})

//update one user status
app.patch('/fundraisepayee/updatestatus/:uid/:reqId', async (req, res) => {
    const uid = req.params.uid;
    const reqId = req.params.reqId;
    const newStatus = req.body.status;

    try {
        const result = await database.collection('fundraisepayee').updateOne(
            { "userID": uid, "payments.requestID": reqId },
            { $set: { "payments.$.status": newStatus } }
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ success: "patched" });
        } else {
            res.status(404).json({ error: "No matching document found" });
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Error updating payment status' });
    }
});



//user
app.get("/user/:userid", async (req, res) => {
    try {
        const userId = req.params.userid;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        const existingUser = await database.collection('user').findOne({ '_id': new ObjectId(userId) },{projection:{username:1,name:1,email:1}});
        if (existingUser) {
            res.status(200).json(existingUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------



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
