window.onload = () => {
  const listData = getData();
  renderList(listData);
  renderSummary(listData);
  addEvents();
}

const getData = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/projects", false);
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

const deleteData = item => {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `http://localhost:3000/projects/${item}`, false);
  xhr.send();
}

const renderList = listData => {
  listData.forEach(element => {
    const newRow = document.createElement("tr");
    document.getElementById("table-body").appendChild(newRow);
    newRow.innerHTML = `
    <td class="title">${element.name}</td>
    <td class="description" title="${element.description}">${element.description}</td> 
    <td class="deadline">${element.endTime}</td>
    <td class="${element.status.toLowerCase()}">${element.status}</td>
    <td><button type="button" class="delete" id="${element.id}">删除</button></td>`
  });
}

const calculateCount = listData => {
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

const renderSummary = listData => {
  const arr = calculateCount(listData);
  document.getElementById("all-count").innerHTML = arr[0];
  document.getElementById("unsolved-count").innerHTML = arr[1][0];
  document.getElementById("unsolved-percentage").innerHTML = `${Math.round(arr[1][1] * 100)}%`;
  document.getElementById("solving-count").innerHTML = arr[2][0];
  document.getElementById("solving-percentage").innerHTML = `${Math.round(arr[2][1] * 100)}%`;
  document.getElementById("solved-count").innerHTML = arr[3][0];
  document.getElementById("solved-percentage").innerHTML = `${Math.round(arr[3][1] * 100)}%`;
}

const showDeleteBox = () => {
  const filter = document.createElement("div");
  filter.setAttribute("id", "background");
  document.querySelector("body").appendChild(filter);

  const box = document.createElement("section");
  box.setAttribute("id", "delete-box");
  document.getElementById("background").appendChild(box);
  box.innerHTML = `
  <span class="iconfont">&#xe60a;</span>
  <span class="iconfont" id="close">&#xe600;</span>
  <p class="notification">提示</p>
  <p class="question">确认删除该项目吗？</p>
  <button type="button" id="confirm">确认</button>
  <button type="button" id="cancel">取消</button>`
}

const disappearDeleteBox = () => {
  document.getElementById("delete-box").remove();
  document.getElementById("background").remove();
}

const deleteItem = temp => {
  deleteData(temp.id);
  temp.parentNode.parentNode.remove();
}

const clearList = () => {
  document.getElementById("table-body").innerHTML = "";
}

const sortList = (data, order) => {
  if (order === "asc") {
    return data.sort((x, y) => (x.endTime < y.endTime) ? -1: 1)
  }
  else if (order === "desc") {
    return data.sort((x, y) => (x.endTime > y.endTime) ? -1: 1)
  }
}

const changeColor = (order, anotherOrder) => {
  document.getElementById(order).setAttribute("style", "color: #3080fe");
  document.getElementById(anotherOrder).setAttribute("style", "color: #aaa");
}

const searchKeyWord = () => {
  let word = document.getElementById("search-area").value;
  let list = getData();
  if (word !== "") {
    return list.filter(element => element.name.indexOf(word) !== -1);
  }
  return list;
}

const addEvents = () => {
  const tempEvent = event => event.target;
  let temp;
  document.addEventListener("click", event => {
    if (event.target.innerText === "删除") {
      showDeleteBox();
      temp = tempEvent(event);
    }
    if (event.target.id === "cancel" || event.target.id === "close") {
      disappearDeleteBox();
    }
    if (event.target.id === "confirm") {
      deleteItem(temp);
      disappearDeleteBox();
      renderSummary(getData());
    }
    if (event.target.id === "asc") {
      clearList();
      renderList(sortList(getData(), "asc"));
      changeColor("asc", "desc");
    }
    if (event.target.id === "desc") {
      clearList();
      renderList(sortList(getData(), "desc"));
      changeColor("desc", "asc");
    }
    if (event.target.id === "search-button"){
      clearList();
      renderList(searchKeyWord());
    }
  });

  document.getElementById("search-area").addEventListener("keydown", event => {
    if (event.keyCode === 13) {
      clearList();
      renderList(searchKeyWord());
    }
  });
}
