document.getElementById("userProfile").addEventListener('click', () => {
    var userId = firebase.auth().currentUser.uid;
    let newPost = writeNewPost(userId, post.value);
     wall.innerHTML = `<div id="wall" class="wrapper">
     <div id="logout">
       <p id="user_name"></p>
       <input type="button" id="sign-off" value="Cerrar sesión">
     </div>
 
 
     <div class="card w-50" id="form-post">
       <div id="photo"></div>
       <div id="container-post" class="hiden card-body">
 
         <div class="form-group ">
           <label for="post">Publicación</label>
           <div class="input-group ">
             <textarea class="form-control " name="Publicación" id="post" rows="5" placeholder="¿Qué deseas publicar?"></textarea>
             <input type="submit" value="Publicar" class="btn btn-primary" id="btn-post">
           </div>
           <div class="btn-group">
             <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
               •
             </button>
             <div class="dropdown-menu dropdown-menu-right">
               <button class="dropdown-item" type="button">Editar</button>
               <button class="dropdown-item" type="button">Eliminar</button>
             </div>
           </div>
           <a href="#" class="btn btn-info btn-lg">
             <span class="glyphicon glyphicon-thumbs-up"></span> Like
           </a>
 
 
         </div>
       </div>
     </div>

     <div class="card w-50">
     <form>
       <div>

       </div>
     </form>
     <div id="posts" class="hiden">
     </div>
   </div>

 `;
 posts.innerHTML += `
   <div>
   <textarea id="${newPost}">${post.value}</textarea>
   <div id="${posts}"><button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
   •
  </button>            <div class="dropdown-menu dropdown-menu-right">
  <button class="dropdown-item" type="button">Editar</button>
  <button class="dropdown-item" type="button">Eliminar</button>
  </div>
  </div>
   </div>`
 
})




