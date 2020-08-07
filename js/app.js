const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH ="lineThrough";

let LIST,id;

let data = localStorage.getItem("TODO")

if(data){
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
}else{
   LIST =[];
   id=0;
}

function loadList(array){
	array.forEach(function(item){
       addToDo(item.name, item.id, item.done, item.trash) ;
	});
}

clear.addEventListener("click", function(){
     localStorage.clear();
     location.reload();

});

const options ={
	weekday:"long",
	month:"short",
	day:"numeric"
};

const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US",options);

function addToDo(todo,id,done,trash)
{   

	if (trash){return ;}
	const DONE =done ? CHECK : UNCHECK;
	const LINE = done ? LINE_THROUGH : "";

	const item = `
                     <li class="item">
	                   <i class="fa ${DONE} co" job="complete" id="${id}"></i>
	                   <p class="text ${LINE}">${todo}</p>
	                   <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                     </li>
                 `;

     
	const position ="beforeend";
	list.insertAdjacentHTML(position,item);

}
document.addEventListener("keydown", function(event){
   if(event.keyCode == 13){
   	   const todo = input.value;


        if (todo.length !== 0){
        	
        	addToDo(todo,id,false,false);
        	LIST.push({
               name:todo,
               id:id,
               done:false,
               trash:false


        	});
        	localStorage.setItem("TODO" , JSON.stringify(LIST));

        	id++;
        }
        input.value = "";
   }


});

function completeToDo(element){
   element.classList.toggle(CHECK) ;
   element.classList.toggle(UNCHECK) ;
   element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH) ;
   LIST[element.id].done  = LIST[element.id].done ? false : true;


}

function removeToDo(element){

	element.parentNode.parentNode.removeChild(element.parentNode);
	LIST[element.id].trash = true;
}

list.addEventListener("click",function(event){
   const element = event.target;
   const elementJob = element.attributes.job.value;

    if(elementJob == "complete"){
       completeToDo(element);
    }else if(elementJob == "delete"){
      removeToDo(element);
    }
    localStorage.setItem("TODO" , JSON.stringify(LIST));

})
