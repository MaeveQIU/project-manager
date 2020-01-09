window.onload = () => {
  let listData = getData();
  renderList(listData);
  renderSummary(listData);
}

let getData = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/projects", false);
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
    <td><button type="button" class="delete">删除</button></td>`
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
  document.getElementById("unsolved-percentage").innerHTML = `${arr[1][1] * 100}%`;
  document.getElementById("solving-count").innerHTML = arr[2][0];
  document.getElementById("solving-percentage").innerHTML = `${arr[2][1] * 100}%`;
  document.getElementById("solved-count").innerHTML = arr[3][0];
  document.getElementById("solved-percentage").innerHTML = `${arr[3][1] * 100}%`;
}
