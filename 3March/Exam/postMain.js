{
    let URL = "http://localhost:3000/posts";
var global;
LoadSync();

async function LoadSync() {
    try {
      let response = await fetch(URL);
      let posts = await response.json();
      posts = posts.filter(p=>!p.isDeleted);
      global = posts;
      let body = document.getElementById("postsBody");
      body.innerHTML=""; //Làm sạch bảng trước khi lấy dữ liệu mới sau khi thêm dữ liệu
      for(const post of posts)
      {
          body.innerHTML+=ConvertFromObjToHTML(post);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function SavePost(){
    let id = document.getElementById("id").value;
    if(id.length==0||isNaN(id)){
        id = (getMax()+1)+"";
    }
    let Obj = {
        id:id,
        title:document.getElementById("title").value,
        views:document.getElementById("views").value,
        author:document.getElementById("authorSelect").value,
        isPublished:document.getElementById("isPublishedSelect").value,
    }
    if(CheckExist(id)){
        fetch(URL+"/"+id,{
            method:'PUT',
            body:JSON.stringify(Obj),
            headers:{
                "Content-Type":"application/json",
            }
        }).then(function(){
            LoadSync();
        })
    }else{
        fetch(URL,{
            method:'POST',
            body:JSON.stringify(Obj),
            headers:{
                "Content-Type":"application/json",
            }
        }).then(function(){
            LoadSync();
        })
    }
}
  function ConvertFromObjToHTML(post){
    let string = '<tr>';
    string+=`<td>${post.id}</td>`;
    string+=`<td>${post.title}</td>`;
    string+=`<td>${post.views}</td>`;
    string+=`<td>${post.author}</td>`;
    string+=`<td>${post.isPublished}</td>`;
    string+=`<td><button onclick="DeletePost(${post.id}); return false">Delete</button></td>`;
    string += '</tr>';
    return string;
}

function DeletePost(id){
    let post = CheckExist(id);
    if(post && !post.isDeleted){
        post.isDeleted = true;
        fetch(URL+"/"+id,{
            method:'PUT',
            body:JSON.stringify(post),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(function(){
            LoadSync();
        })
    }else{
       //
    }
}
function CheckExist(id){
    return global.find(function(p){
        return p.id==id
    })
}
function getMax(){
    if (authorGlobal.length == 0) 
        return 0;
    let ids = global.map(p=>Number.parseInt(p.id)); 
    return Math.max(...ids);
}

}
