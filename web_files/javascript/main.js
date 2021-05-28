/*
    This is the master(main) js/JQuery override file
    Use this to write custom js/JQuery code that will be universally accessible

    ---------Standards and Best Practices-------------------
    -- 1. Make sure to always copy and paste this header to each *.js,*.css file to map the important functionality
    -- 2. Use the page specific code sparingly, do your best to write relative Dynamic code - will save time and energy
    -- 3. When reaching Production please "minify" all js/css files to eliminate comments and condense the files
    -- 4. "Min" file naming pattern should be as follows:
            Page specific - "[name].min.[version #].[js/css]"
            Main files    - "main.min.[version #].[js/css]"
    -- 5. Please remove this file from the production version to keep file structure integrity and security reasons
    --------Standards and Best Practices End---------------
*/
/*
    -------------------Code Chapters-----------------------
    -- 1. Global var Declarations
    -- 2. Ajax
    -- 3. Onload.Body Initializers
    -- 4. Listeners
    -- 5. Arrow/Anonymous Functions
    -- 6. Misc Named Functions
    -------------------Code Chapters End-------------------
*/

// Chapter 1. Global var Declarations ---------------------

//This is the base url that we are using this base will always be applied it is global scope
let base_url = "http://localhost:5000/";
let java_base_url ="http://localhost:7001/";

// Chapter 1. Global var Declarations End -----------------

// Chapter 2. Ajax ----------------------------------------

// This Ajax Call is a Singleton(only 1 instance)
// All Ajax calls pass through here
function ajaxCaller(request_type, url, response_func, response_loc, load_loc, jsonData) {
    //create the loading object dynamically ----------

    //check if load_loc exists
    if(document.getElementById(load_loc)) {
        //play the loading animation until it is done loading
        //resets the load location to nothing
        document.getElementById(load_loc).innerHTML = "";
        //creates loader
        let pre_load_ani = document.createElement("div");
        // Class:"loader" is a full css animation
        // If you wish to change the loading animation
        // CSS Location = main.css ".loader"
        pre_load_ani.setAttribute("class", "loader");
        //appends loader to loader loc
        document.getElementById(load_loc).appendChild(pre_load_ani);
    }

    //load factory end ------------------------------

    //create the ajax object
    let ajax = new XMLHttpRequest();
    //initiate the ajax function
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            //readystate:4 means the response has come back
            console.log("Ajax Complete! Loading result");

            //remove the loading animation
            document.getElementById(load_loc).innerHTML = "";

            //set response_holder to hold the response data
            let response_holder = this.responseText;

            //send the response to this function
            response_func(this.status, response_holder, response_loc, load_loc)

        }
    }

    //request_type:represents the request type: GET, POST, PUT, etc....
    //url:represents the base_url + the endpoint
    ajax.open(request_type, url, true);

    //optional: checks if json data is being passed
    if(jsonData) {
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(jsonData));
    } else {
        ajax.send();
    }
}

// Chapter 2. Ajax End ------------------------------------

// Chapter 3. Onload.Body Initializers --------------------

//set a standard for form validation


//Iterates through all forms on a page then cancels the forms default functions
//validates form data based on elements attributes and 'is-valid' class
(function() {
    'use strict';
    window.addEventListener('load', function() {
        populateExists();
        //place code you watn to happen on load here
        //session data space
        
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                event.stopPropagation();
                event.preventDefault();
                if (form.checkValidity() === false) {
                    //at least one element does not have a valid value
                    console.log("Form not valid");
                } else {
                    //all elements are valid
                    console.log("Form is valid");
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();
// Chapter 3. Onload.Body Initializers End ----------------

// Chapter 4. Listeners -----------------------------------
// Chapter 4. Listeners End -------------------------------

// Chapter 5. Arrow/Anonymous Functions -------------------
// Chapter 5. Arrow/Anonymous Functions End ---------------

// Chapter 6. Misc Named Functions ------------------------

// ---------- pulling and saving form data ------------

/**
 * Extracts form elements and maps to passed in object
 */
 function extractObjectFromForm($fieldContainer,objectType) {
    var innerArray=[];
    var obj = $.map($fieldContainer.find(":input"), function(n, i)
    {
        var o = {};
        if($(n).is("input:text") 
                || $(n).is("textarea") 
                || $(n).is("input:hidden") 
                || $(n).is("input:password"))
            o[n.name] = $(n).val();
        else if($(n).is("input:checkbox"))
            o[n.name] = ($(n).is(":checked") ? true:false);
        else if(n.type == 'radio') {
            if(innerArray.indexOf(n.name)==-1) {
                innerArray.push(n.name);
            }
        }
        else
            o[n.name] = $(n).val();
        return o;
    });
    $.each(innerArray,function(index,item){
        var iobj={};
        iobj[item]=$("input[name='"+item+"']:checked").val();
        obj.push(iobj);
    });
    return getObjectFromObject(obj,objectType);
}


// Takes a object created from a form scour and
// converts it to an Object type
function getObjectFromObject(formObject,outputObject) {
    $.each(formObject,function(index,item){
        $.each(item,function(key,value){
            if(key) {
                outputObject[key] = services[key];
                if(typeof(value) == "boolean") {
                    outputObject[key].isSelected = value;
                } else {
                    outputObject[key].quantity = value;
                }
                if(value == "" || value == false) {
                    delete outputObject[key];
                }
            }
        });
    });
    console.log(outputObject);
    return outputObject;
}

//pre-load both the services page and the activities page
function preloadService(formObject) {
    $.each(formObject,function(index,item){
        if(document.getElementById(index)) {
            if(typeof(formObject[index].isSelected) == 'boolean') {
                $('#'+index).prop('checked', true);
            } else {
                document.getElementById(index).value = formObject[index].quantity;
            }
        }
    });
}

//  --------- Manipulating sessionStorage -------------

//Directs user to another page
//use to customize any functionality to send a user to a new page
function goToPage(newSpot) {
    window.location.href = newSpot;
}

//retrieves the session and saves it somewhere
//if expecting an object pass in optional second arg, make it true
//Getter
function getSession(getData, isObj) {
    if(isObj) {
        return JSON.parse(sessionStorage[getData]);
    } else {
        return sessionStorage[getData];
    }
}

// Adding new value to storage
function newStorage(key, val) {
    if(sessionStorage.getItem(key) == undefined) {
        sessionStorage.setItem(key, val);
    }
}

//save a value to a session
//if object must save as JSON.stringify(val)
//do this or break up the object and pass in
//Setter
function saveSession(key, val) {
    //check if val is an object and turn to string
    let stringVal;
    if(typeof(val) === "object") {
        stringVal = JSON.stringify(val);
    } else {
        stringVal = val;
    }
    //save session if exists else create a new session key pair
    if(sessionStorage.getItem(key) != undefined) {
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, stringVal);
    }
    else {
        newStorage(key, stringVal);
    }
}

// Remove all storage data
function wipeStorage() {
    sessionStorage.clear();
}

// Chapter 6. Misc Named Functions ------------------------