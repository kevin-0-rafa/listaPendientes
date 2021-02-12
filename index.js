

const db = firebase.firestore();

const taskForm = document.getElementById("lista");
const tasksContainer = document.getElementById("tasks-container");
let editStatus = false;
let id = '';

const saveTask = (nuevopendiente) =>
db.collection("Pendientes").doc().set({
    nuevopendiente
});
const getTasks = ()=> db.collection("Pendientes").get();

const getTask = (id) => db.collection("Pendientes").doc(id).get();

const onGetTasks = (callback) => db.collection("Pendientes").onSnapshot(callback);

const deleteTask = id => db.collection("Pendientes").doc(id).delete();

const updateTask = (id, updatedTask) => db.collection("Pendientes").doc(id).update(updatedTask);



window.addEventListener("DOMContentLoaded", async (e) =>{

    onGetTasks((querySnapshot) => {
        tasksContainer.innerHTML = "";

        querySnapshot.forEach((doc) =>{
            

    
            const task = doc.data();
            task.id = doc.id;
            // console.log(task.id)
    
            tasksContainer.innerHTML += `<div>
            ${task.nuevopendiente}
            
            <button class="btn btn-primary btn-delete" data-id="${task.id}">Eliminar</button>

            <button class="btn btn-secondary btn-edit" data-id="${task.id}">Editar</button>

                   
            </div>`;
            const btnsDelete = document.querySelectorAll(".btn-delete");
            btnsDelete.forEach((btn) => {
                btn.addEventListener('click', async (e) => {
                   await deleteTask(e.target.dataset.id)

                })
            });
            const btnsEdit = document.querySelectorAll(".btn-edit");
            btnsEdit.forEach((btn) => {
                btn.addEventListener('click', async (e) => {
                    
                   const doc=  await getTask(e.target.dataset.id);
                   const task = doc.data();
                   editStatus = true;
                   id = doc.id;
                //    console.log(task)
                   taskForm['nuevo'].value = task.nuevopendiente;
                   taskForm['btn-task-form'].innerText = 'Actualizar';
                })
            })


        });
    });
 });

    


taskForm.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const nuevopendiente = taskForm["nuevo"];

    
   if(!editStatus){
    await saveTask(nuevopendiente.value);
   }else{
       await updateTask(id,{
           nuevopendiente:nuevopendiente.value
       });
       editStatus = false;
       id = '';
       taskForm["btn-task-form"].innerText = 'Guardar';
    
   }

   await getTasks();

   taskForm.reset();
   nuevopendiente.focus();
});











