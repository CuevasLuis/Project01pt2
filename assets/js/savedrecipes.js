var jsonKeyName = "savedRecipe";
var dishesList = JSON.parse(window.localStorage.getItem("savedRecipe")) || [];
var commentsList = JSON.parse(window.localStorage.getItem("savedComment")) || [];
var savedRecipeCounter = -1;
console.log(dishesList);

var htmlCode =""
  for(let i=0;i<dishesList.length;i++){
    savedRecipeCounter++;
    var comment = "";
    for (let j = 0; j < commentsList.length; j++) {
      if (dishesList[i].link === commentsList[j].link) {
        comment = commentsList[j].comments;
      }
    }
    htmlCode += `<div>
    <h4 class="dish-name">${dishesList[i].name}</h4>
    <li class="dish-content">${dishesList[i].content}</li>
    <li><img class="dish-img" src="${dishesList[i].image}" /></li>
    <li><a href="${dishesList[i].link}" target="_blank">Full recipe</a></li>
    <li><p>Saved comments:</p>${comment}</li>
    <li><button type="submit" id="${dishesList[i].link}" class="btn waves-effect waves-teal">Delete Recipe</button></li>
    </div>`
  }

  $("#previous").html(htmlCode)

  //event handler for button to delete a single saved recipe from local storage and reload page
  $("button").on("click", function () {
    var link = this.id;
    dishesList = $.grep(dishesList, function(value) {
      return value.link != link;
    });
    commentsList = $.grep(commentsList, function(value) {
      return value.link != link;
    });
    localStorage.setItem("savedRecipe", JSON.stringify(dishesList));
    localStorage.setItem("savedComment", JSON.stringify(commentsList))
    location.reload();
  });

/*   for (var i = 0; i < commentsList.length; i++) {
    console.log(commentsList[i].link);
    
  } */
 
/*   console.log(dishesList) */

// My attempt
/* function onLoad () {
  var recipes = JSON.parse(localStorage.getItem("savedRecipe"));

  for (var i = 0; i < recipes.length; i++) {
    var content = recipes[i].content;
    var image = recipes[i].image;
    var link = recipes[i].link;
    var name = recipes[i].name;
    
    var boxEl = $("<div>")
    boxEl.addClass("container");

    
    }
}

window.onload = onLoad;
 */

/* $("#get-receipe").on("click", function () {
  var receipeName = $("#receipe-name").val()
  console.log(receipeName)
  
  getLocalStorage(receipeName)
 
})
//
//var receipeName="fish"
var savedRecipe=[2, 4]
function getLocalStorage(receipeName){
  var search = JSON.parse(localStorage.getItem("savedRecipe")) || []
  search.push(receipeName)
  localStorage.setItem("savedRecipe", JSON.stringify(search))
 console.log("Local",savedRecipe)
 console.log("Local",search)
 
 var htmlCode = ""
 for(let i =0;i<search.length;i++){
     htmlCode += `<li> ${search[i]} </li>`
     if (i  == 20)  {
      localStorage.clear();
   }

 }
 $("#previous").html(htmlCode)
 
} */



 

//  window.addEventListener('load', function () {
//     //   // Grab the existing history from local storage IF it exists
//        var existingHistory;
//        if (!JSON.parse(localStorage.getItem('history'))) {
//          existingHistory = [];
//        } else {
//         existingHistory = JSON.parse(localStorage.getItem('history'));
//        }
    
//       var historyItems = [];

      // const handleHistory = (term) => {
      //   if (existingHistory && existingHistory.length > 0) {
      //     var existingEntries = JSON.parse(localStorage.getItem('history'));
      //     var newHistory = [...existingEntries, term];
      //     localStorage.setItem('history', JSON.stringify(newHistory));
      //     // If there is no history, create one with the searchValue and save it localStorage
      //   } else {
      //     historyItems.push(term);
      //     localStorage.setItem('history', JSON.stringify(historyItems));
      //   }
      // };

 
  

//  // Invoke our history method
//  if (!existingHistory.includes(searchValue)) {
//     handleHistory(searchValue);
//  } 
// }      

// $("#save").on("click", function () {
//     var ReceipeName = $("#Name").val()
//     console.log(ReceipeName)
//     // getLocalStorage(receipeName)
   
// })
