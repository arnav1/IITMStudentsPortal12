//######## get the required elements from the DOM

var loadingInfo = document.getElementById("loadingInfo");
var enroller = document.getElementById("enroller");
var templateShower = document.getElementById("templateShower");
var resetOptions = document.getElementById("templateChooser").getElementsByTagName("div");

//###################END OF SECTION######################///////



//######## initialisation

var timedFunct1;
var chosenTemplate = false;

resizes(1000,610);//remember that the body is obtained by the resizes function itself.

templateShower.style.top = "-280px";
var templateImg;
for(i=0;i<resetOptions.length;i++){
    templateImg = document.createElement("img");
    templateImg.alt = "";
    templateImg.className = "templateImg";
    templateImg.src = "../resources/websiteImgs/" + resetOptions[i].id + ".png";
    templateImg.id = resetOptions[i].id + "templateImg";
    templateShower.appendChild(templateImg);
        
    resetOptions[i].onmouseover = function(evt){
        document.getElementById(this.id + "templateImg").style.display = "inline";
        templateShower.style.display = "inline-block";
    }
    resetOptions[i].onmouseout = function(evt){
        document.getElementById(this.id + "templateImg").style.display = "none";
        templateShower.style.display = "none";
    }
    resetOptions[i].onclick = function(evt){
        document.getElementById(this.id + "Radio").checked = true;
        chosenTemplate = this.id;
    }
}

var alertBox1 = document.createElement("div");
alertBox1.id = "emailIDAlertBox1";
alertBox1.className = "alertBox";
alertBox1.style.display = "block";
alertBox1.style.zIndex = "998";
alertBox1.style.marginTop = "3px";
document.getElementById("emailID").parentNode.appendChild(alertBox1);

//###################END OF SECTION######################///////




//######## Callback functions

window.onresize = function(evt){
    resizes(1000,610);
}

document.getElementById("enroller").onclick = function(evt){
    if(chosenTemplate && (isEmailID(document.getElementById("emailID").value) || document.getElementById("emailID").value == "")){
        this.disabled = "disabled";
        loadingInfo.style.display = "inline-block";
        document.getElementById("loadingImg").style.display = "inline";
    
        var request = createRequest();
        if (request==null){
            alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
        }
        else{
            var url= "../resources/ajax/addUser.php";
            request.onreadystatechange = function(evt){
                if(request.readyState == 4){
                    if(request.status == 200){
                        window.location = "../";
                    }
                }
            }
            request.open("POST",url,true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("emailID=" + document.getElementById("emailID").value + "&chosenTemplate=" + chosenTemplate);
        }
    }
    else{
        if(!chosenTemplate){
            alert("Please choose a template for your table.");
        }
        if(!isEmailID(document.getElementById("emailID").value)){
            document.getElementById("emailIDAlertBox1").innerHTML = "This isn't a valid email ID"
        }
    }
}

//###################END OF SECTION######################///////



/*//////////////////////////
FUNCTIONS
////////////////////////////*/


//###################END OF SECTION######################///////




/*//////////////////////////
OBJECTS
////////////////////////////*/


//###################END OF SECTION######################///////