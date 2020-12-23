const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3030
const {MONGOURL} = require('./config/key')

mongoose.connect(MONGOURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log('connected to mongo yeah')
})
mongoose.connection.on('error',(error)=>{
    console.log('ERROR',error)
})

app.use(express.json())

require('./models/user')
require('./models/post')
app.use(require('./routers/auth'))
app.use(require('./routers/post'))
app.use(require('./routers/user'))

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})
