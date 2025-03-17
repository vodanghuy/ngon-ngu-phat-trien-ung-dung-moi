const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

let Student = function (id, mssv, hoTen, lop) {
  (this.id = id), (this.mssv = mssv), (this.hoTen = hoTen), (this.lop = lop);
};
let students = [];
students.push(new Student(1, "2180608852", "Dang Huy", "21DTHD5"));

app.get("/", (req, res) => {
  res.send(students);
});

function getMax() {
  let ids = students.map((p) => Number.parseInt(p.id));
  return Math.max(...ids);
}

function GenString(length, key) {
  let result = "";
  let source = "";
  if (key == "id") {
    source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
    for (let index = 0; index < length; index++) {
      let rd = Math.floor(Math.random() * source.length);
      result += source.charAt(rd);
    }
  } else {
    source = "0123456789";
    for (let index = 0; index < length; index++) {
      let rd = Math.floor(Math.random() * source.length);
      result += source.charAt(rd);
    }
  }
  return result;
}
app.post("/", (req, res) => {
  console.log(req.body);
  let newObj = {
    id: GenString(16, "id"),
    mssv: GenString(11, "mssv"),
    hoTen: req.body.hoTen,
    lop: req.body.lop,
  };
  students.push(newObj);
  res.send(newObj);
});
app.put("/:id", (req, res) => {
  let id = req.params.id;
  let student = students.find((p) => p.id == id);
  let body = req.body;
  if (student) {
    //update
    if (body.hoTen) {
      student.hoTen = body.hoTen;
    }
    if (body.lop) {
      student.lop = body.lop;
    }
    if (Object.keys(body).length == 0) {
      student.isDeleted = true;
    }
    res.send(student);
  } else {
    res.status(404).send({
      message: "khong tim thay id",
    });
  }
});

// app.put('/:id', (req, res) => {
//     let id = req.params.id;
//     let student = students.find(p=>p.id==id);
//     if(student){
//         //update
//         student.isDeleted= true;
//         res.send(student);
//     }else{
//         res.status(404).send({
//             message:"khong tim thay id"
//         })
//     }
// })

app.get("/:id", (req, res) => {
  let id = req.params.id;
  let student = students.find((p) => p.id == id);
  if (student) {
    res.status(200).send(student);
  } else {
    res.status(404).send({
      message: "khong tim thay id",
    });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
