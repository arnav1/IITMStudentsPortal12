//######## get the required elements from the DOM

var tableCont = document.getElementById('tableCont');
var rBlock = document.getElementById("rBlock");

//###################END OF SECTION######################///////




//######## initialisation

resizes(1000,610);//remember that the body is obtained by the resizes function itself.
contentSizeUp();
//Ajax
var request = createRequest();
if (request==null){
    alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
}
else{
    var url= "../resources/ajax/creCouObjDis.php";
    request.onreadystatechange = function(evt){
        if(request.readyState == 4){
            if(request.status == 200){
                eval(request.responseText);
                fuseIfReq();
            }
        }
    }
    request.open("POST",url,false);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(null);
}

var resources = new Array("Delete-icon.png","printer_2");
loadResources(resources);

//###################END OF SECTION######################///////




//######## Callback functions

window.onresize = function(evt){
    resizes(1000,610);
    contentSizeUp();
}
document.getElementById("printer").onclick = function(evt){
    var printDialog = window.open('','_blank');
    
    printDialog.document.write("<!DOCTYPE html>");
    printDialog.document.write("<html>");
    printDialog.document.write("<title>Your table</title>");
    printDialog.document.write("<link href=\"printer.css\" rel=\"stylesheet\" type=\"text/css\" />");
    printDialog.document.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">");
    printDialog.document.write("</head>");
    printDialog.document.write("<body>");
    printDialog.document.write("<div id=\"mainContent\">");
    printDialog.document.write("<div id=\"printNote\">");
    printDialog.document.write("<input id=\"printButton\" type=\"button\" value=\"Print\" onclick=\"document.getElementById('printNote').style.display = 'none'; window.print(); document.getElementById('printNote').style.display = 'block';\">");
    printDialog.document.write("<div id=\"printOpts\">");
    printDialog.document.write("Please make sure you print the table in the <b>lanscape mode</b> to ensure minimal hideousness.<br>If you want to print the background colors, you'll have to make sure you've checked the respective option in your browser.");
    printDialog.document.write("</div>");
    printDialog.document.write("</div>");
    printDialog.document.write("<div id=\"content\">");
    printDialog.document.write("<div id=\"usersName\">" + document.getElementById("userName").innerHTML + "'s table</div>");
    printDialog.document.write("<div id=\"tableContPop\">");
    printDialog.document.write(tableCont.innerHTML);
    printDialog.document.write("</div>");
    printDialog.document.write("<div id=\"footer\">");
    printDialog.document.write("Table prepared by Safire.");
    printDialog.document.write("</div>");
    printDialog.document.write("</div>");
    printDialog.document.write("</div>");
    printDialog.document.write("</body>");
    printDialog.document.write("</html>");
    printDialog.document.close();
}

if(document.getElementById("welcomeNotice")){
    document.getElementById("helpMeLater").onclick = function(evt){
        document.getElementById("mainPageOverlay").style.display = "none";
    }
    document.getElementById("helpMeNow").onclick = function(evt){
        window.location.assign("../formality/help.php");
    }
}

//###################END OF SECTION######################///////





/*//////////////////////////
FUNCTIONS
////////////////////////////*/

function contentSizeUp(){
    var bodyHeight = Number(document.getElementById("footer").style.top.replace("px",""));
    rBlock.style.height = (bodyHeight - 320 - 95) + "px";
}

function formatCont(code,title,location){
    return "<h2 id=\"popupTitle\">Course Information:</h2><table id=\"couInf\"><tr><td>Code:</td><td>" + code +  "</td></tr><tr><td>Title:</td><td>" + title + "</td></tr><tr><td>Location:</td><td>" + location + "</td></tr></table>";
}

function fuseIfReq(){
    var i,j,n;
    var days = new Array("mon","tue","wed","thu","fri");
    for(i=0;i<5;i++){
        var leaderCou = document.getElementById(days[i] + "1");
        leaderCou.colSpan = "1";
        for(j=2;j<=10;j++) {
            currCou = document.getElementById(days[i] + j);
            if(currCou.assoCourseID == leaderCou.assoCourseID){
                leaderCou.colSpan += 1;
                leaderCou.parentNode.removeChild(currCou);
            }
            else{
                leaderCou = currCou;
                leaderCou.colSpan = "1";
            }
        }
    }
}

//###################END OF SECTION######################///////




/*//////////////////////////
OBJECTS
////////////////////////////*/

function Lunch(){
    this.ID = "lunch";

    this.bindById = function(ID){
        var givElement = document.getElementById(ID);
        givElement.assoCourseID = this.ID;
        givElement.innerHTML = "<img id=\"lunchIcon\" alt=\"\" src=\"../resources/websiteImgs/lunchIcon.jpg\">";
        givElement.onclick = function(evt){
            if(!evt){
                evt = window.event;
            }
            var popUp = new Popup('couInfVie');
            popUp.attachCont("<h2 id=\"popupTitle\" style=\"text-align: center;\">Lunch</h2>");
            popUp.dispPopup(evt.clientX, evt.clientY);
        };
        givElement.style.cursor = "default";
        givElement.style.padding = "0px";
        givElement.title = "Lunch!";
    }
}



function nullSlot(){
    this.ID = "nullslot";
    this.bindById = function(ID){
        var givElement = document.getElementById(ID);
        givElement.assoCourseID = ID;
        givElement.innerHTML = "";
        givElement.onclick = function(evt){
            if(!evt){
                evt = window.event;
            }
            
            var popUp = new Popup('couInfVie');
            popUp.attachCont("<h2 id=\"popupTitle\" style=\"text-align: center;\">Null Slot</h2>");
            popUp.dispPopup(evt.clientX, evt.clientY);
        };
        givElement.style.cursor = "default";
    };
}



function Course(){
    this.nameTitle = "";
    this.code = "";
    this.location = "";
    this.alias = "";
    this.ID = null;

    this.bindById = function(ID){
        var givElement = document.getElementById(ID);
        givElement.assoCourseID = this.ID;
        if(this.alias == ""){
            givElement.innerHTML = this.code + "<p class=\"locationSlot\">" + this.location + "</p>";
        }
        else{
            givElement.innerHTML = this.alias + "<p class=\"locationSlot\">" + this.location + "</p>";
        }
        var cCode = this.code;
        var cTitle = this.nameTitle;
        var cLocation = this.location;
        givElement.onclick = function(evt){
            if(!evt){
                evt = window.event;
            }
            
            var popUp = new Popup('couInfVie');
            popUp.attachCont(formatCont(cCode,cTitle,cLocation));
            popUp.dispPopup(evt.clientX, evt.clientY);
        };
        givElement.style.cursor = "default";
    };
}



function Popup(ID){
    var parentDiv = document.getElementById(ID);
    var popupDiv = parentDiv.childNodes[0];

    this.dispPopup = function(xCoord,yCoord){
        popupDiv.style.position = 'absolute';
        
        var scrolled1 = getScrolledLen();
        popupDiv.style.left = (xCoord - 150 - 210 + scrolled1[0]) + "px";
        popupDiv.style.top = (yCoord - 150 + scrolled1[1]) + "px";
        
        popupDiv.style.backgroundColor = '#ffffff';
        popupDiv.style.height = "200px";
        popupDiv.style.width = "300px";
        popupDiv.style.border = "#b8b7b7 solid 1px";
        popupDiv.style.padding = "10px";
        popupDiv.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.31)";
        popupDiv.style.borderRadius = "3px";
        popupDiv.style.zIndex = "100";

        var popupCloser = document.getElementById('closePopup');
        popupCloser.onclick = function(evt){
            parentDiv.innerHTML = "<div></div>";
        }
        //the code below is to close the div
        document.body.onmousedown = function(evt){
            if(!evt){
                evt = window.event;
            }
            
            var scrolled2 = getScrolledLen();
            if(((evt.clientX + scrolled2[0] - 200 < Number(popupDiv.style.left.replace("px",""))) || (evt.clientX + scrolled2[0] - 201 > Number(popupDiv.style.left.replace("px","")) + 320)) || ((evt.clientY + scrolled2[1] < Number(popupDiv.style.top.replace("px",""))) || (evt.clientY + scrolled2[1] - 1 > Number(popupDiv.style.top.replace("px","")) + 220))){
                parentDiv.innerHTML = "<div></div>";
            }
        }

        //just to increase comfort levels --- 370=width plus gap bet popup and leftEdge plus left padding of main page. 200 = width of leftBar.
        var X = Number(popupDiv.style.left.replace("px",""));
        
        window.onresize = function(evt){
            resizes(1000,610);
            contentSizeUp();
            var winW = Number(document.body.style.width.replace("px",""));
            if(X + 370 >= winW - 200){
                popupDiv.style.left = (winW - 200 - 370) + "px";
            }
            else{
                popupDiv.style.left = X + "px";
            }
        }

    }

    this.attachCont = function(content){
        popupDiv.innerHTML = "<img id=\"closePopup\" alt=\"\" src=\"../resources/websiteImgs/Delete-icon.png\" style=\"float: right; width: 10px; height: 10px; cursor: pointer;\">" + content;
    }
}

    //###################END OF SECTION######################///////