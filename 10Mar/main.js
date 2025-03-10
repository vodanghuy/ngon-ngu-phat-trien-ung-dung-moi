const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
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
    "views": "5000"
  },
  {
    "id": "5",
    "title": "tung",
    "views": "9123",
    "isDeleted": true
  }
]
app.get('/', (req, res) => {
  res.send(posts);
})
app.post('/', (req,res) => {
  console.log(req,res);
  let newObj = {
    id: getMax()+1,
    title: req.body.title,
    views: req.body.views
  }
  posts.push(newObj);
  res.send(newObj);
})
function GenString()
{

}
function getMax(){
  let ids = posts.map(p=>Number.parseInt(p.id));
  return Math.max(...ids);
}
app.get('/:id', (req, res) => {
  let id =req.params.id;
  let post = posts.find(i=>i.id==id)
  //Hàm send không cần định nghĩa kiểu dữ liệu (khác với hàm end)
  if(post)
  {
    res.status(200).send(post);
  }
  else
  {
    res.status(404).send("Không tìm thấy ID")
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})