$(document).ready(function (){
   // $("#registro").hide();
        $("#btn-register").click(function(){
            $("#login-container").hide();
            $("#regristro").show();
        })
    
    const firebaseConfig = {
        apiKey: "AIzaSyBJ9epuQuFlZUAKlQiJgRBw_TAnJ8GfVEs",
        authDomain: "proyecto-de-prueba-b7cc6.firebaseapp.com",
        projectId: "proyecto-de-prueba-b7cc6",
        storageBucket: "proyecto-de-prueba-b7cc6.appspot.com",
        messagingSenderId: "98380563602",
        appId: "1:98380563602:web:21fb0f1a07cd573eadd24b",
        measurementId: "G-Z1GW4L2JGD"
      };

      //Inicializar firebase
      firebase.initializeApp(firebaseConfig);

      //inicializar servicio de autenticacion
      const auth = firebase.auth();
 
      //login o inicio de sesion
      $("btn-login").click(function(e){
          e.preventDefault();
          //variables de inputs
          var correo = $("#mail").val();
          var password = $("#pass").val();
          //Usar servicio de login  de firebase
          auth.singInWithEmailAndPassword(correo,password)
          .then(userCredential=>{
              alert("datos correctos")
          })
          .catch((error)=>{
              let errorCode = error.code;
              let errorMessage = error.message;
              alert("Código:"+errorCode+". Mensaje: "+errorMessage);
  
          })

      })
      //singup o crear cuenta
      $("#btn-singup").click(function(e){
        e.preventDefault();
        var correo = $("#mail-new").val();
          var password = $("#pass-new").val();
          //Usar sevicio de firebase para creas una cuenta
          auth.createUserWithEmailAndPassword(correo,password)
          .then(userCredential=>{
            $("#login-container").show();
            $("#regristro").hide();
            alert("Cuenta Creada")
          })
          .catch((error)=>{
               let errorCode = error.code;
              let errorMessage = error.message;
              alert("Código:"+errorCode+". Mensaje: "+errorMessage);
          })
      })
      //Desconexion de Usuarios
      // Boton LogOut
      $("#btn-logout").click(function (e) {
          e.preventDefault();
          auth.signOut().then(() => {
              alert("Sesión cerrada");
              $("#content").hide();
            $("#login-container").show();

          })
        })
        var provider = new firebase.auth.GoogleAuthProvider();
         // provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
        //Iniciar sesión con Google
        $("#btn-login-google").click(function (e) {
            e.preventDefault();
            auth.signInWithPopup(provider)
            .then(result => {
                alert("Ingreso con Google");
            })
            .catch(error => {
                alert(error);
            })
    })
    auth.onAuthStateChanged((user) => {
        if (user) {
            //Sesión iniciada
            $("#login-container").hide();
           // $("#register").hide();
            $("#content").show();
            readPosts();
        }
        else {
            //Sesión finalizada
            $("#content").hide();
            $("#login-container").show();
        }
    })
    const db = firebase.firestore();
    //Publicar un nuevo estado
    $("#btn-publish").click(function(e){
        e.preventDefault();
        let postText = $("#status-text").val();
        let date = new Date();
        db.collection("posts").add({
            post: postText,
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        })
        .then((docRef)=>{
            alert("Estado publicado");
            $("#status-text").val('');
            readPosts();
        })
        .catch((error) =>{
            alert(error);
        })
    })

    function readPosts(){
        db.collection("posts").get().then((posts)=>{
            listPosts(posts.docs);
        })
    }

    function listPosts(data){
        var divContent = $("#post-feed");
        divContent.empty(); 
        if(data.length > 0){
            let content = "";
            data.forEach(document => {
                let doc = document.data();
                const divPost = `
                    <div style='border:solid 2px;'>
                        <p>${doc.post}</p><br>
                        <span>Publicado el: ${doc.day}/${doc.month}/${doc.year}<span>
                        <button data-id="${doc.id}">Editar</button>
                        <button data-id="${doc-id}">Eliminar</button>
                    </div>
                    <hr>
                `;
                content += divPost;
            });
            divContent.append(content);
        }
    }
     //Agregar listener a btn-delete
     const btnDelete = document.querySelectorAll(".btn-delete-post");
     btnDelete.forEach(btn=>{
         btn.addEventListener("click",(e)=>{
             const id = e.target.dataset.id;
             DeletePost(id);
         })
     })
     const btnEdit = document.querySelectorAll(".btn-edit-post");
     btnEdit.forEach(btn=>{
         btn.addEventListener("click",(e)=>{
             const id = e.target.dataset.id;
             OpenEdit(id,btn);
         })
     })
 


    function OpenEdit(id,button){
 let parent = button.parentNode;
 let textEdit = $(parent).children().eq(2);
 let btnEdit = $(parent).children().eq(3);
 textEdit.show();
 btnEdit.show();
 btnEdit.on("click",function(e){
     SaveUpdate(e,id,textEdit.val())
 });
}

    function DeletePost(id){
 db.collection("posts").doc(id).delete().then(() => {
     alert("Se ha eliminado correctamente");
     readPosts();
 }).catch((error) => {
     console.error("Detalle del Error: ", error);
 });
}


    function SaveUpdate(e,id_post,text_new){
 e.preventDefault();
 db.collection("posts").doc(id_post).update({
     post: text_new,
 }).then(()=>{
     alert("Post actualizado");
     readPosts();
 })
 .catch((error)=>{
     alert("Error:",error);
 })
}
})