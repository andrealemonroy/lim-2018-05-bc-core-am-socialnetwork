document.getElementById("wallHome").addEventListener('click', () => {


  posts.innerHTML = `

 `;
  posts.innerHTML += `
 <div style="display: none">
 <form id="form-edit-post" class="card w-50">
   <fieldset>
     <input type="hidden" name="idPost" />
     <textarea name="postContent" required></textarea>
     <input type="checkbox" name="privatePost" value="private" />Privado
     <br/>
     <button type="submit" id="btn-edit-post">Editar</button>
   </fieldset>
 </form>
</div>

<div id="my-posts-wrappers">

 <br>
 <ul id="user-posts-lst">
 </ul>
</div>`

})
