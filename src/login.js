//Declración de Variables:
const inputMailRecord = document.getElementById('mail-record');
const inputPasswordRecord = document.getElementById('password-record');
const btnSignUp = document.getElementById('btn-signup');
const inputMailAccess = document.getElementById('mail-access');
const inputPasswordAccess = document.getElementById('password-access');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
let containerText = document.getElementById('container-text');
const btnSignOff = document.getElementById('sign-off');
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

//Registrar nuevo usuario con correo y contraseña
btnSignUp.addEventListener('click', registrar => {
    //Obtener email y pass
    let registrationMail = inputMailRecord.value;
    let registrationPassword = inputPasswordRecord.value;

    firebase.auth().createUserWithEmailAndPassword(registrationMail, registrationPassword)
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            containerText.innerHTML = 'Verfique los datos de registro: ' + errorMessage;
            // ... 
        });
    containerText.innerHTML = 'Se registró satisfactoriamente';
    clearContent([inputMailRecord, inputPasswordRecord]);
});

//Acceso de usuarios existentes
btnLogin.addEventListener('click', logear => {
    //Obtener email y pass registrados
    let accessMail = inputMailAccess.value;
    let accessPassword = inputPasswordAccess.value;

    firebase.auth().signInWithEmailAndPassword(accessMail, accessPassword)
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
btnSignOff.addEventListener('click', signOff =>{
    firebase.auth().signOut()
    .then(()=>{
     console.log('Cerrando sesión de red social');
    })
    .catch((error)=>{
      console.log(error);
    })
});

const showResult = () => {
    btnSignOff.classList.remove('hidden');
    status.innerHTML = `
    <p>Usuario se encuentra activo</p>
    `
}

//Estado de autenticación
const observer = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            showResult();
            // User is signed in.
            let displayName = user.displayName;
            let email = user.email;
            let emailVerified = user.emailVerified;
            let photoURL = user.photoURL;
            let isAnonymous = user.isAnonymous;
            let uid = user.uid;
            let providerData = user.providerData;
            // ...
        } else {
            // User is signed out.
            // ...
            status.innerHTML = 'Usuario inactivo';
        }
        //containerText.innerHTML = 'Sólo lo ve si existe usuario';
    });
}

observer();
