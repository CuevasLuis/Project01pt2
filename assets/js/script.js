//#region Variables
  // Global variables to get element IDs/class(es)
  var greetingMsgEl = $(".time-of-day");
  var inputFoodEl = $("#input-text");
  var foodSearchEl = $("#food-search");
  var spoonacularEl = $("#spoonacular");
  var spoonResultsEl = $("#spoon-results");
  var edamamEl = $("#edamam");
  var edamResultsEl = $("#edam-results");

  // Global variables assigned/unassigned
  var spoonName = "spoonacular";
  var edamName = "edamam";
  var savedDishKey = "savedRecipe";
  var savedCommentKey = "savedComment";
  var modalCounter;
//#endregion


// Function call, when the load is called
function onLoad() {
  
  //#region Message to display in developer tools
      console.log("Started onLoad");
  //#endregion

  // Local variables
  var dTimMs = new Date();
  var dTim = dTimMs.getHours();

  // Appends the string "Good" to the element
  greetingMsgEl.append("Good ");

  // Checks the user current time, in a 24 hour format
  // to greet them with a Good morning, afternoon or evening
  if(dTim < 12) {
    greetingMsgEl.append("morning!");
  }
  else if (dTim < 18)
    greetingMsgEl.append("afternoon!");
  else {
    greetingMsgEl.append("evening!");
  }

  //#region Message to display in developer tools
    console.log("Finished onLoad");
  //#endregion
}

// Function which starts the search for
// meals of both Spoonacular and Edamam
function getFood() {

  // Resetting counter
  modalCounter = 0;

  // Updating global variables
  apiFetchSpoonDone = false;
  apiFetchEdamDone = false;

  // Hides the search results elements
  foodSearchEl.addClass("hide");

  // Clear out search results elements, before entering new data
  spoonResultsEl.empty();
  edamResultsEl.empty();

  // Local variables
  var foodTx = inputFoodEl.val();

  var spoonAppKeyRef = "&apiKey=";
  var spoonacularKey = "27864d4f1b024cfb9af0eadf74ac4b8a";
  var spoonacularAuth = spoonAppKeyRef + spoonacularKey;
  var spoonacularCall = "https://api.spoonacular.com/food/search?query=" + foodTx + spoonacularAuth;

  var edamamAppIdRef = "&app_id=";
  var edamamAppIdVal = "5a358cfa";
  var edamamAppKeyRef = "&app_key=";
  var edamamKey = "0dd5eb6b500039468f7950a5fb8851fb";
  var edamamAuth = edamamAppIdRef + edamamAppIdVal + edamamAppKeyRef + edamamKey;
  var edamamCall = "https://api.edamam.com/search?q=" + foodTx + edamamAuth;

  // Calls the function to do a fetch
  fetchFromWeb(spoonName, spoonacularCall);
  fetchFromWeb(edamName, edamamCall);

  // Displays the results in the website
  foodSearchEl.removeClass("hide");

  // Clears out the input element value
  // once the searches finishes
  foodTx = "";
}

// Function which fetches from
// both Spoonacular and Edamam data
function fetchFromWeb(webName, website) {

    fetch(website)
      .then(function (response) {
        if ((response.ok) || (response.status == 200)) {
          return response.json();
        }
        else {
          throw new Error('Response get failed');
        }
      })
      .then(function (data) {
        
        // Local variables
        var spoonData = data.searchResults;
        var edamData = data.hits;
        var food;

        // Checks which source it is and saves
        // the data into a common variable
        if (webName == "spoonacular") {
          food = spoonData;
        }
        else {
          food = edamData;
        }

        // For loop for the common variable, [food]
        for (var i = 0; i < food.length; i++) {

          // First check if condition - checks the webname matches "spoonacular"
          // AND THEN
          // Second check if condition - checks if the food name matches "Recipes"
          if ((webName == spoonName) && (food[i].name == "Recipes")) {

            // For loop set for spoonacular API data structure
            for (var j = 0; j < food[i].results.length; j++) {
              
              // Second for loop - local variables, specific to spoonacular data set
              var foodName  = food[i].results[j].name;
              var foodInfo  = food[i].results[j].content;
              var foodImg   = food[i].results[j].image;
              var foodLink  = food[i].results[j].link;

              // Local variable which calls a function with parameters
              var foodData  = pullResults(webName, foodName, foodInfo, foodImg, foodLink);

              // Appends the spoonacular results of the call
              // variable into the spoonacular results element
              spoonResultsEl.append(foodData);
            }
          }

          // First check if condition - checks the webname matches "edamam"
          // AND THEN
          // Second check if condition - checks if the food has key name "recipe"
          if ((webName == edamName) && (food[i].hasOwnProperty("recipe"))) {

            // Local variables
            var foodName  = food[i].recipe.label;
            var foodInfo = (function() {
              
              // Inline local variable
              var fullString = "";
              
              // For loop, to loop thru the recipe health labels
              for (var j = 0; j < food[i].recipe.healthLabels.length; j++) {

                // IF - checks if the counter "J" value
                // does not equal the healthlabel minus 1
                if (j != (food[i].recipe.healthLabels.length - 1)) {
                  
                  // TRUE - adds text with comma at the end
                  fullString += food[i].recipe.healthLabels[j] + ", ";
                }
                else {

                  // ELSE - Add text with no comma at the end
                  fullString += food[i].recipe.healthLabels[j];
                }
              }

              // Return to the calling variable, text truncated
              return fullString;

            })();
            var foodImg   = food[i].recipe.image;
            var foodLink  = food[i].recipe.shareAs;

            // Local variable which calls a function with parameters
            var foodData  = pullResults(webName, foodName, foodInfo, foodImg, foodLink);

            // Appends the spoonacular results of the call
            // variable into the spoonacular results element
            edamResultsEl.append(foodData);
          }
        }
/* 
        // Displays the results in the website
        foodSearchEl.removeClass("hide");
 */
      })
      .catch(function (error) {
        console.error('There has been a problem with your fetch operation:', error);
      });

}











// General function to pull the results from both Spoonacular and Edamam
// and adds the elements and data
function pullResults(webName, foodName, foodInfo, foodImg, foodLink) {
  
  // Local variables
  var liEl = $("<li>");
  var divRowsEl = $("<div>");
  var col1DivEl = $("<div>");
  var col1HeaderEl = $("<header>");
  var col1FoodNameEl = $("<h5>");
  var col1FoodInfoEl = $("<p>");
  var col1FoodDivRowBtnEl = $("<div>");
  var col1FoodDivColAel = $("<div>");
  var col1FoodDivColBel = $("<div>");
  var col1FoodBtnLinkEl = $("<button>");
  var col1FoodBtnCommEl = $("<button>");
/*   var col1FoodBtnCommModalEl = $("<div>"); */
  var col2DivEl = $("<div>");
  var col2FoodImg = $("<img>");
  var col3DivEl = $("<div>");
  var col3SaveEl = $("<i>");
  var col3SavedCheck = loadDish(webName, foodLink);

  var modalMainDivEl = $("<div>");
  var modalContentDivEl = $("<div>");
  var modalHeadingEl = $("<h4>");
  var modalTextEl = $("<input>");
  var modalTextCheck = loadSaveComments(foodLink); // Returns the saved comments
  var modalFooterEl = $("<div>");
  var modalSaveEl =$("<a>");
  var modalCancelEl =$("<a>");

  // Adding classes to the li element
  liEl.addClass("local-coll-item collection-item");
  
  // Adding classes to the the div element
  divRowsEl.addClass("local-row row");

  // Column 1 - information - adding classes only
  col1DivEl.addClass("local-col local-col-first col s6");
  col1FoodInfoEl.addClass("local-food-info");
  
  // Column 1 - button - adding classes only
  col1FoodDivRowBtnEl.addClass("local-row-buttons row");
  col1FoodDivColAel.addClass("local-col local-col-buttons col s6");
  col1FoodDivColBel.addClass("local-col local-col-buttons col s6");
  col1FoodBtnLinkEl.addClass("local-buttons");
  col1FoodBtnLinkEl.attr("onclick", "window.open('" + foodLink + "', '_blank')");
  col1FoodBtnCommEl.attr("data-target", "modal-" + modalCounter);
  col1FoodBtnCommEl.attr("modal-text-target", "modal-text-" + modalCounter);
  col1FoodBtnCommEl.addClass("local-buttons modal-trigger");
  col1FoodBtnCommEl.attr("data-target", "modal1");

  modalMainDivEl.attr("id", "modal-" + modalCounter);
  modalMainDivEl.addClass("modal");
  modalContentDivEl.addClass("modal-content");
  modalTextEl.attr("id", "modal-text-" + modalCounter);
  modalTextEl.attr("value", modalTextCheck);
  
  modalFooterEl.addClass("modal-footer");
  modalSaveEl.attr("ref", "modal-text-" + modalCounter);
  modalSaveEl.attr("link", foodLink);
  modalSaveEl.addClass("modal-close waves-effect waves-green btn-flat"); 

  // Column 2 - image - adding classes and attributes to the element
  col2DivEl.addClass("local-col local-col-second center col s4");
  col2FoodImg.attr({"src": foodImg, "style": "width:100%;height:100%;"});
  
  // Column 3 - save icon - adding classes and attributes to the element
  col3DivEl.addClass("local-col local-col-third center col s2");
  col3SaveEl.attr("name", foodName);
  col3SaveEl.attr("content", foodInfo);
  col3SaveEl.attr("image", foodImg);
  col3SaveEl.attr("link", foodLink);
  col3SaveEl.addClass("local-btn-star fas fa-star");

  //Column 3 - comments button
/*   col3ButtonEl.attr("data-target", "modal1");
  col3ButtonEl.addClass("btn modal-trigger"); */
  /* col3ButtonEl.append("Add comments"); */

/*   col1FoodBtnCommModalEl.attr("id", "modal1");
  col1FoodBtnCommModalEl.addClass("modal");

  col1FoodBtnCommModalContentEl = $("<div>");
  col1FoodBtnCommModalFooterEl = $("<div>");

  col1FoodBtnCommModalContentEl.addClass("modal-content");
  col1FoodBtnCommModalFooterEl.addClass("modal-footer");

  col1FoodBtnCommModalContentEl.append("<h4>Type in your comments for this recipe:</h4>");
  col1FoodBtnCommModalContentEl.append("<input type='text' />");

  col1FoodBtnCommModalFooterEl.append("<a href='#!' class='modal-close waves-effect waves-green btn-flat'>Save</a>"); */
  
  // Checks from the variable output [col3SavedCheck], 
  // if the return data is TRUE or FALSE
  if (col3SavedCheck == true) {

    // TRUE - adds the class of ...save
    col3SaveEl.addClass("local-btn-star-save");
  }
  else {

    // FALSE - adds the class of ...unsave
    col3SaveEl.addClass("local-btn-star-unsave");
  }

  // Appending elements
/*   liEl.append(divRowsEl);

  divRowsEl.append(col1DivEl);
  col1DivEl.append(col1HeaderEl.append(col1FoodNameEl.append(foodName)));
  col1DivEl.append(col1FoodInfoEl.append(foodInfo)); */
  // col1DivEl.append(col1FoodDivRowBtnEl.append(col1FoodDivColAel.append(col1FoodBtnLinkEl.append("Link"))));
/*   col1DivEl.append(col1FoodDivRowBtnEl.append(col1FoodBtnLinkEl.append("Link"))); */
  // col1DivEl.append(col1FoodDivRowBtnEl.append(col1FoodDivColBel.append(col1FoodBtnCommEl.append("Comment"))));
/*   col1DivEl.append(col1FoodDivRowBtnEl.append(col1FoodBtnCommEl.append("Comment")));
              
  divRowsEl.append(col2DivEl);
  col2DivEl.append(col2FoodImg);

  divRowsEl.append(col3DivEl);
  col3DivEl.append(col3SaveEl);

  col1FoodBtnCommModalEl.append(col1FoodBtnCommModalContentEl);
  col1FoodBtnCommModalEl.append(col1FoodBtnCommModalFooterEl);
  col1FoodDivRowBtnEl.append(col1FoodBtnCommModalEl); */

  // Appending elements
  liEl.append(divRowsEl);

  divRowsEl.append(col1DivEl);
  col1DivEl.append(col1HeaderEl.append(col1FoodNameEl.append(foodName)));
  col1DivEl.append(col1FoodInfoEl.append(foodInfo));
  col1DivEl.append(col1FoodDivRowBtnEl.append(col1FoodBtnLinkEl.append("Link")));
  col1DivEl.append(col1FoodDivRowBtnEl.append(col1FoodBtnCommEl.append("Comment")));
  col1DivEl.append(col1FoodDivRowBtnEl.append(modalMainDivEl.append(modalContentDivEl.append(modalHeadingEl.append(foodName)))));
  col1DivEl.append(col1FoodDivRowBtnEl.append(modalMainDivEl.append(modalContentDivEl.append(modalTextEl.append(modalTextCheck)))));
  col1DivEl.append(col1FoodDivRowBtnEl.append(modalMainDivEl.append(modalFooterEl.append(modalSaveEl.append("Save / Close")))));
  // col1DivEl.append(col1FoodDivRowBtnEl.append(modalMainDivEl.append(modalFooterEl.append(modalCancelEl.append("Cancel")))));
              
  divRowsEl.append(col2DivEl);
  col2DivEl.append(col2FoodImg);

  divRowsEl.append(col3DivEl);
  col3DivEl.append(col3SaveEl);

  modalCounter++;

  // Event listerner for the comment button
  col1FoodBtnCommEl.click(function() {
    displayModal(this);
  });
  
  // Event listerner for the save icon (star)
  col3SaveEl.click(function() {
    saveDish(this);
  });

  modalSaveEl.click(function() {
    saveComment(this);
  });

  // Return the element container
  return liEl;
}

function displayModal(event) {
  
  // Materialize CSS Framework
  // Local variables require for modal
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);

  // Local variables
  var modalNextTextTarget = event.getAttribute("modal-text-target");
  var modalTargetId = $("#" + modalNextTextTarget);

  // Out of focus event listerner
  // Trim out leading/ending whitespace
  modalTargetId.focusout(function() {
    
    var modalEditEl = $(modalTargetId);
    var modalTextTrim = modalEditEl.val().trim();
    modalEditEl.val(modalTextTrim);
  });
}

function saveComment(event) {
 
  // Local general variables
  var myReview = JSON.parse(window.localStorage.getItem(savedCommentKey)) || [];
  var sourceUrl = event.getAttribute("link");
  var feedbackRefAttr = event.getAttribute("ref");
  var feedbackRefId = $("#" + feedbackRefAttr);
  var feedbackRefVal = feedbackRefId.val();
  var comment = {link: sourceUrl, comments: feedbackRefVal};
  var duplicate = false;

  // Checks if the JSON has at least 1 entry
  if (myReview.length > 0) {
    
    for (var i = 0; i < myReview.length; i++) {
      
      // First check if condition - the duplicate counter is false, then continue
      // AND THEN
      // Second check if condition - if the selected entry source URLs matches existing links
      if ((duplicate == false) && (sourceUrl == myReview[i].link)) {
        duplicate = true;
      }
    }
  }

  if ((myReview.length == 0) || (duplicate == false)) {

    // Prepares the entry to go into local storage
    myReview.push(comment);

    // Checks if the user entered a comment in the input field
    if (feedbackRefVal.length > 0) {
      
      // Save data (new/updates) into local storage
      localStorage.setItem(savedCommentKey, JSON.stringify(myReview));
    }
  }
  else {
      
    // For loop - goes thru the whole myReview local storage
    // to update the clicked on comment link
    for (var i = 0; i < myReview.length; i++) {
      if (sourceUrl == myReview[i].link) {
        
        // Checks if the field is empty
        if (myReview[i].comments.length > 0) {

          // Removes the object, if there are no comments
          // OR the comment was deleted/removed
          myReview.splice(i, i + 1);
        }
        else {
          // Updates the existing url link comment
          myReview[i].comments = feedbackRefVal;
        }
      }
    }
    
    // Save data (new/updates) into local storage
    localStorage.setItem(savedCommentKey, JSON.stringify(myReview));
  }  
}

// Function to save the bookmark meals into the local storage
function saveDish(event) {

  // Local variables
  var sourceName = event.target.getAttribute("name");
  var sourceCont = event.target.getAttribute("content");
  var sourceImgUrl = event.target.getAttribute("image");
  var sourceUrl = event.target.getAttribute("link");
  var dishes = JSON.parse(window.localStorage.getItem(savedDishKey)) || [];
  var meals = {name: sourceName, content: sourceCont, image: sourceImgUrl, link: sourceUrl};
  var duplicate = false;

  // Checks if the user clicked on the save icon
/*   if (sourceUrl != null) { */

    // Checks if the JSON has at least 1 entry
    if (dishes.length > 0) {

      // Checks all the JSON data
      for (var i = 0; i < dishes.length; i++) {

        // First check if condition - the duplicate counter is false, then continue
        // AND THEN
        // Second check if condition - if the selected entry source URLs matches any of the existing JSON local storage list
        if ((duplicate == false) && (sourceName == dishes[i].source) && (sourceUrl == dishes[i].url)) {
          
          // Changes the variable from false to true, determines if the clicked item is already exists in the JSON
          duplicate = true;
        }
      }
    }

    // First check condition - if the dishes length equals 0
    // OR
    // Second check condition - Checks if the duplicate counter is less than 1
    if ((dishes.length == 0) || (duplicate == false)) {

      // Updates the event target
      event.target.classList.add("local-btn-star-save");
      event.target.classList.remove("local-btn-star-unsave");

      // Duplicate counter was less than 1
      // Adds the entry to the local storage
      dishes.push(meals);

      // Add to the local storage
      localStorage.setItem(savedDishKey, JSON.stringify(dishes));
    }
    else {

      // For loop - goes thru the whole dishes local storage
      // to remove the clicked on dish from local storage by index
      for (var i = 0; i < dishes.length; i++) {
        if ((sourceName == dishes[i].source) && (sourceUrl == dishes[i].url)) {
          dishes.splice(i, i + 1);
        }
      }

      // Updates the clicked on item classes, to switch the save style
      event.target.classList.add("local-btn-star-unsave");
      event.target.classList.remove("local-btn-star-save");

      // Re-update the local storage with the remove item(s)
      localStorage.setItem(jsonKeyName, JSON.stringify(dishes));
    }
  }


// Function runs, when the user user runs the search, which
// returns true or false to the calling function
function loadDish(webName, foodLink) {
  
  // Local variables
  var dishes = JSON.parse(window.localStorage.getItem(jsonKeyName));
  
  if(dishes != null) {
    
    // Checks all the JSON data
    for (var i = 0; i < dishes.length; i++) {

      // First check if condition - checks the source name
        // AND THEN
        // Second check if condition - checks the source url
      if ((webName == dishes[i].source) && (foodLink == dishes[i].url)) {
        return true;
      }
    }
  }
  else {
    return false;
  }
}

// When user runs the website, and the browser finishes loading
// the HTML, CSS, and JS, to run immediately the onLoad function
window.onload = onLoad;

// Click event for when the user clicks the submit button
enterSubmitEl.click("click", getFood);

// Prevents form to refresh when user presses enter due to the form element
$("form").submit(function(e) {
  e.preventDefault();
});

// When the user press enter from the keyboard, runs the 
// same function as if the submit button was clicked on
document.addEventListener("keyup", function(e) {
  if ((inputFoodEl.val() != "") && (e.code === 'Enter')) {
    getFood();
  }
});

// Event click listener, for when the user clicks on the save icon
$("#food-search").on("click", saveDish);

$(document).ready(function(){
  $('.modal').modal();
});