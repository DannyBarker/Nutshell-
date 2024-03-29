import { API } from "../api.js";
import { mainEntryToDom } from "../mainEntryToDom.js";
import { createDashboard, createNav } from "../mainComponent.js";
import { addArticleToDom } from "./addArticleToDOM.js"
import { populateDom } from "../main.js"
import { editBtnClicked } from "./clickEvents.js"

const domContainer = document.querySelector("#dashboard-container");

function createArticleForm() {
  return `<form>
    <section>
      <fieldset>
        <label>Title</label>
        <input type="text" name="article-title" id="article-title" class="form-control"/>
      </fieldset>
    </section>
    <section>
      <fieldset>
        <label>URL</label>
        <input type="text" name="article-url" id="article-url" class="form-control"/>
      </fieldset>
    </section>
    <section>
      <fieldset>
        <label>Synopsis</label>
        <textarea name="article-synopsis" id="article-synopsis" cols="30" rows="5" class="form-control"></textarea>
      </fieldset>
    </section>
    <section>
        <fieldset>
          <label>Date</label>
          <input type="text" name="article-date" id="article-date" class="form-control"/>
        </fieldset>
      </section>
  </form>`;
}

function createSubmitArticleBtn(func) {
  let SubmitBtn = document.createElement("button");
  SubmitBtn.setAttribute("id", "article-submit-btn");
  SubmitBtn.textContent = "Submit";
  SubmitBtn.addEventListener("click", event => {
    let userId = +sessionStorage.getItem("userId");
    let title = document.getElementById("article-title").value;
    let url = document.getElementById("article-url").value;
    let synopsis = document.getElementById("article-synopsis").value;
    let date = document.getElementById("article-date").value;
    let newArticle = {}
    if(document.querySelector("#article-id")){
      let articleId = document.querySelector("#article-id").value
      let articleTimestamp = document.querySelector("#article-timestamp").value
      newArticle = createArticle(userId, title, url, synopsis, date,articleTimestamp, articleId)
    }
    else{
      let timestamp = Date.now()
      newArticle = createArticle(userId, title, url, synopsis, date, timestamp, "");
    }
    console.log(newArticle);
    func("articles", newArticle).then(data => {
      domContainer.innerHTML = "";
      mainEntryToDom(createNav(), createDashboard());
      populateDom()
    });
  });
  return SubmitBtn;
}

function createArticle(userId, title, url, synopsis, date, timestamp, id) {
  return {
    userId,
    title,
    url,
    synopsis,
    date,
    timestamp,
    id
  };
}

function articleToHTML(data) {
  return `
    <h5>posted by: ${data.user.username}</h5>
    <h4>${data.title}</h4>
    <p>${data.synopsis}</p>
    <a href= ${data.url} target="_blank">link</a>
  `;
}

function createArticleCard(data){
  let currentUser = +sessionStorage.getItem("userId")
  let articleCard = document.createElement("section")
  articleCard.setAttribute("id", `article-${data.id}`)
  if(data.userId !== currentUser){
    articleCard.setAttribute("class", "friendStuff")
  }
  articleCard.innerHTML = articleToHTML(data)
  let editBtn = document.createElement("button")
  editBtn.setAttribute("id", `edit-${data.id}`)
  let deleteBtn = document.createElement("button")
  deleteBtn.setAttribute("id", `delete-${data.id}`)
  editBtn.textContent = "edit"
  deleteBtn.textContent = "delete"


  editBtn.addEventListener("click", event => {
    console.log("click")
    editBtnClicked(data)
  })

  deleteBtn.addEventListener("click", event => {
    console.log("click")
    API.deleteData("articles", data.id).then(data => {
      API.getData("articles").then(addArticleToDom)
    })
  })
  articleCard.appendChild(editBtn)
  articleCard.appendChild(deleteBtn)

  return articleCard

}


export { createArticleForm, createSubmitArticleBtn, createArticleCard };
