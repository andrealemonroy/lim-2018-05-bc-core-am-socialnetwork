//Declración de Variables:
const inputMailRecord = document.getElementById('mail-record');
const inputPasswordRecord = document.getElementById('password-record');
const resgisterLink = document.getElementById('registerLink');
const btnSignUp = document.getElementById('btn-signup');
const inputMailAccess = document.getElementById('mail-access');
const inputPasswordAccess = document.getElementById('password-access');
const btnLogin = document.getElementById('btn-login');
const containerText = document.getElementById('container-text');
const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const wall = document.getElementById('wall');
const btnSignOff = document.getElementById('sign-off');
const status = document.getElementById('status');
const btnLoginGoogle = document.getElementById('btn-login-google');
const btnLoginFacebook = document.getElementById('btn-login-facebook');
let userHtml = document.getElementById('user_name');
const returnToLogin = document.getElementById('return');

window.onload = () => {

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // showResult(user);
      // User is signed in.
      // console.log(user);
      // let displayName = user.displayName;
      // let email = user.email;
      // let emailVerified = user.emailVerified;
      // console.log(emailVerified);
      // let photoURL = user.photoURL;
      // let isAnonymous = user.isAnonymous;
      // let uid = user.uid;
      // let providerData = user.providerData;
      //
      console.log("el usuario está logeado")
    } else {
      // User is signed out.
      // status.innerHTML = 'Usuario inactivo';
      console.log("el usuario no está logueado")
    }
    console.log('user' + JSON.stringify(user))
    //containerText.innerHTML = 'Sólo lo ve si existe usuario';
  });
}
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

//Enviar un mensaje de verificación al usuario
const checkEmail = () => {
  const user = firebase.auth().currentUser;

  user.sendEmailVerification().then(() => {
    console.log('enviando el correo')
    // Email sent.
  }).catch((error) => {
    // An error happened.
    console.log(eror);
  });
}

//Registrar nuevo usuario con correo y contraseña
resgisterLink.addEventListener('click', () => {
  signIn.style.display = 'none';
  signUp.style.display = 'block';
  // inputMailRecord.style.display='block';
  // inputPasswordRecord.style.display='block';
});

btnSignUp.addEventListener('click', registrar => {
  //Obtener email y pass
  let registrationMail = inputMailRecord.value;
  let registrationPassword = inputPasswordRecord.value;
  firebase.auth().createUserWithEmailAndPassword(registrationMail, registrationPassword)
    .then(() => {
      checkEmail();
    })
    .catch((error) => {
      // Handle Errors here.

      containerText.innerHTML = 'Verfique los datos de registro: ' + error.code + ':' + error.message;
      // ... 
    });
  containerText.innerHTML = 'Se registró satisfactoriamente';
  clearContent([inputMailRecord, inputPasswordRecord]);
});

//Acceso de usuarios existentes
btnLogin.addEventListener('click', () => {
  //Obtener email y pass registrados
  let accessMail = inputMailAccess.value;
  let accessPassword = inputPasswordAccess.value;

  firebase.auth().signInWithEmailAndPassword(accessMail, accessPassword)
    .then(() => {
      console.log('inició sesión');
      wall.style.display = 'block';
      sign.style.display = 'none';
      var user = firebase.auth.currentUser;
      userHtml.innerHTML = user.email;
    })

    .catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      containerText.innerHTML = 'No se encuentra registrado: ' + errorMessage;
    });

  containerText.innerHTML = 'Bienvenid@ a esta red social';

  clearContent([inputMailAccess, inputPasswordAccess]);
});


//Cerrar sesión
btnSignOff.addEventListener('click', signOff => {
  firebase.auth().signOut()
    .then(() => {
      wall.style.display = 'none';
      sign.style.display = 'block';
      console.log('Cerrando sesión de red social');
    })
    .catch((error) => {
      console.log('error al cerrar sesión');
    })
});

returnToLogin.addEventListener('click', () =>{
  signIn.style.display = 'block';
  signUp.style.display = 'none';
})
const showResult = (user) => {
  if (user.emailVerified) {
    `wall.style.display="block"`
    // btnSignOff.classList.remove('hidden');
    status.innerHTML = `
        <p>Se validó que su correo si existe, Bienvenid@, usuario se encuentra activo</p>
        `
  }

}

//Estado de autenticación
// const observer = () => {
//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {

//             showResult(user);
//             // User is signed in.
//             console.log(user);
//             let displayName = user.displayName;
//             let email = user.email;
//             let emailVerified = user.emailVerified;
//             console.log(emailVerified);
//             let photoURL = user.photoURL;
//             let isAnonymous = user.isAnonymous;
//             let uid = user.uid;
//             let providerData = user.providerData;
//             // ...
//         } else {
//             // User is signed out.
//             // ...
//             status.innerHTML = 'Usuario inactivo';
//         }

//         //containerText.innerHTML = 'Sólo lo ve si existe usuario';
//     });
// }

// observer()

//Autentificación con Google
btnLoginGoogle.addEventListener('click', handleAuth => {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      userHtml.innerHTML = `${result.user.displayName}`;
      console.log("ha iniciado sesión")
      wall.style.display = 'block';
      sign.style.display = 'none';
    }).catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
      console.log(`Error ${error.message}`);
      console.log("no ha iniciado sesión")
    });
})

//Autentificación con Facebook
btnLoginFacebook.addEventListener('click', () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      userHtml.innerHTML = `${result.user.displayName}`;
      wall.style.display = 'block';
      sign.style.display = 'none';
    })
    .catch((error) => {
      console.log(error.code + error.message)
    });
  //Si cuenta con una sesión activa
  // if (!firebase.auth().currentUser) {
  //     //Almacenar la información del proveedor facebook
  //     provider.addScope('user_birthday');
  //     firebase.auth().signInWithPopup(provider).then((result) => {
  //         // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  //         const token = result.credential.accessToken;
  //         // The signed-in user info.
  //         const user = result.user;
  //         // ...
  //         status.innerHTML = `
  //     <p>Se validó que su cuenta si existe, Bienvenid@, usuario se encuentra activo</p>
  //     `
  //     }).catch((error) => {
  //         // Handle Errors here.
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         // The email of the user's account used.
  //         const email = error.email;
  //         // The firebase.auth.AuthCredential type that was used.
  //         const credential = error.credential;
  //         // ...
  //     });
  // }
});

//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '209695559870372',
//       cookie     : true,
//       xfbml      : true,
//       version    : 'v3.0'
//     });

//     FB.AppEvents.logPageView();  

// };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));

//    function checkLoginState() {
//     FB.getLoginStatus(function(response) {
//       statusChangeCallback(response);
//     });
//   }
