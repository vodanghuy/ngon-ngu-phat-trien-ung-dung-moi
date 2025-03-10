const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

let posts = [
    {
      "id": "1",
      "title": "a title",
      "views": 100
    },
    {
      "id": "2",
      "title": "another title",
      "views": 200,
      "isDeleted": true
    },
    {
      "id": "4",
      "title": "heeheh",
      "views": 500
    }]

app.get('/', (req, res) => {
  res.send(posts)
})

function getMax(){
    let ids = posts.map(p=>Number.parseInt(p.id));
    return Math.max(...ids);
}

function GenString(length){
    let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let index = 0; index < length; index++) {
       let rd = Math.floor(Math.random()*source.length);
       result+=source.charAt(rd);
    }
    return result;
}

app.post('/', (req, res) => {
    console.log(req.body);
    let newObj = {
        id: GenString(16),
        title:req.body.title,
        views:req.body.views
    }
    posts.push(newObj);
    res.send(newObj);
})
app.put('/:id', (req, res) => {
    let id = req.params.id;
    let post = posts.find(p=>p.id==id);
    let body = req.body;
    if(post){
        //update
        if(body.title){
            post.title=body.title;
        }
        if(body.views){
            post.views=body.views;
        }
        res.send(post);
    }else{
        res.status(404).send({
            message:"khong tim thay id"
        })
    }
})
app.put('/:id', (req, res) => {
    let id = req.params.id;
    let post = posts.find(p=>p.id==id);
    if(post){
        //update
        post.isDeleted= true;
        res.send(post);
    }else{
        res.status(404).send({
            message:"khong tim thay id"
        })
    }
})


app.get('/:idhehe', (req, res) => {
    let id = req.params.idhehe;
    let post = posts.find(p=>p.id==id);
    if(post){
        res.status(200).send(post)
    }else{
        res.status(404).send({
            message:"khong tim thay id"
        })
    }
    
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})