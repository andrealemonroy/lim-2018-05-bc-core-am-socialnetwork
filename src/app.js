// (function(){
//     var config = {
//         apiKey: "AIzaSyBJLg0QwQM_UVohFzRN37UFDKrX5U85lek",
//         authDomain: "labredsocial.firebaseapp.com",
//         databaseURL: "https://labredsocial.firebaseio.com",
//         storageBucket: "labredsocial.appspot.com",
//       };
//       firebase.initializeApp(config);

//       const txtemail=document.getElementById("inputLogin");
//       const txtpassword=document.getElementById("password");
//       const buttonLogIn=document.getElementById("buttonEnter");
//       const buttonSignIn=document.getElementById("signIn");
//       const buttonLogOut=document.getElementById("logOut");

//       buttonLogIn.addEventListener('click', e=>{
//           const email = txtemail.value;
//           const pass= txtpassword.value;
//           const auth = firebase.auth();
        
//           const promise = auth.signInWithEmailAndPassword(email, pass);
//           promise.catch(e=> console.log(e.message));
//       })

//       buttonSignIn.addEventListener('click', e=>{
//         const email = txtemail.value;
//         const pass= txtpassword.value;
//         const auth = firebase.auth();
      
//         const promise = auth.createUserWithEmailAndPassword(email, pass);
//         promise.catch(e=> console.log(e.message));
//       });

//       buttonLogOut.addEventListener('click', e=>{
//           firebase.auth().signOut();
//       })

//       firebase.auth().onAuthStateChanged(firebaseUser =>{
//           if (firebaseUser){
//               console.log(firebaseUser);
//           }
//           else{
//               console.log('no está loggeado');
//               buttonLogOut.classList.add('hide');
//           }
//       })

// }());