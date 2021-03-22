const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static(__dirname+'/source'))
app.use(express.static(__dirname+'/gltf'))

app.all('/*' , (req, res, next) => {
    res.header("Access-Control-Allow-Origin" , "*")
    res.header("Access-Control-Allow-Headers","X-Requested-With")
    next()
})

app.get('/map' , (req , res ) => {
    res.sendFile(__dirname + '/Map.html')
})

app.get('/' , (req,res) => {
    res.sendFile(__dirname+'/ArcMap.html')
})

app.get('/3D' , (req, res) => {
    res.sendFile(__dirname+'/3D.html')
})

app.listen(3000, () => {
    console.log(`server start`)
})