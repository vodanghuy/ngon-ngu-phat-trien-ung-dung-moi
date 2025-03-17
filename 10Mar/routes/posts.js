/// CRUD
app.post('/', (req,res) => {
    console.log(req,res);
    let newObj = {
      id: GenString(16),
      title: req.body.title,
      views: req.body.views
    }
    posts.push(newObj);
    res.send(newObj);
  })

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