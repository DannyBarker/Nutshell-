import { API } from "../api";

//get tasks and filter tasks based on session stored userId
function populateTaskContainer () {
  let taskBox = document.querySelector("#task-div")
  taskBox.innerHTML = "<h4>My Tasks</h4><hr>"
  API.getData("tasks")
  .then(tasks => {
    const userTasks = tasks.filter (task => task.userId === +sessionStorage.getItem("userId"))
    userTasks.forEach(task => {
      let taskCode =
      `
      <div>
      <h3 class="edit-task">${task.task}</h3>
      <p>Due by:${task.completedate}</p>
      <input type="checkbox" id = "${task.id}">
      <label>Task Complete</label><hr>
      `
      taskBox.innerHTML += taskCode
    })

function editTaskEventListener ()
    let tasksToEdit = document.querySelectorAll(".edit-task")
    tasksToEdit.forEach(task => {
      task.addEventListener("click", event => {
        console.log(event)
      })
    })
  })
}



export{populateTaskContainer}