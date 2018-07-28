
//Declración de Variables:
const status = document.getElementById('status');

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAB7icNPz-tO88wVkgcCeNmlz9H1xd8OTU",
  authDomain: "login-e3b98.firebaseapp.com",
  databaseURL: "https://login-e3b98.firebaseio.com",
  projectId: "login-e3b98",
  storageBucket: "login-e3b98.appspot.com",
  messagingSenderId: "857338189328"
};
firebase.initializeApp(config);


const clearContent = (elements) => {
  elements.forEach(element => {
    clearElement(element);
  });
}

const clearElement = (element) => {
  if (element.value) {
    element.value = '';
  }
  element.innerHTML = '';
}

const getID = (id) => {
  return document.getElementById(id);
}

// Session storage almacena información en el navegador para poder trabajar con ella las veces que necesitemos
const putOnSession = (key, item) => {
  sessionStorage.setItem(key, item);
}

const getFromSession = (key) => {
  return sessionStorage.getItem(key);
}

const getLoggedUser = () => {
  return firebase.auth().currentUser;
}


//Logout
const logout = (redirect = true) => {
  firebase.auth().signOut()
      .then(() => {


      })
      .catch((error) => {
      })
}


//post.js
$(document).ready(function () {
  firebase.auth().onAuthStateChanged((user) => {
      listPosts();
  });
});

const getDataBase = () => {
  return firebase.database();
}

//esta función determina si el post debe ser mostrado o no
const shouldDisplayPost = (currentUser, post) => {
  // si es un post propio mostrar siempre
  if (currentUser.uid === post.userId) {
      return true;
  } else {
      return !post.private;
  }
}


//esta función muestra el post en pantalla, lo agrega a la lista de posts
const showPost = (post) => {
  let currentUser = getLoggedUser();
  if (shouldDisplayPost(currentUser, post)) {
      let postWrapper = `<li data-id="${post.idPost}">`
          + `<div class="post">`
          + `<span>${post.content}</span><br/>`;
      //si son mis propios posts, se agrega las opciones de edición y eliminar
      if (post.userId === currentUser.uid) {
          postWrapper = postWrapper + `<span><a href="#" class="edit-post" onClick="editPost('${post.idPost}')" data-post="${post.idPost}">Editar</a>`
              + `<br/>`
              + `<a href="#" class="delete-post" onClick="removePost('${post.idPost}')" data-post="${post.idPost}">Eliminar</a></span>`
      }
      //sin son posts de otras personas 
      else {
          postWrapper = postWrapper + `<span>autor:${post.author}</span>`
      }

      postWrapper = postWrapper + `</div></li>`;
      //agregar post a la lista
      $('#user-posts-lst').append(postWrapper);
  }
}

const getAllPosts = (callback) => {
  getDataBase().ref('/posts/').once('value', callback);
}

const getPostByUserAndId = (userId, postId, callback) => {
  console.log(userId, postId);
  getDataBase().ref('/user-posts/' + userId + '/' + postId).once('value', callback);
}

const addNewPost = (post) => {
  let uid = post.userId;
  // Get a key for a new Post.
  var postKey = getDataBase().ref().child('posts').push().key;
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + postKey] = post;
  updates['/user-posts/' + uid + '/' + postKey] = post;

  post.idPost = postKey;
  getDataBase().ref().update(updates);

  return post;
}

const updatePost = (post) => {
  console.log(post);
  var updates = {};
  updates['/posts/' + post.idPost] = post;
  updates['/user-posts/' + post.userId + '/' + post.idPost] = post;
  getDataBase().ref().update(updates).then(() => {
      //
      alertify.success('Se ha actualizado el post');
      //load posts again
      listPosts(post.userId);
  });

}

const deletePost = (userId, idPost) => {
  getDataBase().ref().child('posts/' + idPost).remove();
  getDataBase().ref().child('/user-posts/' + userId + '/' + idPost).remove().then(() => {
      //
      alertify.success('Se ha elminado el post');
      //load posts again
      listPosts(userId);
  });
}


const editPost = (idPost) => {
  let currentUser = getLoggedUser();

  alertify.genericDialog || alertify.dialog('genericDialog', function () {
      return {
          main: function (content) {
              this.setContent(content);
          },
          setup: function () {
              return {
                  focus: {
                      element: function () {
                          return this.elements.body.querySelector(this.get('selector'));
                      },
                      select: true
                  },
                  options: {
                      basic: true,
                      maximizable: false,
                      resizable: false,
                      padding: false
                  }
              };
          },
          settings: {
              selector: undefined
          }
      };
  });

  let callbackEdit = (snapshot) => {
      let post = snapshot.val();
      let $editForm = $('#form-edit-post');
      $editForm.find('textarea[name="postContent"]').val(post.content);
      $editForm.find('input[name="idPost"]').val(post.idPost);
      $editForm.find('input[name="privatePost"]').prop('checked', post.private)
      alertify.genericDialog($editForm[0]).set('selector', 'textarea[name="postContent"]');
  }

  getPostByUserAndId(currentUser.uid, idPost, callbackEdit);
}

const removePost = (idPost) => {

  let question = document.createElement('span');
  question.innerHTML = '¿Seguro que desea eliminar el Post?';

  //show confirm diaglo
  alertify.confirm(question,
      //if YES
      () => {
          let currentUser = getLoggedUser();
          let userId = currentUser.uid;
          deletePost(userId, idPost);
      },
      //if NO
      () => {
          //Do nothing
      }
  )
      .set(
          { labels: { ok: 'Sí', cancel: 'No' }, padding: true, title: 'Red Social - Dorelly' }
      );
}

const getPostToEdit = () => {
  let $form = $('#form-edit-post');
  let content = $form.find('textarea[name="postContent"]').val();
  let idPost = $form.find('input[name="idPost"]').val();

  if (content.trim().length == 0) {
      throw new Error("El post debe tener contenido");
  }

  let isPrivate = $form.find('input[name="privatePost"]').prop('checked');
  let currentUser = getLoggedUser();

  let post = {};
  post.idPost = idPost;
  post.author = currentUser.email;
  post.userId = currentUser.uid;
  post.content = content;
  post.private = isPrivate;
  post.edited = true;

  return post;
}

const getPost = () => {
  let $form = $('#add-form-post');
  let content = $form.find('textarea[name="postContent"]').val();

  if (content.trim().length == 0) {
      throw new Error("El post debe tener contenido");
  }

  let isPrivate = $form.find('input[name="privatePost"]').prop('checked');
  let currentUser = getLoggedUser();

  let post = {};
  post.author = currentUser.email;
  post.userId = currentUser.uid;
  post.content = content;
  post.private = isPrivate;
  post.edited = false;

  return post;
}

const listPosts = () => {
  $('#user-posts-lst').html('<p>Cargando posts...</p>');
  let callback = (snapshot) => {
      $('#user-posts-lst').html('');
      snapshot.forEach(function (child) {
          showPost(child.val());
      })
  };
  getAllPosts(callback);
}

$('#add-form-post').submit((e) => {
  e.preventDefault();
  try {
      let post = getPost();
      post = addNewPost(post);
      showPost(post);
  } catch (error) {
      alert(error.message);
  }

});

$('#form-edit-post').submit((e) => {
  e.preventDefault();
  try {
      let post = getPostToEdit();
      updatePost(post);
      alertify.closeAll();
  } catch (error) {
      alert(error.message);
  }
});

$('#logout-lnk').click((e) => {
  logout();
});






















//Validar formulario de login
const validateLogin = () => {
  expresionLogin = /\w+@\w+\.+[a-z]/;
  let accessMail = getID('mail-access').value;
  let accessPassword = getID('password-access').value;
  if (accessMail === '' || accessPassword === '') {
    alert('Todos los campos son obligatorios');
    return false;
  }
  //Usando expresiones regulares: evaluar cadena de caracteres
  //Evaluando que cumpla con la expresion regular
  else if (!expresionLogin.test(accessMail)) {
    alert('El formato del correo no es válido');
    return false;
  }
  return true;
}


const processAuthResult = (authResult, needsEmailVerified = false) => {
  if (needsEmailVerified && !authResult.user.emailVerified) {
      logout(false);
      alert('Aún no ha activado su cuenta. Por favor ingrese a su correo para verificarla');
  } else {
      //redirect to home
      window.location = '/';
  }
}

const authWithEmailAndPassword = (email, password) => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
          return firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .then(function (response) {
          processAuthResult(response, true);
      })
      .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          $('#container-text').html('error message: ' + errorMessage);
      });
}

const getAuthProvider = (socialNetwork) => {
  switch (socialNetwork) {
      case 'google':
          return new firebase.auth.GoogleAuthProvider();
      case 'facebook':
          return new firebase.auth.FacebookAuthProvider();
      default:
          throw new Error("No valid auth provider");
  }
}

//login with google
const authWithOAuth = (socialNetwork) => {
  let authProvider = getAuthProvider(socialNetwork);
  authProvider.setCustomParameters({
      'display': 'popup'
  });
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then( () => {
          return firebase.auth().signInWithPopup(authProvider);
      })
      .then((response) => {
          processAuthResult(response);
      })
      .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          $('#container-text').html('error message: ' + errorMessage);
      });
}

//Autentificación con Google
$('#btn-login-google').click(() => {
  authWithOAuth('google');
});

//Autentificación con Facebook
$('#btn-login-facebook').click(() => {
  authWithOAuth('facebook');
});

$('#form-login').submit(login = (e) => {
  e.preventDefault();
  //Obtener email y pass registrados
  let accessMail = getID('mail-access').value;
  let accessPassword = getID('password-access').value;
  if (validateLogin()) {
    console.log('hola');
    firebase.auth().signInWithEmailAndPassword(accessMail, accessPassword)
      .then(() => {
        checkEmail();


      })
      .catch(function (error) {
        // Handle Errors here.
        getID('container-text').innerHTML = `<p>No se encuentra registrado ${error.code}:${error.message}</p>`
      });
  } else {
    alert('error')

  }
  clearContent([getID('mail-access'), getID('password-access')]);


});




//Evento para seguridad de contraseña de registro
$("#passwordR").on('keyup', () => {
  let mayus = new RegExp('^(?=.*[A-Z])');
  let special = new RegExp('^(?=.*[!%@#$&*])');
  let number = new RegExp('^(?=.*[0-9])');
  let lower = new RegExp('^(?=.*[a-z])');
  let len = new RegExp('^(?=.{8,})');
  //Arreglos
  let regExp = [mayus, special, number, lower, len];
  let elements = [$('#mayus'), $('#special'), $('#number'), $('#lower'), $('#len')];

  let registrationPassword = $('#passwordR').val();
  for (let i = 0; i < 5; i++) {
    if (regExp[i].test(registrationPassword)) {

      elements[i].attr("class", "icon-checkmark");

    } else {
      elements[i].attr("class", "icon-cross");
    }
  }

})


//Validar formulario de registro
const validateSignUp = () => {
  expresion = /\w+@\w+\.+[a-z]/;
  let registrationMail = $('#emailR').val();
  let registrationPassword = $('#passwordR').val();
  let confirmPassword = $('#confirm-password').val();
  console.log(registrationPassword);
  console.log(confirmPassword);
  if (!expresion.test(registrationMail)) {
    alert('El formato de correo es invalido');
    return false;
  } else if (registrationMail === '' || registrationPassword === '') {
    alert('Todos los campos deben llenarse')
    return false;
  } else if (registrationPassword != confirmPassword) {

    alert('Las contraseñas no coinciden');
    return false;
  }
  return true;
};

//Enviar un mensaje de verificación al usuario
const checkEmail = () => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification()
    .then(() => {

      alert("Se ha enviado un correo de validación")


    }).catch((error) => {

      alert("Ha ocurrido un error")

    });
}

$('#form-signup').submit(registrar = (e) => {
  e.preventDefault();
  //Obtener email y pass
  let registrationMail = getID('emailR').value;
  let registrationPassword = getID('passwordR').value;

  if (validateSignUp()) {
    firebase.auth().createUserWithEmailAndPassword(registrationMail, registrationPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.sendEmailVerification()
          .then(() => {

            alert("Se ha enviado un correo de validación")

            // Email sent.
          }).catch((error) => {

            alert("Ha ocurrido un error")

          });
      })
  } else {
    alert('error');
  }

  clearContent([getID('emailR'), getID('passwordR'), getID('confirm-password')]);
});











