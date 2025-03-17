let URL = "http://localhost:3000/posts"; //Lấy URL để lấy dữ liệu từ CSDL
var global;
LoadSync();
function Load() {
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function LoadSync() {
  try {
    let response = await fetch(URL);
    let posts = await response.json();
    global = posts;
    let body = document.getElementById("tbody");
    body.innerHTML=""; //Làm sạch bảng trước khi lấy dữ liệu mới sau khi thêm dữ liệu
    for(const post of posts)
    {
        body.innerHTML+=ConvertFromObjToHTML(post);
    }
  } catch (error) {
    console.log(error);
  }
}

function ConvertFromObjToHTML(post){
    let string = '<tr>';
    string+=`<td>${post.id}</td>`;
    string+=`<td>${post.author}</td>`;
    string+=`<td>${post.date}</td>`;
    string+=`<button onclick="Delete(${post.id}); return false">Delete</button>`;
    string += '</tr>';
    return string;
}
function Save()
{
    let id = document.getElementById("id").value;
    if(id.length==0||isNaN(id))
    {
        id=getMax()+1;
    }
    let Obj = {
        id:document.getElementById("id").value,
        author:document.getElementById("author").value,
        date: document.getElementById("date").value
    }
    if(CheckExist(id))
    {
        //Update
        fetch(URL+"/"+id,{
            method: 'PUT',
            body: JSON.stringify(Obj),
            headers: {
                "Content-Type":"application/json"
            }
        }).then(function () {
            LoadSync();
        })
    }
    else
    {
        //Create
        fetch(URL,{
            method: 'POST',
            body: JSON.stringify(Obj),
            headers: {
                "Content-Type":"application/json"
            }
        }).then(function () {
            LoadSync();
        })
    }
}
function CheckExist(id)
{
    return global.find(function(p){
        return p.id == id;
    })
}

function getMax(){
    let ids = global.map(p=>Number.parseInt(p.id));
    return Math.max(...ids);
}