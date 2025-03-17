{
  let URL = "http://localhost:3000/posts";
  let URL2 = "http://localhost:3000/authors";
  var postsGlobal;
  var authorsGlobal;
  LoadSync();
  async function LoadSync() {
    try {
      let response = await fetch(URL);
      let response2 = await fetch(URL2);
      let posts = await response.json();
      let authors = await response2.json();
      posts = posts.filter((p) => !p.isDeleted);
      authors = authors.filter((p) => !p.isDeleted);
      postsGlobal = posts;
      authorsGlobal = authors;
      UpdatePostCount();
      let body = document.getElementById("postsBody");
      let select = document.getElementById("authorSelect");
      let authorBody = document.getElementById("authorsBody");
      authorBody.innerHTML = "";
      body.innerHTML = ""; //Làm sạch bảng trước khi lấy dữ liệu mới sau khi thêm dữ liệu
      for (const post of posts) {
        body.innerHTML += ConvertFromObjToHTML(post);
      }
      for (const author of authors) {
        authorBody.innerHTML += AuthorConvertFromObjToHTML(author);
        select.innerHTML += `<option value="${author.name}">${author.name}</option>`;
      }
    } catch (error) {
      console.log(error);
    }
  }
  function AuthorConvertFromObjToHTML(author) {
    let string = `<tr>`;
    string += `<td>${author.id}</td>`;
    string += `<td>${author.name}</td>`;
    string += `<td>${author.postCount}</td>`;
    string += `<td><button class="delete-button" onclick="DeleteAuthor('${author.id}'); return false">Delete</button></td>`;
    string += `</tr>`;
    return string;
  }
  function ConvertFromObjToHTML(post) {
    let string = "<tr>";
    string += `<td>${post.id}</td>`;
    string += `<td>${post.title}</td>`;
    string += `<td>${post.views}</td>`;
    string += `<td>${post.author}</td>`;
    string += `<td>${post.isPublished}</td>`;
    string += `<td><button class="delete-button" onclick="DeletePost(${post.id}); return false">Delete</button></td>`;
    string += "</tr>";
    return string;
  }
  function SavePost() {
    let id = document.getElementById("id").value;
    if (id.length == 0 || isNaN(id)) {
      id = PostGetMax() + 1 + "";
    }
    let Obj = {
      id: id,
      title: document.getElementById("title").value,
      views: document.getElementById("views").value,
      author: document.getElementById("authorSelect").value,
      isPublished: document.getElementById("isPublishedSelect").value,
    };
    if (PostCheckExist(id)) {
      fetch(URL + "/" + id, {
        method: "PUT",
        body: JSON.stringify(Obj),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        LoadSync();
      });
    } else {
      fetch(URL, {
        method: "POST",
        body: JSON.stringify(Obj),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        LoadSync();
      });
    }
  }
  function PostGetMax() {
    if (postsGlobal.length == 0) return 0;
    let ids = postsGlobal.map((p) => Number.parseInt(p.id));
    return Math.max(...ids);
  }
  function PostCheckExist(id) {
    return postsGlobal.find(function (p) {
      return p.id == id && !('isDeleted' in p);
    });
  }
  function DeletePost(id) {
    let post = CheckExist(id);
    if (post && !post.isDeleted) {
      post.isDeleted = true;
      fetch(URL + "/" + id, {
        method: "PUT",
        body: JSON.stringify(post),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        LoadSync();
      });
    } else {
      //
    }
  }
  ////////////////////////////////////////////
  function DeleteAuthor(id) {
    debugger;
    let post = CheckExist(id);
    if (post) {
      post.isDeleted = true;
      fetch(URL2 + "/" + Number.parseInt(id), {
        method: "PUT",
        body: JSON.stringify(post),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        LoadSyncAuthors();
      });
    } else {
      //
    }
  }
  function CheckExist(id) {
    return authorsGlobal.find(function (p) {
      return p.id == id;
    });
  }
  function getMax() {
    if (authorsGlobal.length == 0) return 0;
    let ids = authorsGlobal.map((p) => Number.parseInt(p.id));
    return Math.max(...ids);
  }
  function AuthorSave() {
    let id = document.getElementById("authorId").value;
    if (id.length == 0 || isNaN(id)) {
      id = getMax() + 1 + "";
    }
    let Obj = {
      id: id,
      name: document.getElementById("authorName").value,
      postCount: 0,
    };
    if (CheckExist(id)) {
      //Update
      fetch(URL2 + "/" + id, {
        method: "PUT",
        body: JSON.stringify(Obj),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        LoadSync();
      });
    } else {
      //Create
      fetch(URL2, {
        method: "POST",
        body: JSON.stringify(Obj),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        LoadSync();
      });
    }
  }
  function UpdatePostCount() {
    for (const i of authorsGlobal) {
      for (const j of postsGlobal) {
        if (i.name == j.author) {
          i.postCount++;
        }
      }
    }
  }
}
