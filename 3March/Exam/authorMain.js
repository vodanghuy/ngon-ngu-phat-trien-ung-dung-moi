{
    let URL2 = "http://localhost:3000/authors";
    var authorGlobal;
    var postGlobal;
    LoadSyncAuthors();

    async function LoadSyncAuthors() {
        try {
          let response = await fetch(URL2);
          let authors = await response.json();
          authors = authors.filter(p=>!p.isDeleted);
          authorGlobal = authors;
          let body = document.getElementById("authorsBody");
          let select = document.getElementById("authorSelect");
          body.innerHTML=""; //Làm sạch bảng trước khi lấy dữ liệu mới sau khi thêm dữ liệu
          for(const author of authors)
          {
              body.innerHTML+=ConvertFromObjToHTML(author);
              select.innerHTML+=`<option value="${author.name}">${author.name}</option>`;
          }
        } catch (error) {
          console.log(error);
        }
      }
    
      function ConvertFromObjToHTML(author){
        let string = `<tr>`;
        string+=`<td>${author.id}</td>`;
        string+=`<td>${author.name}</td>`;
        string+=`<td>${author.postCount}</td>`;
        string+=`<td><button onclick="DeleteAuthor('${author.id}'); return false">Delete</button></td>`;
        string += `</tr>`;
        return string;
    }
    
    function getMax(){
        if (authorGlobal.length == 0) 
            return 0;
        let ids = authorGlobal.map(p=>Number.parseInt(p.id));
        return Math.max(...ids);
    }
    function AuthorSave()
    {
        let id = document.getElementById("authorId").value;
        if(id.length==0||isNaN(id))
        {
            id=(getMax()+1)+"";
        }
        let Obj = {
            id:id,
            name:document.getElementById("authorName").value,
            postCount: 0  
        }
        if(CheckExist(id))
        {
            //Update
            fetch(URL2+"/"+id,{
                method: 'PUT',
                body: JSON.stringify(Obj),
                headers: {
                    "Content-Type":"application/json"
                }
            }).then(function () {
                LoadSyncAuthors();
            })
        }
        else
        {
            //Create
            fetch(URL2,{
                method: 'POST',
                body: JSON.stringify(Obj),
                headers: {
                    "Content-Type":"application/json"
                }
            }).then(function () {
                LoadSyncAuthors();
            })
        }
    }
    function DeleteAuthor(id){
        let post = CheckExist(id);
        if(post){
            post.isDeleted = true;
            fetch(URL2+"/"+Number.parseInt(id),{
                method:'PUT',
                body:JSON.stringify(post),
                headers:{
                    "Content-Type":"application/json",
                }
            }).then(function(){
                LoadSyncAuthors();
            })
        }else{
           //
        }
    }
    function CheckExist(id){
        return authorGlobal.find(function(p){
            return p.id==id;
        })
    }

}
