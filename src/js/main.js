const formPost = getID('form-post');



// Get a reference to the database service
const database = firebase.database();
//Escribir en la base de datos
const writeUserData = (userId, name, email, imageUrl) => {
    firebase.database().ref('users/' + userId)
      .set({
        username: name,
        email: email,
        profile_picture: imageUrl
      });
  }
  

  
  //window.onload = () => {
  const inicializar = () => {
    $('#form-post').submit(getFirebase = (e) => {
      e.preventDefault();
      //$('#form-post').submit(getFirebase, false);
      //firebase.database().ref();
    });
  }
  //}
  
  
  
  const writeNewPost = (uid, message) => {
    // A post entry.
    let postData = {
      uid: uid,
      message: message
    };
    // Get a key for a new Post.
    let newPostKey = firebase.database().ref().child('posts').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    let updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    firebase.database().ref().update(updates);
    return newPostKey;
  }
  
  /* function toggleStar(postRef, uid) {
    postRef.transaction(function(post) {
      if (post) {
        if (post.stars && post.stars[uid]) {
          post.starCount--;
          post.stars[uid] = null;
        } else {
          post.starCount++;
          if (!post.stars) {
            post.stars = {};
          }
          post.stars[uid] = true;
        }
      }
      console.log(post);
      return post;
    });
  } */
  
  $('#btn-post').click(() => {
    var userId = firebase.auth().currentUser.uid;
    const newPost = writeNewPost(userId, post.value);
    posts.innerHTML += `
   <div>
   <textarea id="${newPost}">${post.value}</textarea>
   <div id="${posts}"><button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
   •
  </button>            <div class="dropdown-menu dropdown-menu-right">
  <button id='update'class="dropdown-item" type="button">Editar</button>
  <button id='delete'class="dropdown-item" type="button">Eliminar</button>
  </div>
  </div>
   </div>`
  
    const btnUpdate = document.getElementById('update');
    const btnDelete = document.getElementById('delete');
    btnDelete.addEventListener('click', (e) => {
      e.preventDefault();
      firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
      firebase.database().ref().child('posts/' + newPost).remove();
      while (posts.firstChild) posts.removeChild(posts.firstChild);
      // reload_page();
    });
  
    btnUpdate.addEventListener('click', () => {
      const newUpdate = document.getElementById(newPost);
      const nuevoPost = {
        message: newUpdate.value,
      };
      var updatesUser = {};
      var updatesPost = {};
      updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
      updatesPost['/posts/' + newPost] = nuevoPost;
      firebase.database().ref().update(updatesUser);
      firebase.database().ref().update(updatesPost);
    });
  });
  
  //Cerrar sesión
$('#sign-off').click(() => {

    firebase.auth().signOut()
      .then(() => {
        console.log("sesión cerrada");
        getID('user_name').innerHTML = '';
        getID('photo').innerHTML = '';
  
      })
      .catch((error) => {})
  });