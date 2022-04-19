const express=require('express')
const app=express()
const PORT=5000
const mongoose=require('mongoose')
//tGceac4SldEXp54R
//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
const {MONGOURI}=require('./keys')



mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("Connection established with mongo fin")
})

mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})
require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


app.listen(PORT,()=>{
    console.log("Port is listening")
})