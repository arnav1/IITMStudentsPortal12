//######## get the required elements from the DOM

var rBlock = document.getElementById("rBlock");
var addCourse = document.getElementById("ender");
var couOnly = document.getElementById("couOnly");
var couOpts = document.getElementById("couOpts");
var resetOptions = document.getElementById("resetForm").getElementsByTagName("div");
var templateShower = document.getElementById("templateShower");
var detEditor = document.getElementById("detEditor");

//###################END OF SECTION######################///////




//######## initialisation

resizes(1010,640);//remember that the body is obtained by the resizes function itself.
contentSizeUp();

//global variables
var isEdited = false;
var prevCourse;
var masterKey = new MasterKey();
var newCourses = new Array();
var delCourses = new Array();
var numbCourses;
var optIdArray = new Array();
var mouseClientX,mouseClientY;
var timedFunct1,timedFunct2;
var prevOptF = document.getElementById("leftBar");//just a dummy object

//to get mouse coordinates
window.onmousemove = function(evt){
    if(window.event){
        evt = window.event;
    }
    mouseClientX = evt.clientX;
    mouseClientY = evt.clientY;
}

//ajax for table and coursOpts
var request = createRequest();
if (request==null){
    alert("problem");
}
else{
    var url= "../resources/ajax/creCouObjMan.php";
    request.onreadystatechange = function(evt){
        if(request.readyState == 4){
            if(request.status == 200){
                eval(request.responseText);
            }
        }
    }
    request.open("POST",url,true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(null);
}

// onclick handler for all of the table's cells.
var i,j;
var days = new Array("mon","tue","wed","thu","fri");
for(i=0;i<5;i++){
    for(j=1;j<=10;j++) {
        var ID = days[i] + j;
        document.getElementById(ID).onclick = function(evt){
            if(masterKey.focussedCourse){
                considerEdited();
                masterKey.focussedCourse.bindList = masterKey.focussedCourse.bindList + this.id + ",";
                masterKey.focussedCourse.bindCellByID(this.id);
            }
        }
    }
}

//some stuff for the detEditor
var inputTextOverLays = detEditor.getElementsByTagName("p");
j = inputTextOverLays.length;
for(i=0;i<j;i++){
    inputTextOverLays[i].onclick = function(evt){
        document.getElementById(this.id.replace("OverLay", "")).focus();
    }
}

//self-explanatory
populateOptIdArray();

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
        templateShower.style.display = "block";
    }
    resetOptions[i].onmouseout = function(evt){
        document.getElementById(this.id + "templateImg").style.display = "none";
        templateShower.style.display = "none";
    }
    resetOptions[i].onclick = function(evt){
        document.getElementById(this.id + "Radio").checked = true;
        document.getElementById("tableReset").disabled = false;
    }
}

var resources = new Array("Delete-icon.png","settings4.png","border.png","what2.png");
loadResources(resources);

//callBack functions
window.onresize = function(evt){
    resizes(1010,640);
    contentSizeUp();
}

document.getElementById("tableSettings").onclick = function(evt){
    if(window.event){// necessary, else the body's click event will fire right away.
        evt = window.event;
        evt.cancelBubble = true;
    }
    else{
        evt.stopPropagation();
    }
    document.body.onclick = function(evt){
        document.getElementById("tableSettingsPage").style.display = "none";
    }
    document.getElementById("tableSettingsPage").style.display = "block";
    document.getElementById("resetForm").onsubmit = function(evt){
        return confirm("Resetting the table will erase all data related to the table including your courses. Are you sure you want to proceed?");
    }
}
document.getElementById("tableSettingsPage").onclick = function(evt){
    if(window.event){
        evt = window.event;
        evt.cancelBubble = true;
    }
    else{
        evt.stopPropagation();
    }
}

addCourse.onclick = addNewCourse;

document.getElementById("saver").onclick = function(evt){
    document.getElementById("loadingInfo").style.display = "block";
    saveAll();
}
document.getElementById("undoer").onclick = function(evt){
    undoAll();
}

document.getElementById("what").onmouseover = function(evt){
    this.src = "../resources/websiteImgs/what2.png"
    document.getElementById("popupWhat").style.display = "block";
}
document.getElementById("what").onmouseout = function(evt){
    this.src = "../resources/websiteImgs/what1.png"
    document.getElementById("popupWhat").style.display = "none";
}

//###################END OF SECTION######################///////




/*//////////////////////////
FUNCTIONS
////////////////////////////*/

function contentSizeUp(){
    var bodyWidth = Number(document.body.style.width.replace("px",""));
    var bodyHeight = Number(document.getElementById("footer").style.top.replace("px",""));
    rBlock.style.height = (bodyHeight - 260 - 95) + "px";
    couOpts.style.height = (bodyHeight - 260 - 105) + "px";
}

function parseCSV(input){
    var output = input.split(",");
    output.pop();
    return output;
}

function addNewCourse(){
    if(!addCourse.isClicked){
        masterKey.prevOpt = masterKey.focussedOpt;
        masterKey.focussedOpt = addCourse;
        masterKey.prevCourse = masterKey.focussedCourse;
        masterKey.focussedCourse = null;

        addCourse.style.backgroundColor = "#8FFF8F";
        addCourse.onmouseover = function(evt){
            this.style.backgroundColor = "#8FFF8F";
        };
        addCourse.onmouseout = function(evt){
            this.style.backgroundColor = "#8FFF8F";
        };

        prevOptHoverEff();

        if(masterKey.prevCourse){
            masterKey.prevCourse.unbindEff2Cells();
        }

        //details editor part
        document.getElementById("code").onkeyup = null;
        document.getElementById("title").onchange = null;
        document.getElementById("location").onchange = null;
        document.getElementById("alias").onchange = null;
        
        eraseDetEditorMessages();
        
        document.getElementById("detEditor").style.display = "table";
        
        document.getElementById("alias").value = "";
        document.getElementById("code").value = "";
        document.getElementById("title").value = "";
        document.getElementById("location").value = "";
        
        setInputOverLayText("alias","optional");
        setInputOverLayText("code","");
        setInputOverLayText("title","");
        setInputOverLayText("location","");
        
        document.getElementById("code").style.color = "black";
        document.getElementById("title").style.color = "black";
        document.getElementById("location").style.color = "black";
        
        document.getElementById("code").onfocus = function(evt){
            document.getElementById("creator").disabled = false;
            timedFunct2 = setInterval(function(){
                sanitize(document.getElementById("code"),/[^\w]|\(|\)|_/g,/^.{4,7}$/);
            },5);
        }
        document.getElementById("title").onfocus = function(evt){
            document.getElementById("creator").disabled = false;
            timedFunct2 = setInterval(function(){
                sanitize(document.getElementById("title"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,32}$/);
            },5);
        }
        document.getElementById("location").onfocus = function(evt){
            document.getElementById("creator").disabled = false;
            timedFunct2 = setInterval(function(){
                sanitize(document.getElementById("location"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,17}$/);
            },5);
        }
        document.getElementById("alias").onfocus = function(evt){
            document.getElementById("creator").disabled = false;
            
            if(this.value == ""){
                setInputOverLayText("alias","");
            }
            
            timedFunct2 = setInterval(function(){
                sanitize(document.getElementById("alias"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{0,8}$/);
            },5);
        }

        document.getElementById("title").onblur = function(evt){
            clearInterval(timedFunct2);
        }
        document.getElementById("alias").onblur = function(evt){
            if(this.value == ""){
                setInputOverLayText("alias","optional");
            }
    
            clearInterval(timedFunct2);
        }
        document.getElementById("code").onblur = function(evt){
            this.value = this.value.toUpperCase();
            clearInterval(timedFunct2);
        }
        document.getElementById("location").onblur = function(evt){
            clearInterval(timedFunct2);
        }

        document.getElementById("creator").style.display = "inline";
        document.getElementById("saver").style.display = "none";
        document.getElementById("undoer").style.display = "none";
        document.getElementById("creator").disabled = true;

        document.getElementById("creator").onclick = function(evt){
            var titleSan = sanitize(document.getElementById("title"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,32}$/);
            var codeSan = sanitize(document.getElementById("code"),/[^\w]|\(|\)|_/g,/^.{4,7}$/);
            var locSan = sanitize(document.getElementById("location"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,17}$/);
            var aliasSan = sanitize(document.getElementById("alias"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{0,8}$/);
            if(titleSan && codeSan && locSan && aliasSan){
                isEdited = true;
                this.disabled = true;
                var option = document.createElement('div');
                option.setAttribute('class', 'option');
                option.innerHTML = "<img id=\"delCourse\" alt=\"\" title=\"Delete this Course\" src=\"../resources/websiteImgs/Delete-icon.png\" style=\"float: right; width: 10px; height: 0px; margin-top: 2px; margin-right: 30px; cursor: pointer;\"><div id=\"opt" + numbCourses + "\"></div>";
                document.getElementById('couOnly').appendChild(option);

                var i = newCourses.length;
                newCourses[i] = new cCourse();
                newCourses[i].code = document.getElementById("code").value;
                newCourses[i].nameTitle = document.getElementById("title").value;
                newCourses[i].location = document.getElementById("location").value;
                newCourses[i].alias = document.getElementById("alias").value;
                if(courses.length == 0){
                    newCourses[i].metaData = "notify|__|";
                }
                else if(courses[0].metaData.search("notify\\|__\\|") != -1){
                    newCourses[i].metaData = "notify|__|";
                }
                else{
                    newCourses[i].metaData = "";
                }
                newCourses[i].bindList = "";
                newCourses[i].init();
                newCourses[i].bindOptByID('opt' + numbCourses);
                newCourses[i].optID = 'opt' + numbCourses;
                newCourses[i].ID = Math.floor((Math.random()*1000000000)+1) + "help" + Math.floor((Math.random()*1000000000)+1);
                newCourses[i].isNew = true;
                optIdArray.push(newCourses[i].optID);
                numbCourses++;

                document.getElementById("code").value = "";
                document.getElementById("title").value = "";
                document.getElementById("location").value = "";
                document.getElementById("alias").value = "";
                
                setInputOverLayText("alias","optional");
                
                document.getElementById("couOpts").scrollTop = 37*optIdArray.length ; //height of an Opt
            }
            else{
                alert("Atleast one of the input text boxes appear to have a string of improper length.");
            }
        }
        
        addCourse.isClicked = true;
    }
}

function considerEdited(){
    isEdited = true;
    document.getElementById("undoer").disabled = false;
    document.getElementById("saver").disabled = false;
}

function saveAll(){
    //make sure all the strings are sanitized
    var unsanitizedCourse = null;
    for(i=0;i<courses.length;i++){
        if(!isSanitizedStr(courses[i].code,/[^\w]|\(|\)|_/g,/^.{4,7}$/) || !isSanitizedStr(courses[i].nameTitle,/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,32}$/) || !isSanitizedStr(courses[i].location,/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,17}$/) || !isSanitizedStr(courses[i].alias,/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{0,8}$/)){
            unsanitizedCourse = courses[i];
            break;
        }
    }
    for(i=0;i<newCourses.length;i++){
        if(!isSanitizedStr(newCourses[i].code,/[^\w]|\(|\)|_/g,/^.{4,7}$/) || !isSanitizedStr(newCourses[i].nameTitle,/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,32}$/) || !isSanitizedStr(newCourses[i].location,/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,17}$/) || !isSanitizedStr(newCourses[i].alias,/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{0,8}$/)){
            unsanitizedCourse = newCourses[i];
            break;
        }
    }
    
    if(unsanitizedCourse){
        var m = 0;
        document.getElementById("loadingInfo").style.display = "none";
        while(optIdArray[m] != unsanitizedCourse.optID){
            m++;
        }
        m++;
        if(document.getElementById("couOpts").scrollTop > m*37){
            document.getElementById("couOpts").scrollTop = m*37;
        }
        else if(document.getElementById("couOpts").scrollTop + Number(document.getElementById("couOpts").style.height.replace("px","")) < (m+1)*37){
            document.getElementById("couOpts").scrollTop = (m+1)*37 - Number(document.getElementById("couOpts").style.height.replace("px",""));
        }
        fireEvent(document.getElementById(unsanitizedCourse.optID).parentNode,"click");
        alert("Some fields have values of improper length");
    }
    else{
        var i,n,k;
        //save courses
        var savCouChanges = "";
        for(i=0;i<courses.length;i++){
            savCouChanges = savCouChanges + formSqlUpdt(courses[i].code,courses[i].nameTitle,courses[i].location,courses[i].alias,courses[i].bindList,courses[i].metaData.replace("slotted|__|", ""),courses[i].ID) + "|::|";
            courses[i].copyCode = courses[i].code;
            courses[i].copyTitle = courses[i].nameTitle;
            courses[i].copyLocation = courses[i].location;
            courses[i].copyBindList = courses[i].bindList;
            courses[i].copyAlias = courses[i].alias;
        }
        //for the newly created
        n = newCourses.length;
        var savCouCreation = "";
        for(i=0;i<n;i++){
            savCouCreation = savCouCreation + formSqlCrt(newCourses[0].code,newCourses[0].nameTitle,newCourses[0].location,newCourses[0].alias,newCourses[0].bindList,newCourses[0].ID) + "|::|";
            newCourses[0].copyCode = newCourses[0].code;
            newCourses[0].copyTitle = newCourses[0].nameTitle;
            newCourses[0].copyLocation = newCourses[0].location;
            newCourses[0].copyBindList = newCourses[0].bindList;
            newCourses[0].copyAlias = newCourses[0].alias;
            var j = courses.length;
            courses[j] = newCourses[0];
            courses[j].isNew = false;
            newCourses.shift();
        }
        if(courses[0]){//this will be present untill we offer the ability to enable/disable notices for each cou. seperately.
            if(courses[0].metaData.search("notify\\|__\\|") == -1){
                savCouCreation = savCouCreation.replace(/notify\|__\|/g,"");
            }
        }
        //for the deleted
        var delIndex;
        n = delCourses.length;
        var savCouDeletion = "";
        for(i=0;i<n;i++){
            savCouDeletion += formSqlDel(delCourses[0].ID) + "|::|";
            if(masterKey.focussedCourse){
                if(delCourses[0].ID == masterKey.focussedCourse.ID){
                    document.getElementById("saver").onclick = function(evt){
                        document.getElementById("loadingInfo").style.display = "block";
                        saveAll();
                    }
                    document.getElementById("undoer").onclick = function(evt){
                        undoAll();
                    }
                }
            }
            document.getElementById("couOnly").removeChild(document.getElementById(delCourses[0].optID).parentNode);
            delCourses.shift();
        }
        //save lunch and null slots
        var saveLunchAndNull = "UPDATE users_safire SET LUNCHSLOTS='" + lunchSlot.bindList + "', NULLSLOTS='" + nullSlot.bindList + "' WHERE ";
        lunchSlot.copyBindList = lunchSlot.bindList;
        nullSlot.copyBindList = nullSlot.bindList;
        //the ajax part
        var request = createRequest();
        if (request==null){
            alert("problem");
        }
        else{
            var url= "../resources/ajax/tabManSavCha.php";
            request.onreadystatechange = function(evt){
                if(request.readyState == 4){
                    if(request.status == 200){
                        document.getElementById("loadingInfo").style.display = "none";//If you navigate to another page before this code executes, the changes won't be saved.
                    }
                }
            }
            request.open("POST",url,true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("queryUpdCourses=" + savCouChanges + "&queryLunchNull=" + saveLunchAndNull + "&queryCreCourses=" + savCouCreation + "&queryDelCourses=" + savCouDeletion);
        }

        isEdited = false;
        document.getElementById("undoer").disabled = true;
        document.getElementById("saver").disabled = true;
    }
}

function undoAll(){
    if(masterKey.focussedCourse){
        masterKey.focussedCourse.unbindEff2Cells();
    }
    //for the deleted
    var i;
    while(delCourses.length>0){
        document.getElementById(delCourses[0].optID).parentNode.style.display = '';
        if(masterKey.focussedCourse){
            if(delCourses[0].ID == masterKey.focussedCourse.ID){
                document.getElementById("detEditor").style.display = "table";
            }
        }
        i = courses.length;
        courses[i] = delCourses[0];
        //everything else like filling the input text boxes and filling the corresponding cells is taken care of by the undoer of the "courses" 
        delCourses.shift();
    }
    //for the newly created
    var wasFocussed = false;
    while(newCourses.length>0){
        if(newCourses[0].ID == masterKey.focussedCourse.ID){
            var alias = document.getElementById("alias");
            document.getElementById("detEditor").style.display = "none";
            alias.value = "";
            document.getElementById("code").value = "";
            document.getElementById("title").value = "";
            document.getElementById("location").value = "";
            document.getElementById("alias").value = "";
            document.getElementById("saver").onclick = function(evt){
                document.getElementById("loadingInfo").style.display = "block";
                saveAll();
            }
            document.getElementById("undoer").onclick = function(evt){
                undoAll();
            }
            wasFocussed = true;
        }
        couOnly.removeChild(document.getElementById(newCourses[0].optID).parentNode);
        newCourses.shift();
    }
    if(wasFocussed){
        masterKey.focussedCourse = null;
    }
    //for the courses
    for(i=0;i<courses.length;i++){
        courses[i].updateCode(courses[i].copyCode);
        courses[i].updateTitle(courses[i].copyTitle);
        courses[i].updateLocation(courses[i].copyLocation);
        courses[i].alias = courses[i].copyAlias;
        courses[i].bindList = courses[i].copyBindList;
        courses[i].updtDisp();
        var couSlots = parseCSV(courses[i].bindList);
        var j;
        for(j=0;j<couSlots.length;j++){
            courses[i].bindCellByID(couSlots[j]);
        }
    }
    //for the lunch slots
    lunchSlot.bindList = lunchSlot.copyBindList;
    couSlots = parseCSV(lunchSlot.bindList);
    for(j=0;j<couSlots.length;j++){
        lunchSlot.bindCellByID(couSlots[j]);
    }
    //for the null slots
    nullSlot.bindList = nullSlot.copyBindList;
    couSlots = parseCSV(nullSlot.bindList);
    for(j=0;j<couSlots.length;j++){
        nullSlot.bindCellByID(couSlots[j]);
    }

    //reset optIdArray
    populateOptIdArray();
    
    document.getElementById("undoer").disabled = true;
    document.getElementById("saver").disabled = true;

    isEdited = false;
    if(masterKey.focussedCourse){
        masterKey.focussedCourse.bindEff2Cells();
    }
    
    eraseDetEditorMessages();
}

function formSqlUpdt(code,title,location,alias,bindList,metaData,courseID){//even this uses owneruniquserid
    return "UPDATE courses_safire SET CODE='" + code + "', TITLE='" + title + "', LOCATION='" + location + "', BINDLIST='" + bindList + "', ALIAS='" + alias + "', METADATA='" + metaData + "' WHERE COURSEID='" + courseID + "'";
}

function formSqlCrt(code,title,location,alias,bindList,courseID){
    return "INSERT INTO courses_safire VALUES ('" + code + "', '" + title + "', '" + bindList + "', '" + location + "', '||##::##||', '" + courseID + "', '" + alias + "', 'notify|__|')";
}

function formSqlDel(courseID){
    return "DELETE FROM courses_safire WHERE COURSEID='" + courseID + "' AND OWNERUNIQUSERID='";
}

function prevOptHoverEff(){
    var cpPrevOpt = masterKey.prevOpt;//this copying is done to eliminate scope problems
    if(cpPrevOpt){
        cpPrevOpt.isClicked = false;
        cpPrevOpt.style.backgroundColor = "#ffffff";
        if(cpPrevOpt.childNodes[0].nodeName == "IMG"){
            cpPrevOpt.onmouseover = function(evt){
                this.style.backgroundColor = "#E5FFE5";
                cpPrevOpt.childNodes[0].style.height = "10px";
            }
            cpPrevOpt.onmouseout = function(evt){
                this.style.backgroundColor = "#ffffff";
                cpPrevOpt.childNodes[0].style.height = "0px";
            }
        }
        else{
            cpPrevOpt.onmouseover = function(evt){
                this.style.backgroundColor = "#E5FFE5";
            }
            cpPrevOpt.onmouseout = function(evt){
                this.style.backgroundColor = "#ffffff";
            }
        }
    }
}

function populateOptIdArray(){
    optIdArray.splice(0, optIdArray.length);
    var couOnlyChildren = document.getElementById("couOnly").childNodes;
    var k;
    for(k=0;k<couOnlyChildren.length;k++){
        if(couOnlyChildren[k].nodeName == "DIV"){
            if(couOnlyChildren[k].childNodes[1]){
                optIdArray.push(couOnlyChildren[k].childNodes[1].id);
            }
        }
    }
}

function eraseDetEditorMessages(){
    if(document.getElementById("codeAlertBox1")){//this is needed to prevent leftover messages from appearing.
        document.getElementById("codeAlertBox1").style.display = "none";
    }
    if(document.getElementById("titleAlertBox1")){
        document.getElementById("titleAlertBox1").style.display = "none";
    }
    if(document.getElementById("locationAlertBox1")){
        document.getElementById("locationAlertBox1").style.display = "none";
    }
    if(document.getElementById("aliasAlertBox1")){
        document.getElementById("aliasAlertBox1").style.display = "none";
    }
}

function setInputOverLayText(inputID, inHTML){
    var overlayElement = document.getElementById(inputID + "OverLay");
    overlayElement.innerHTML = inHTML;
    if(inHTML == ""){
        overlayElement.style.display = "none";
    }
    else{
        overlayElement.style.display = "inline";
    }
}

//###################END OF SECTION######################///////



/*//////////////////////////
OBJECTS
////////////////////////////*/

function cLunch(){
    this.bindList = null;
    this.copyBindList = null;
    this.optID = "lunch";
    this.ID = "lunch";

    this.init = function(){
        currLunch.copyBindList = currLunch.bindList;
    }
    this.bindEff2Cells = function(){
        var arrayBindList = parseCSV(this.bindList);
        var i;
        for(i=0;i<arrayBindList.length;i++){
            document.getElementById(arrayBindList[i]).style.background = "url('../resources/websiteImgs/border.png') repeat-x";
        }
    }
    this.unbindEff2Cells = function(){
        var arrayBindList = parseCSV(this.bindList);
        var i;
        for(i=0;i<arrayBindList.length;i++){
            document.getElementById(arrayBindList[i]).style.background = "";
        }
    }
    this.bindEff2Cell = function(cellID){
        document.getElementById(cellID).style.background = "url('../resources/websiteImgs/border.png') repeat-x";
    }
    this.unbindEff2Cell = function(cellID){
        document.getElementById(cellID).style.background = "";
    }

    this.bindCellByID = function(ID){
        var givElement = document.getElementById(ID);
        this.setInHTML(givElement);
        givElement.style.cursor = "default";
        givElement.style.padding = "0px";
        givElement.onclick = function(evt){
            if(masterKey.focussedCourse){
                if(masterKey.focussedCourse.ID == currLunch.ID){//since the bindList is unique for a course
                    considerEdited();
                    masterKey.focussedCourse.unbindEff2Cell(ID);
                    nullSlot.bindList = nullSlot.bindList + givElement.id + ",";
                    nullSlot.bindCellByID(givElement.id);
                    currLunch.bindList = currLunch.bindList.replace(givElement.id + ",","");
                }
                else{
                    considerEdited();
                    masterKey.focussedCourse.bindEff2Cell(ID);
                    masterKey.focussedCourse.bindList = masterKey.focussedCourse.bindList + givElement.id + ",";
                    masterKey.focussedCourse.bindCellByID(givElement.id);
                    currLunch.bindList = currLunch.bindList.replace(givElement.id + ",","");
                }
            }
        };
    }
    this.bindOpt = function(){
        var Opt = document.getElementById("lunch");
        Opt.onmouseover = function(evt){
            this.style.backgroundColor = "#E5FFE5";
        }
        Opt.onmouseout = function(evt){
            this.style.backgroundColor = "#ffffff";
        }
        Opt.onclick = function(evt){
            if(!Opt.isClicked){
                masterKey.prevOpt = masterKey.focussedOpt;
                masterKey.focussedOpt = Opt;
                masterKey.prevCourse = masterKey.focussedCourse;
                masterKey.focussedCourse = currLunch;
            
                Opt.style.backgroundColor = "#8FFF8F";
                Opt.onmouseover = function(evt){
                    this.style.backgroundColor = "#8FFF8F";
                };
                Opt.onmouseout = function(evt){
                    this.style.backgroundColor = "#8FFF8F";
                };

                if(masterKey.prevCourse){
                    masterKey.prevCourse.unbindEff2Cells();
                }
                currLunch.bindEff2Cells();

                prevOptHoverEff();

                //the details editor part
                document.getElementById("detEditor").style.display = "none";
                
                document.getElementById("creator").style.display = "none";
                document.getElementById("saver").style.display = "inline";
                document.getElementById("undoer").style.display = "inline";
                document.getElementById("saver").disabled = "true";
                document.getElementById("undoer").disabled = "true";
                
                if(isEdited){
                    considerEdited();
                }


                document.getElementById("saver").onclick = function(evt){
                    document.getElementById("loadingInfo").style.display = "block";
                    saveAll();
                }

                document.getElementById("undoer").onclick = function(evt){
                    undoAll();
                }
                ///////////

                Opt.isClicked = true;
            }
        }
    }
    this.setInHTML = function(container){
        container.innerHTML = "<img id=\"lunchIcon\" alt=\"\" src=\"../resources/websiteImgs/lunchIcon.jpg\">";
    }

    var currLunch = this;//create alias that can be accessed deeper down
}



function cNullSlot(){
    this.bindList = "";
    this.copyBindList = null;
    var nullSLOT = this;
    this.init = function(){
        this.copyBindList = this.bindList;
    }
    this.bindCellByID = function(ID){
        var givElement = document.getElementById(ID);
        givElement.assoCourseID = ID;
        givElement.innerHTML = "";
        givElement.style.cursor = "default";
        givElement.onclick = function(evt){
            if(masterKey.focussedCourse){
                considerEdited();
                masterKey.focussedCourse.bindEff2Cell(this.id);
                masterKey.focussedCourse.bindList = masterKey.focussedCourse.bindList + this.id + ",";
                masterKey.focussedCourse.bindCellByID(this.id);
                nullSLOT.bindList = nullSLOT.bindList.replace(givElement.id + ",","");
            }
        }
    }
}



function cCourse(){
    this.bindList = null;
    this.nameTitle = "";
    this.code = "";
    this.location = "";
    this.alias = "";
    this.ID = null;
    this.copyTitle = "";
    this.copyCode = "";
    this.copyLocation = "";
    this.copyAlias = "";
    this.copyBindList = null;
    this.optID = null;
    this.isNew = false;
    this.metaData = null;
    
    this.updtDisp = function(){
        var couSlots = parseCSV(this.bindList);
        var i;
        for(i=0;i<couSlots.length;i++){
            this.setInHTML(document.getElementById(couSlots[i]));
        }
        this.setInHTML(document.getElementById(this.optID));
    }
    this.updateCode = function(inCode){
        this.code = inCode;
    }
    this.updateTitle = function(inTitle){
        this.nameTitle = inTitle;
    }
    this.updateLocation = function(inLocation){
        this.location = inLocation;
    }
    this.setInHTML = function(container){
        if(this.alias == ""){
            container.innerHTML = this.code; 
        }
        else{
            container.innerHTML = this.alias;
        }
    }
    this.bindEff2Cells = function(){
        var arrayBindList = parseCSV(this.bindList);
        var i;
        for(i=0;i<arrayBindList.length;i++){
            document.getElementById(arrayBindList[i]).style.background = "url('../resources/websiteImgs/border.png') repeat-x";
        }
    }
    this.unbindEff2Cells = function(){
        var arrayBindList = parseCSV(this.bindList);
        var i;
        for(i=0;i<arrayBindList.length;i++){
            document.getElementById(arrayBindList[i]).style.background = "";
        }
    }
    this.bindEff2Cell = function(cellID){
        document.getElementById(cellID).style.background = "url('../resources/websiteImgs/border.png') repeat-x";
    }
    this.unbindEff2Cell = function(cellID){
        document.getElementById(cellID).style.background = "";
    }

    var currCourse = this;//create alias that can be accessed deeper down

    this.init = function(){
        currCourse.copyCode = currCourse.code;
        currCourse.copyTitle = currCourse.nameTitle;
        currCourse.copyLocation = currCourse.location;
        currCourse.copyBindList = currCourse.bindList;
        currCourse.copyAlias = currCourse.alias;
    }
    this.fDestroy = function(){
        var k,wasMainCourse = false;
        if(masterKey.focussedCourse){
            if(currCourse.ID == masterKey.focussedCourse.ID){
                currCourse.unbindEff2Cells();
                document.getElementById("detEditor").style.display = "none";
                wasMainCourse = true;
            }
        }
        considerEdited();

        //remove optId form the optId array
        var i,delIndex;
        for(i=0;i<optIdArray.length;i++){
            if(optIdArray[i] == currCourse.optID){
                delIndex = i;
            }
        }
        optIdArray.splice(delIndex, 1);

        var slots = parseCSV(currCourse.bindList);
        for(i=0;i<slots.length;i++){
            nullSlot.bindCellByID(slots[i]);
        }
        nullSlot.bindList = nullSlot.bindList + currCourse.bindList;
        if(!currCourse.isNew){
            currCourse.bindList = "";
            document.getElementById(currCourse.optID).parentNode.style.display = 'none';
            i = delCourses.length;
            delCourses[i] = currCourse;
            for(k=0;k<courses.length;k++){
                if(courses[k].ID == currCourse.ID){
                    delIndex = k;
                }
            }
            courses.splice(delIndex, 1);
        }
        else{
            couOnly.removeChild(document.getElementById(currCourse.optID).parentNode);
            for(k=0;k<newCourses.length;k++){
                if(newCourses[k].ID == currCourse.ID){
                    delIndex = k;
                }
            }
            newCourses.splice(delIndex, 1);
            if(wasMainCourse){
                masterKey.focussedCourse = null;
            }
        }
    }
    this.bindCellByID = function(ID){
        var givElement = document.getElementById(ID);
        this.setInHTML(givElement);
        givElement.style.cursor = "default";
        givElement.onclick = function(evt){
            if(masterKey.focussedCourse){
                considerEdited();
                if(masterKey.focussedCourse.ID == currCourse.ID){
                    masterKey.focussedCourse.unbindEff2Cell(ID);
                    nullSlot.bindList = nullSlot.bindList + givElement.id + ",";
                    nullSlot.bindCellByID(givElement.id);
                    currCourse.bindList = currCourse.bindList.replace(givElement.id + ",","");
                }
                else{
                    masterKey.focussedCourse.bindEff2Cell(ID);
                    masterKey.focussedCourse.bindList = masterKey.focussedCourse.bindList + givElement.id + ",";
                    masterKey.focussedCourse.bindCellByID(givElement.id);
                    currCourse.bindList = currCourse.bindList.replace(givElement.id + ",","");
                }
            }
        }
    }
    this.bindOptByID = function(ID){
        var Opt = document.getElementById(ID);
        this.setInHTML(Opt);
        Opt.parentNode.onmouseover = function(evt){
            this.style.backgroundColor = "#E5FFE5";
            Opt.parentNode.childNodes[0].style.height = "10px";
        };
        Opt.parentNode.onmouseout = function(evt){
            this.style.backgroundColor = "#ffffff";
            Opt.parentNode.childNodes[0].style.height = "0px";
        };

        Opt.parentNode.onclick = function(evt){
            if(!Opt.parentNode.isClicked){
                masterKey.prevOpt = masterKey.focussedOpt;
                masterKey.focussedOpt = Opt.parentNode;
                masterKey.prevCourse = masterKey.focussedCourse;
                masterKey.focussedCourse = currCourse;

                Opt.parentNode.onmouseover = function(evt){
                    Opt.parentNode.style.backgroundColor = "#8FFF8F";
                    Opt.parentNode.childNodes[0].style.height = "10px";
                }
                Opt.parentNode.onmouseout = function(evt){
                    Opt.parentNode.style.backgroundColor = "#8FFF8F";
                    Opt.parentNode.childNodes[0].style.height = "0px";
                }
                Opt.parentNode.style.backgroundColor = "#8FFF8F";

                if(masterKey.prevCourse){
                    masterKey.prevCourse.unbindEff2Cells();
                }
                currCourse.bindEff2Cells();

                prevOptHoverEff();
            
                //the details editor part///////
                var alias = document.getElementById("alias");
                document.getElementById("detEditor").style.display = "table";
                document.getElementById("code").value = currCourse.code;
                document.getElementById("title").value = currCourse.nameTitle;
                document.getElementById("location").value = currCourse.location;
                alias.value = currCourse.alias;
                
                sanitize(document.getElementById("title"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,32}$/);
                sanitize(document.getElementById("code"),/[^\w]|\(|\)|_/g,/^.{4,7}$/);
                sanitize(document.getElementById("location"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,17}$/);
                sanitize(document.getElementById("alias"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{0,8}$/);
                
                //background text for alias
                if(alias.value == ""){
                    setInputOverLayText("alias","optional");
                }
                else{
                    setInputOverLayText("alias","");
                }
                setInputOverLayText("code","");
                setInputOverLayText("title","");
                setInputOverLayText("location","");
                
                //background text for all other fields if slotted
                var IDinString = String(currCourse.ID);
                var slotInf = IDinString.split("___")[0] + " slot's ";
                if(currCourse.metaData.search("slotted\\|__\\|") != -1){
                    if(document.getElementById("code").value == ""){
                        setInputOverLayText("code", slotInf + "Code");
                    }
                    
                    if(document.getElementById("title").value == ""){
                        setInputOverLayText("title", slotInf + "Title");
                    }
                    
                    if(document.getElementById("location").value == ""){
                        setInputOverLayText("location", slotInf + "Location");
                    }
                }
                
                document.getElementById("creator").style.display = "none";
                document.getElementById("saver").style.display = "inline";
                document.getElementById("undoer").style.display = "inline";
                document.getElementById("saver").disabled = "true";
                document.getElementById("undoer").disabled = "true";
                
                if(isEdited){
                    considerEdited();
                }
                
                document.getElementById("code").onfocus = function(evt){
                    considerEdited();
                    if(this.value == ""){
                        setInputOverLayText("code","");
                    }
                    timedFunct2 = setInterval(function(){
                        sanitize(document.getElementById("code"),/[^\w]|\(|\)|_/g,/^.{4,7}$/);
                        currCourse.updateCode(document.getElementById("code").value);
                        currCourse.updtDisp();
                    },5);
                }
                document.getElementById("title").onfocus = function(evt){
                    considerEdited();
                    if(this.value == ""){
                        setInputOverLayText("title","");
                    }
                    timedFunct2 = setInterval(function(){
                        sanitize(document.getElementById("title"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,32}$/);
                    },5);
                }
                document.getElementById("location").onfocus = function(evt){
                    considerEdited();
                    
                    if(this.value == ""){
                        setInputOverLayText("location","");
                    }
                    timedFunct2 = setInterval(function(){
                        sanitize(document.getElementById("location"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,17}$/);
                    },1);
                }
                document.getElementById("alias").onfocus = function(evt){
                    considerEdited();
                    
                    if(this.value == ""){
                        setInputOverLayText("alias","");
                    }
                    
                    timedFunct2 = setInterval(function(){
                        sanitize(document.getElementById("alias"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{0,8}$/);
                        currCourse.alias = document.getElementById("alias").value;
                        currCourse.updtDisp();
                    },1);
                }

                document.getElementById("title").onblur = function(evt){
                    currCourse.updateTitle(document.getElementById("title").value);
                    
                    if(currCourse.metaData.search("slotted\\|__\\|") != -1){
                        if(this.value == ""){
                            setInputOverLayText("title",slotInf + "Title");
                        }
                    }
    
                    clearInterval(timedFunct2);
                }
                document.getElementById("alias").onblur = function(evt){
                    if(this.value == ""){
                        setInputOverLayText("alias","optional");
                    }
    
                    clearInterval(timedFunct2);
                }
                document.getElementById("code").onblur = function(evt){
                    if(currCourse.metaData.search("slotted\\|__\\|") != -1){
                        if(this.value == ""){
                            setInputOverLayText("code",slotInf + "Code");
                        }
                    }
                    
                    this.value = this.value.toUpperCase();
                    currCourse.updateCode(document.getElementById("code").value);
                    currCourse.updtDisp();
                    
                    clearInterval(timedFunct2);
                }
                document.getElementById("location").onblur = function(evt){
                    currCourse.updateLocation(document.getElementById("location").value);
                    
                    if(currCourse.metaData.search("slotted\\|__\\|") != -1){
                        if(this.value == ""){
                            setInputOverLayText("location",slotInf + "Location");
                        }
                    }
    
                    clearInterval(timedFunct2);
                }
                
                document.getElementById("saver").onclick = function(evt){
                    document.getElementById("loadingInfo").style.display = "block";
                    saveAll();
                }
                document.getElementById("undoer").onclick = function(evt){
                    undoAll();
                    var alias = document.getElementById("alias");
                    document.getElementById("code").value = currCourse.copyCode;
                    document.getElementById("title").value = currCourse.copyTitle;
                    document.getElementById("location").value = currCourse.copyLocation;
                    alias.value = currCourse.copyAlias;
                    
                    //background text for alias
                    if(alias.value == ""){
                        setInputOverLayText("alias","optional");
                    }
                    else{
                        setInputOverLayText("alias","");
                    }
                
                    //background text for all other fields if slotted
                    IDinString = String(currCourse.ID);
                    //you need the backslashes because the string will get conv. to a regex and in regex, "|" is a spl. char.
                    if(currCourse.metaData.search("slotted\\|__\\|") != -1){
                        var slotInf = IDinString.split("___")[0] + " slot's ";
                        
                        //sanitation is done here to alert the user that the fields don't have a proper length
                        sanitize(document.getElementById("title"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,32}$/);
                        sanitize(document.getElementById("code"),/[^\w]|\(|\)|_/g,/^.{4,7}$/);
                        sanitize(document.getElementById("location"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{3,17}$/);
                        sanitize(document.getElementById("alias"),/[^(\w)( )(!)(\-)(,)(\.)]|\(|\)|_/g,/^.{0,8}$/);
                        
                        //I'm not checking if the text box is blank since the fact that it's slotted implies that it's blank
                        setInputOverLayText("code", slotInf + "Code");
                        setInputOverLayText("title", slotInf + "Title");
                        setInputOverLayText("location", slotInf + "Location");
                    }
                }
                ///////////

                Opt.parentNode.isClicked = true;
            }
        }
        //for the deleter
        Opt.parentNode.childNodes[0].onclick = function(evt){
            //the following piece of code fights against browser incompatibilities. It assumes that any browser that supports window.event supports cancelBubble too
            if(window.event){
                evt = window.event;
                evt.cancelBubble = true;
            }
            else{
                evt.stopPropagation();
            }
            
            currCourse.fDestroy();
            //to simulate mouseout  event of currOpt and mouse over events of the next Opt
            if(!currCourse.isNew){
                fireEvent(document.getElementById(currCourse.optID).parentNode, "mouseout");
            }
            var scrolled1 = getScrolledLen();
            var nextOptID = Math.ceil((evt.clientY + scrolled1[1] - 419 + document.getElementById("couOpts").scrollTop)/37) - 1;
            if(optIdArray[nextOptID]){
                fireEvent(document.getElementById(optIdArray[nextOptID]).parentNode, "mouseover");
            }
        }
    }
}



function MasterKey(){
    this.focussedCourse = null;
    this.focussedOpt = null;
    this.prevOpt = null;
    this.prevCourse = null;
}
//###################END OF SECTION######################///////