// window.onload = () => {
//   let listData = getData();
//   renderList(listData);
//   renderSummary(listData);
// }

let getData = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/projects", false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

let deleteData = (item) => {
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", `http://localhost:3000/projects/${item}`, false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

let renderList = (listData) => {
  listData.forEach(element => {
    let newRow = document.createElement("tr");
    document.getElementById("project-table").appendChild(newRow);
    newRow.innerHTML = `
    <td class="title">${element.name}</td>
    <td class="description" title="${element.description}">${element.description}</td> 
    <td class="deadline">${element.endTime}</td>
    <td class="${element.status.toLowerCase()}">${element.status}</td>
    <td><button type="button" class="delete" id="${element.id}">删除</button></td>`
  });
}

let calculateCount = (listData) => {
  let summaryArr = [];
  let [all, unsolved, solving, solved] = [0, 0, 0, 0];
  listData.forEach(element => {
    if (element.status === "ACTIVE") {
      unsolved++;
    }
    else if (element.status === "PENDING") {
      solving++;
    }
    else if (element.status === "CLOSED") {
      solved++;
    }
  });
  all = unsolved + solving + solved;
  summaryArr.push(all, [unsolved, unsolved/all], [solving, solving/all], [solved, solved/all]);
  return summaryArr;
}

let renderSummary = (listData) => {
  let arr = calculateCount(listData);
  document.getElementById("all-count").innerHTML = arr[0];
  document.getElementById("unsolved-count").innerHTML = arr[1][0];
  document.getElementById("unsolved-percentage").innerHTML = `${Math.floor(arr[1][1] * 100)}%`;
  document.getElementById("solving-count").innerHTML = arr[2][0];
  document.getElementById("solving-percentage").innerHTML = `${Math.floor(arr[2][1] * 100)}%`;
  document.getElementById("solved-count").innerHTML = arr[3][0];
  document.getElementById("solved-percentage").innerHTML = `${Math.floor(arr[3][1] * 100)}%`;
}

let listData = getData();
renderList(listData);
renderSummary(listData);

let showDeleteBox = () => {
  let box = document.createElement("section");
  box.setAttribute("id", "delete-box");
  document.querySelector("body").appendChild(box);
  box.innerHTML = `
  <span class="iconfont">&#xe60a;</span>
  <span class="iconfont" id="close">&#xe600;</span>
  <p class="notification">提示</p>
  <p class="question">确认删除该项目吗？</p>
  <button type="button" class="confirm" id="confirm">确认</button>
  <button type="button" class="cancel" id="cancel">取消</button>`
}
  

let cancelEvent = () => {
  document.getElementById("delete-box").remove();
}

let deleteItem = (temp) => {
  deleteData(temp.id);
  temp.parentNode.parentNode.remove();
  document.getElementById("delete-box").remove();
  let listData = getData();
  calculateCount(listData);
  renderSummary(listData);
}

let tempEvent = (event) => {
  return event.target;
}

document.addEventListener("click", (event) => {
  // let temp;
  if (event.target.innerText === "删除") {
    showDeleteBox();
    temp = tempEvent(event);
  }
  if (event.target.id === "cancel" || event.target.id === "close") {
    cancelEvent();
  }
  if (event.target.id === "confirm") {
    deleteItem(temp);
  }
});
