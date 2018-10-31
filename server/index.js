const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(express.static('build'));

const io = require('socket.io')(app.listen(PORT, ()=>console.log(`listening on port: ${PORT}`)));

app.get('/api/health-check', (req,res)=>{
    res.sendStatus(200);
})

io.on('connection', socket=>{
    console.log(`socket connected: ${socket.id}`)
    socket.on("general-chat", data=>{
        io.sockets.emit("general-message", data)
    })

    socket.on("join-admin", ()=>{
        socket.join("admin")
    })

    socket.on("admin-chat", data=>{
        io.to("admin").emit("admin-message", data);
    })
})

io.on('disconnect', socket=>{
    console.log(`socket left: ${socket.id}`)
})