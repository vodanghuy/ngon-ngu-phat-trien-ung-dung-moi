const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
let posts = require('./data/posts')

app.get('/', (req, res) => {
  res.send(posts);
})

function GenString(length) {
  let result = "";
  let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
    for (let index = 0; index < length; index++) {
      let rd = Math.floor(Math.random() * source.length);
      result += source.charAt(rd);
    }
  return result;
}
function getMax(){
  let ids = posts.map(p=>Number.parseInt(p.id));
  return Math.max(...ids);
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})