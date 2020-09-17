M.AutoInit();
function taskComplete(task) {
  console.log(task);
  document.getElementById(task).style["text-decoration"]= "line-through";
}

function createNewList() {
 let newlist = document.getElementById("newList").value;
 document.getElementById("newListForm").action = "/"+newlist;
}

function getDate(){
 let today = new Date();
 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 let currentDate = today.toLocaleDateString("en-US",options);
 console.log(currentDate);

 document.getElementById("setDate").innerText = currentDate;

}

getDate();

function deleteList(id) {
  fetch('http://localhost:5000/list/delete', {
    method: 'POST',
    body: JSON.stringify({id: id,}),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => {
    console.log(json)
    window.location.reload();
  })

}




