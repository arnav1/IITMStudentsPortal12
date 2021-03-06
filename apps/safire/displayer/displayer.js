//######## get the required elements from the DOM

var tableCont = document.getElementById('tableCont');
var rBlock = document.getElementById("rBlock");
var latestNoticeCont = document.getElementById("latestNoticeCont");
var inBoxCont = document.getElementById("latestNoticeCont");
var scratchPad = document.getElementById("scratchPad");
var noteSaving = document.getElementById("noteSaving");
var sPadInstr = document.getElementById("sPadInstr");

//###################END OF SECTION######################///////




//######## initialisation

var latestNoticeNo = 0,currNoticeNo = 0;
var couGloAliasText = "";
var checkNewNotices = null;
var canLoadNots = false;
var haveMoreNots = true;
var haveToMaxNots = false;
var areNotsMaximised = false;
var isSingleCourse = false;
var currPrinting = false;
var canCheckNewNotices = true;
var globalTimedFunct1,globalTimedFunct2;
var scratchPadPrevText = null;
var isNoteSaving = false;
var isEditingNote = false;

var usersMetaData = "";//this will be set in the get courses function itself
var pageMinWidth = 1005;
var pageMinHeight = 610;

resizes(pageMinWidth,pageMinHeight);//remember that the body is obtained by the resizes function itself.
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

//to get the courses a person is enrolled in for the notices and couGloAliasText
var u;
courseCodes = ""
for(u=0;u<courses.length;u++){
    couGloAliasText += ((courses[u].code + "=courses[") + u + "];");
    courseCodes += (courses[u].code + ",");
}

//printing the notices
if(courses.length == 0 || courses[0].code == ""){
    cantUseNoticeBoard(document.getElementById("latestNoticeCont"), 8, 300);
}
else{
    eval(couGloAliasText);
    loadDispNotices(courseCodes,5);
    document.getElementById("noticeRefresher").onclick = function(evt){
        loadDispNotices(courseCodes,5);
    }
    gotNewNotices(courseCodes,document.getElementById("newNotice"));
    resizesSlot2 = function(){
        dispNotsCorr();
    }
}

//filling in the user's scratchpad
fillScratchPad();

var resources = new Array("Delete-icon.png","printer_2");
loadResources(resources);

//###################END OF SECTION######################///////




//######## Callback functions

window.onbeforeunload = function(evt){
    if(isNoteSaving){
        return "Your note is still saving. Are you sure you want to leave the page?";
    }
    else if(scratchPadPrevText != scratchPad.value){
        if(scratchPad.value.length > 700){
            return "Your note hasn't been saved because it's longer than the permissible limit. You can either stay on the page, reduce the length of the note, and save it, or throw away any changes you've made to the note, and leave this page.";
        }
        else{
            return "There are some unsaved changes to your note. If you leave the page now, they will not be saved. If you stay on the page for a few more seconds, they will be saved.";
        }
    }
}

window.onresize = function(evt){
    resizes(pageMinWidth,pageMinHeight);
    resizesSlot1();
    resizesSlot2();
    resizesSlot3();
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

document.getElementById("expander").onclick = function(evt){
    expandNoticeBoard();
}

scratchPad.onfocus = function(evt){
    isEditingNote = true;
    
    sPadInstr.style.display = "none";
    noteSaving.style.display = "none";
    
    var noteLength;
    if(!scratchPadPrevText){
        scratchPadPrevText = scratchPad.value;
    }
    var maxLenNotice = document.getElementById("scratchPadNotice");
    maxLenNotice.style.display = "block";
    noteSaving.style.color = "#999999";
    globalTimedFunct1 = setInterval(function(){
        noteLength = scratchPad.value.length;
        maxLenNotice.innerHTML = "Max. 700 Characters, Currently " + noteLength + " Characters";
        if(noteLength > 700){
            maxLenNotice.style.color = "#ba0d0d";
            noteSaving.innerHTML = "Reduce note length to save note";//change the position of the p element when you change the text.
            noteSaving.style.left = "190px";
        }
        else{
            maxLenNotice.style.color = "#999999";
            noteSaving.innerHTML = "Saving...";
            noteSaving.style.left = "300px";
        }
    },5);
    globalTimedFunct2 = setInterval(function(){
        noteLength = scratchPad.value.length;
        noteSaving.style.display = "block";
        setTimeout(function(){
            if(noteLength > 700 || scratchPadPrevText == scratchPad.value){
                noteSaving.style.display = "none";
            }
            else{
                //hide the saving note when you're done saving the note in the database, in the ajax readystatechange code
                saveNote();
            }
        },1500);
    },15000);
}
scratchPad.onblur = function(evt){
    isEditingNote = false;
    
    var maxLenNotice = document.getElementById("scratchPadNotice");
    maxLenNotice.style.display = "none";
    noteSaving.style.display = "block";
    if(scratchPadPrevText == scratchPad.value){
        noteSaving.style.display = "none";
    }
    else if(!(scratchPad.value.length > 700)){
        //hide the saving note when you're done saving the note in the database, in the ajax readystatechange code
        saveNote();
    }
    else{
        noteSaving.style.color = "#ba0d0d";
    }
    clearInterval(globalTimedFunct1);
    clearInterval(globalTimedFunct2);
    
    if(scratchPad.value == ""){
        sPadInstr.style.display = "block";
    }
}

sPadInstr.onclick = function(evt){
    scratchPad.focus();
}

//###################END OF SECTION######################///////



/*//////////////////////////
FUNCTIONS
////////////////////////////*/

function contentSizeUp(){
    var bodyHeight = Number(document.getElementById("footer").style.top.replace("px",""));
    var bodyWidth = Number(document.body.style.width.replace("px",""));
    rBlock.style.height = (bodyHeight - 320 - 95) + "px";
    
    setHaveToMaxNots(670,bodyWidth);
    
    latestNoticeCont.style.height = (bodyHeight - 450) + "px";
    scratchPad.style.height = (bodyHeight - 490) + "px";
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

//for the notice board

function dispRecpNewRow(namesCSV,rollNoCSV,tbodyID){
    var i,newRow,j,tableCell,lastOccCell;
    var names = namesCSV.split(",");
    var rollNos = rollNoCSV.split(",");
    names.pop();
    var noRows = Math.ceil(names.length/3);
    for(i=0;i<(noRows-1);i++){
        newRow = document.getElementById(tbodyID).insertRow(-1);
        for(j=0;j<3;j++){
            tableCell = document.createElement("td");
            tableCell.innerHTML = names[i*3 + j];
            tableCell.title = rollNos[i*3 + j];
            newRow.appendChild(tableCell);
        }
    }
    //last row
    newRow = document.getElementById(tbodyID).insertRow(-1);
    for(j=0;j<3;j++){
        tableCell = document.createElement("td");
        if(names[(noRows-1)*3 + j]){
            tableCell.innerHTML = names[(noRows-1)*3 + j];
            tableCell.title = rollNos[(noRows-1)*3 + j];
            lastOccCell = tableCell;
        }
        else{
            tableCell.innerHTML = "";
            tableCell.style.borderBottom = "none";
            tableCell.style.borderLeft = "none";
            lastOccCell.style.borderRight = "#eeeded solid 1px";
        }
        newRow.appendChild(tableCell);
    }
}

function expandNoticeBoard(){
    clearInterval(checkNewNotices);
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("mainPageNoticeBoard").style.display = "block";
    document.getElementById("mainPageNoticeBoard").innerHTML = "<span id=\"noticeHead1\">Notice Board</span><div id=\"noticeControl1\"><img id=\"newNotice1\" src=\"../resources/websiteImgs/newNotices.png\" title=\"New Notice\"><div id=\"noticeRefresher1\" class=\"noticeControlOpts\" title=\"Refresh\"></div><div id=\"minimiser\" class=\"noticeControlOpts\" title=\"Minimise\"></div><div id=\"nbSettings\" class=\"noticeControlOpts\" title=\"Settings\"></div><div id=\"nbSettingsBox\"><div id=\"nbSettingsBoxHeader\">Notice Board settings</div><div id=\"emailNotif\" class=\"nbSettingsPart\"><p id=\"emailNotifText\">Email notifications currently turned on</p><input type=\"button\" id=\"emailNotifButt\" value=\"Turn if off\"><p id=\"reminderEmail\">Remember to add Safire to your safe sender's list</p></div></div></div><div id=\"noticeBoard\"><div id=\"sender\"><div id=\"senderHeader\" class=\"noticeBoardHeaders\">Post a notice to <div class=\"couDropDown\"><div id=\"senderDropdownCont\" class=\"dropDownCont\"><div class=\"currCou\"> <div class=\"pointDown\"></div></div><div class=\"dropdownHelp\">Choose an option below</div></div></div>'s notice board:</div><div id=\"senderCont\"><textarea id=\"poster\"></textarea><p id=\"lengthPost\">Max. 200 Characters, Currently 0 Characters</p><input type=\"button\" id=\"posterButt\" value=\"Post\"><img id=\"sendingMessage\" src=\"../resources/websiteImgs/loading.gif\"><div id=\"sendingMessageText\"></div></div><div id=\"recpListHeader\" class=\"noticeBoardHeaders\">The above notice will be seen by the students listed below:</div><div id=\"recpListCont\"><table id=\"recipients\"><tbody id=\"recpBody\"></tbody></table></div></div><div id=\"inBox\"><div id=\"inBoxHeader\" class=\"noticeBoardHeaders\">Notices from <div class=\"couDropDown\"><div id=\"inboxDropdownCont\" class=\"dropDownCont\"><div class=\"currCou\"> <div class=\"pointDown\"></div></div><div class=\"dropdownHelp\">Choose an option below</div><div id=\"inboxExtraCourse\" class=\"couDropDownOpt\">All the courses</div></div></div>'s notice board:</div><div id=\"inBoxCont\"></div></div></div>";
    initNoticeBoard();
}

function initNoticeBoard(){
    //initialisation
    var i,courseOptA,courseOptB,senderCourseOpt,inboxCourseOpt,timedFunct;
    var inboxDropdownCont = document.getElementById("inboxDropdownCont");
    var senderDropdownCont = document.getElementById("senderDropdownCont");
    var inboxExtraCourse = document.getElementById("inboxExtraCourse");
    var sendingMessage = document.getElementById("sendingMessage");
    var sendingMessageText = document.getElementById("sendingMessageText");
    var posterCont = document.getElementById("poster");
    var maxLenNotice = document.getElementById("lengthPost");
    var posterButt = document.getElementById("posterButt");
    var nbSettings = document.getElementById("nbSettings");
    var nbSettingsBox = document.getElementById("nbSettingsBox");
    
    noticeBoard = document.getElementById("noticeBoard");
    inBoxCont = document.getElementById("inBoxCont");
    recpListCont = document.getElementById("recpListCont");
    
    inboxExtraCourse.courseCode = courseCodes;
    
    var senderDropdownCont_isDropped = false;
    var inboxDropdownCont_isDropped = false;
    var senderDropdownCont_canCompr = false;//just so that that extra code doesn't have to be executed
    var inboxDropdownCont_canCompr = false;
    var nbSettings_canCompr = false;
    
    noticeBoardSizeUp();
    resizesSlot1 = function(){
        noticeBoardSizeUp();
    }
    
    //imp. callback function
    document.getElementById("minimiser").onclick = function(evt){
        clearInterval(checkNewNotices);
        isSingleCourse = false;
        
        document.getElementById("mainPageNoticeBoard").innerHTML = "";
        document.getElementById("mainPageNoticeBoard").style.display = "none";
        document.getElementById("mainPage").style.display = "block";
        
        resizes(pageMinWidth,pageMinHeight);
        contentSizeUp();
        
        resizesSlot1 = function(){
            contentSizeUp();
        }
        
        inBoxCont = document.getElementById("latestNoticeCont");
        
        //print the minimised notices here again
        if(courses.length == 0 || courses[0].code == ""){
            cantUseNoticeBoard(document.getElementById("latestNoticeCont"), 8, 300);
        }
        else{
            loadDispNotices(courseCodes,5);
            document.getElementById("noticeRefresher").onclick = function(evt){
                loadDispNotices(courseCodes,5);
            }
            gotNewNotices(courseCodes,document.getElementById("newNotice"));
        }
    }
    
    if(courses.length == 0 || courses[0].code == ""){
        cantUseNoticeBoard(document.getElementById("noticeBoard"), 200, 300);
    }
    else{
        //for nbSettings
        if(courses[0].metaData.search("notify\\|__\\|") != -1){
            document.getElementById("emailNotifText").innerHTML = "Email notifications are currently turned on";
            document.getElementById("emailNotifButt").value = "Turn it off";
            document.getElementById("reminderEmail").style.display = "block";
        }
        else{
            document.getElementById("emailNotifText").innerHTML = "Email notifications are currently turned off";
            document.getElementById("emailNotifButt").value = "Turn it on";
            document.getElementById("reminderEmail").style.display = "none";
        }
        
        //for the dropdown list - iterator through every course
        for(i=0;i<courses.length;i++){
            courseOptA = document.createElement("div");
            courseOptA.id = "courseOpt" + i;
            courseOptA.className = "couDropDownOpt";
            courseOptA.courseCode = courses[i].code;
            courseOptA.innerHTML = courses[i].displayTitle;
        
            courseOptB = document.createElement("div");//you can't use append twice on the same object
            courseOptB.id = "courseOpt" + i;
            courseOptB.className = "couDropDownOpt";
            courseOptB.innerHTML = courseOptA.innerHTML;
            courseOptB.courseCode = courses[i].code;
        
            courseOptB.onclick = function(evt){
                if(senderCourseOpt){
                    senderCourseOpt.onmouseover = function(evt){
                        this.style.backgroundColor = "#e5ffe5";
                    }
                    senderCourseOpt.onmouseout = function(evt){
                        this.style.backgroundColor = "#ffffff";
                    }
                    senderCourseOpt.style.backgroundColor = "#ffffff";
                }
                senderCourseOpt = this;
            
                this.onmouseover = function(evt){
                    this.style.backgroundColor = "#8fff8f";
                }
                this.onmouseout = function(evt){
                    this.style.backgroundColor = "#8fff8f";
                }
                this.style.backgroundColor = "#8fff8f";
                
                document.getElementById("recpBody").innerHTML = "";
                addLoadiMess(document.getElementById("recpListCont"),"recpListLoading","Loading names...");
                printRecpNames(senderCourseOpt.courseCode);

                this.parentNode.firstChild.firstChild.nodeValue = this.innerHTML;
            }
            courseOptA.onclick = function(evt){
                inBoxCont.innerHTML = "";
                inBoxCont.scrollTop = 0;
                addLoadiMess(inBoxCont,"noticesLoading","Loading notices...");
                
                haveMoreNots = true;
                isSingleCourse = true;
                if(inboxCourseOpt){
                    inboxCourseOpt.onmouseover = function(evt){
                        this.style.backgroundColor = "#e5ffe5";
                    }
                    inboxCourseOpt.onmouseout = function(evt){
                        this.style.backgroundColor = "#ffffff";
                    }
                    inboxCourseOpt.style.backgroundColor = "#ffffff";
                }
                inboxCourseOpt = this;
            
                this.onmouseover = function(evt){
                    this.style.backgroundColor = "#8fff8f";
                }
                this.onmouseout = function(evt){
                    this.style.backgroundColor = "#8fff8f";
                }
                this.style.backgroundColor = "#8fff8f";
            
                this.parentNode.firstChild.firstChild.nodeValue = this.innerHTML;
            
                notices = new Array();
                printNotices(inboxCourseOpt.courseCode,10,currNoticeNo + 1);
            }
        
        
            inboxDropdownCont.appendChild(courseOptA);
            senderDropdownCont.appendChild(courseOptB);
        }
        inboxExtraCourse.onclick = function(evt){
            inBoxCont.innerHTML = "";
            inBoxCont.scrollTop = 0;
            addLoadiMess(inBoxCont,"noticesLoading","Loading notices...");
            
            haveMoreNots = true;
            isSingleCourse = false;
            if(inboxCourseOpt){
                inboxCourseOpt.onmouseover = function(evt){
                    this.style.backgroundColor = "#e5ffe5";
                }
                inboxCourseOpt.onmouseout = function(evt){
                    this.style.backgroundColor = "#ffffff";
                }
                inboxCourseOpt.style.backgroundColor = "#ffffff";
            }
            inboxCourseOpt = this;
            
            this.onmouseover = function(evt){
                this.style.backgroundColor = "#8fff8f";
            }
            this.onmouseout = function(evt){
                this.style.backgroundColor = "#8fff8f";
            }
            this.style.backgroundColor = "#8fff8f";
        
            this.parentNode.firstChild.firstChild.nodeValue = this.innerHTML;
            
            notices = new Array();
            canCheckNewNotices = false;//helps keep the new notices icon turned off.
            printNoticesCallBackFn = function(){
                canCheckNewNotices = true;
                printNoticesCallBackFn = function(){}
            }
            printNotices(inboxCourseOpt.courseCode,10,1000000);
        }
    
        fireEvent(inboxDropdownCont, "click");
        fireEvent(inboxExtraCourse,"click");
        fireEvent(senderDropdownCont, "click");
        fireEvent(courseOptB,"click");
        gotNewNotices(courseCodes,document.getElementById("newNotice1"));
    
        //callback functions
        document.body.onclick = function(evt){
            clickBody1();
            clickBody2();
        }
        document.getElementById("posterButt").onclick = function(evt){
            if(posterCont.value == ""){
                alert("Your notice has no content!");
            }
            else{
                maxLenNotice.style.color = "#dedddd";
                sendingMessage.style.display = "inline";
                sendingMessageText.innerHTML = "Posting...";
                posterCont.disabled = true;
                this.disabled = true;
        
                var request = createRequest();
                if (request==null){
                    alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
                }
                else{
                    var url= "../resources/ajax/postNotice.php";
                    request.onreadystatechange = function(evt){
                        if(request.readyState == 4){
                            if(request.status == 200){
                                posterButt.disabled = false;
                                posterCont.disabled = false;
                                sendingMessage.style.display = "none";
                                if(request.responseText == ""){
                                    fireEvent(inboxDropdownCont, "click");
                                    fireEvent(inboxExtraCourse,"click");
                                    maxLenNotice.style.color = "#999999";
                                    posterCont.value = "";
                                    maxLenNotice.innerHTML = "Max. 200 Characters, Currently 0 Characters";
                                }
                                sendingMessageText.innerHTML = request.responseText;//this thing treacherously didn't work on spans so I had to resort to divs and inline-box displays.
                            }
                        }
                    }
                    request.open("POST",url,true);
                    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    var posterContent = posterCont.value.replace(/(\r\n|\n|\r)/gm," ");
                    posterContent = encodeURIComponent(posterContent);
                    request.send("noticeCont=" + posterContent + "&noticeCou=" + senderCourseOpt.courseCode);
                }
            }
        }
        senderDropdownCont.onmouseover = function(evt){
            this.firstChild.firstChild.nextSibling.style.backgroundImage = "url('../resources/websiteImgs/pointDown1.png')";
        }
        senderDropdownCont.onmouseout = function(evt){
            this.firstChild.firstChild.nextSibling.style.backgroundImage = "url('../resources/websiteImgs/pointDown.png')";
        }
        inboxDropdownCont.onmouseover = function(evt){
            this.firstChild.firstChild.nextSibling.style.backgroundImage = "url('../resources/websiteImgs/pointDown1.png')";
        }
        inboxDropdownCont.onmouseout = function(evt){
            this.firstChild.firstChild.nextSibling.style.backgroundImage = "url('../resources/websiteImgs/pointDown.png')";
        }
        posterCont.onfocus = function(evt){
            sendingMessageText.innerHTML = "";
            var postLength;
            timedFunct = setInterval(function(){
                postLength = posterCont.value.length;
                maxLenNotice.innerHTML = "Max. 200 Characters, Currently " + postLength + " Characters";
                if(postLength > 200){
                    maxLenNotice.style.color = "#ba0d0d";
                    posterButt.disabled = true;
                }
                else{
                    maxLenNotice.style.color = "#999999";
                    posterButt.disabled = false;
                }
            },5);
        }
        posterCont.onblur = function(evt){
            clearInterval(timedFunct);
        }
        inBoxCont.onscroll = function(evt){
            setNotsCanLoad();
            if(canLoadNots && !currPrinting){
                var startNo,lastIndex;
                lastIndex = notices.length - 1;
                startNo = notices[lastIndex].noticeOrder;
                printNotices(inboxCourseOpt.courseCode,5,startNo);
            }
        }
        document.getElementById("noticeRefresher1").onclick = function(evt){
            fireEvent(inboxDropdownCont, "click");
            fireEvent(inboxExtraCourse,"click");
        }
        nbSettings.onclick = function(evt){
            nbSettings_canCompr = false;
            nbSettingsBox.style.display = "block";
            clickBody1 = function(){
                if(nbSettings_canCompr){
                    nbSettingsBox.style.display = "none";
                }
                else{
                    nbSettings_canCompr = true;
                }
            }
        }
        nbSettingsBox.onclick = function(evt){
            if(window.event){
                evt = window.event;
                evt.cancelBubble = true;
            }
            else{
                evt.stopPropagation();
            }
        }
        document.getElementById("emailNotifButt").onclick = function(evt){
            document.getElementById("emailNotifButt").value = "Wait...";
            document.getElementById("emailNotifButt").disabled = true;
            var courseIDlist = "";
            var i,metaDataCSV = "";
            if(courses[0].metaData.search("notify\\|__\\|") != -1){
                for(i=0;i<courses.length;i++){
                    courses[i].metaData = courses[i].metaData.replace("notify|__|", "");
                }
            }
            else{
                for(i=0;i<courses.length;i++){
                    courses[i].metaData = courses[i].metaData + "notify|__|";
                }
            }
            for(i=0;i<courses.length;i++){
                courseIDlist += (courses[i].ID + ",");
                metaDataCSV += (courses[i].metaData + ",");
            }
            
            var request1 = createRequest();
            if (request1==null){
                alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
            }
            else{
                var url1= "../resources/ajax/changeCouMetaData.php";
                request1.onreadystatechange = function(evt){
                    if(request1.readyState == 4){
                        if(request1.status == 200){
                            if(courses[0].metaData.search("notify\\|__\\|") != -1){
                                document.getElementById("emailNotifText").innerHTML = "Email notifications are currently turned on";
                                document.getElementById("emailNotifButt").value = "Turn it off";
                                document.getElementById("reminderEmail").style.display = "block";
                            }
                            else{
                                document.getElementById("emailNotifText").innerHTML = "Email notifications are currently turned off";
                                document.getElementById("emailNotifButt").value = "Turn it on";
                                document.getElementById("reminderEmail").style.display = "none";
                            }
                            document.getElementById("emailNotifButt").disabled = false;
                        }
                    }
                }
                request1.open("POST",url1,true);
                request1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request1.send("courseIDlist=" + courseIDlist + "&metaDataCSV=" + metaDataCSV);
            }
        }
        
        //for the drop down lists
        senderDropdownCont.onclick = function(evt){
            if(senderDropdownCont_isDropped){
                senderDropdownCont_canCompr = true;
            }
            else{
                senderDropdownCont_canCompr = false;
            }
            if(inboxDropdownCont_isDropped){
                inboxDropdownCont_canCompr = true;
            }
        
            this.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
            this.style.borderColor = "#999999";
            this.style.height = "auto";
            senderDropdownCont_isDropped = true;
        }
        inboxDropdownCont.onclick = function(evt){
            if(inboxDropdownCont_isDropped){
                inboxDropdownCont_canCompr = true;
            }
            else{
                inboxDropdownCont_canCompr = false;
            }
            if(senderDropdownCont_isDropped){
                senderDropdownCont_canCompr = true;
            }
        
            this.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
            this.style.borderColor = "#999999";
            this.style.height = "auto";
            inboxDropdownCont_isDropped = true;
        }
        clickBody2 = function(){
            if(inboxDropdownCont_canCompr){
                inboxDropdownCont.style.boxShadow = "none";
                inboxDropdownCont.style.borderColor = "#d8d9d8";
                inboxDropdownCont.style.height = "25px";
                inboxDropdownCont_isDropped = false;
            }
        
            if(senderDropdownCont_canCompr){
                senderDropdownCont.style.boxShadow = "none";
                senderDropdownCont.style.borderColor = "#d8d9d8";
                senderDropdownCont.style.height = "25px";
                senderDropdownCont_isDropped = false;
            }
        
            senderDropdownCont_canCompr = true;
            inboxDropdownCont_canCompr = true;
        }
    }
}

function noticeBoardSizeUp(){
    var bodyHeight = Number(document.getElementById("footer").style.top.replace("px",""));
    var bodyWidth = Number(document.body.style.width.replace("px",""));
    noticeBoard.style.height = (bodyHeight - 66) + "px";
    inBoxCont.style.height = (bodyHeight - 151) + "px";
    recpListCont.style.height = (bodyHeight - 423) + "px";
    
    setHaveToMaxNots(720,bodyWidth);
}

function cantUseNoticeBoard(noticePanel,explTopSpace,explWidth){
    inBoxCont.innerHTML = "";
    
    var overlay = document.createElement("div");
    overlay.className = "overlayTranslucent";
    
    var explanation = document.createElement("div");
    explanation.innerHTML = "You must create atleast one course and enter the course code for all of your courses to use this feature.";
    explanation.style.margin = "auto";
    explanation.style.marginTop = explTopSpace + "px";
    explanation.style.width = explWidth + "px";
    explanation.style.fontWeight = "bold";
    explanation.style.padding = "10px";
    explanation.style.backgroundImage = "url('../resources/websiteImgs/1.png')";
    
    overlay.appendChild(explanation);
    noticePanel.appendChild(overlay);
}

function printNotices(reqCourseCodes,noNotices,startingNo){
    currPrinting = true;
    //ajax to get notices to inbox
    request_printNotices = createRequest();
    if (request_printNotices==null){
        alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
    }
    else{
        var url1= "../resources/ajax/getNotices.php";
        request_printNotices.onreadystatechange = function(evt){
            if(request_printNotices.readyState == 4){
                if(request_printNotices.status == 200){
                    var evalText = request_printNotices.responseText;
                    if(haveToMaxNots){
                        evalText = evalText.replace(/smallDisplay/g,"bigDisplay");
                    }
                    eval(evalText);
                    //printNoticesCallBackFn - this is executed in the previous eval.
                    currPrinting = false;
                }
            }
        }
        request_printNotices.open("POST",url1,true);
        request_printNotices.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request_printNotices.send("ownerCourse=" + reqCourseCodes + "&noRecords=" + noNotices + "&startingNo=" + startingNo);
    }
}

function printRecpNames(courseCode){
    //ajax to get notices to inbox
    request_printRecpNames = createRequest();
    if (request_printRecpNames==null){
        alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
    }
    else{
        var url1= "../resources/ajax/getRecpNames.php";
        request_printRecpNames.onreadystatechange = function(evt){
            if(request_printRecpNames.readyState == 4){
                if(request_printRecpNames.status == 200){
                    var returnInfo = request_printRecpNames.responseText.split("|_|_|");
                    delLoadiMess("recpListLoading");
                    dispRecpNewRow(returnInfo[0],returnInfo[1],"recpBody");
                }
            }
        }
        request_printRecpNames.open("POST",url1,true);
        request_printRecpNames.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request_printRecpNames.send("courseCode=" + courseCode);
    }
}

function setHaveToMaxNots(widthNo,bodysWidth){
    if(bodysWidth - widthNo > 400){
        haveToMaxNots = true;
    }
    else{
        haveToMaxNots = false;
    }
}

function dispNotsCorr(){
    var i;
    if(haveToMaxNots && !areNotsMaximised){
        var loadingText = document.getElementById("noticesLoading").innerHTML;
        inBoxCont.innerHTML = "";
        for(i=0;i<notices.length;i++){
            notices[i].bigDisplay(inBoxCont);
        }
        addLoadiMess(inBoxCont,"noticesLoading","Loading notices...");
        document.getElementById("noticesLoading").innerHTML = loadingText;
        if(loadingText != "No more notices to load."){
            document.getElementById("noticesLoading").style.display = "none";
        }
    }
    else if(!haveToMaxNots && areNotsMaximised){
        var loadingText1 = document.getElementById("noticesLoading").innerHTML;
        inBoxCont.innerHTML = "";
        for(i=0;i<notices.length;i++){
            notices[i].smallDisplay(inBoxCont);
        }
        addLoadiMess(inBoxCont,"noticesLoading","Loading notices...");
        document.getElementById("noticesLoading").innerHTML = loadingText1;
        if(loadingText1 != "No more notices to load."){
            document.getElementById("noticesLoading").style.display = "none";
        }
    }
}

function delLoadiMess(delNoticeID){
    var loadingMessage = document.getElementById(delNoticeID);
    loadingMessage.parentNode.removeChild(loadingMessage);
}

function addLoadiMess(loadingNoticeParentCont,loadingNoticeID,loadingText){
    var notiLoadiMess = document.createElement("div");
    notiLoadiMess.id = loadingNoticeID;
    notiLoadiMess.innerHTML = "<img src=\"../resources/websiteImgs/loading.gif\">" + loadingText;
    loadingNoticeParentCont.appendChild(notiLoadiMess);
}

function setNotsCanLoad(){
    inBoxContHeight = Number(inBoxCont.style.height.replace("px",""));
    if((inBoxCont.scrollHeight - inBoxCont.scrollTop - inBoxContHeight) < 50 && haveMoreNots){
        canLoadNots = true;
    }
    else{
        canLoadNots = false;
    }
}

function loadDispNotices(codesOfCous,noNotices){
    printNoticesCallBackFn = function(){
        if(document.getElementById("noticesLoading").innerHTML != "No more notices to load."){
            document.getElementById("noticesLoading").style.display = "none";
        }
        printNoticesCallBackFn = function(){}
    }
    
    inBoxCont.innerHTML = "";
    addLoadiMess(inBoxCont,"noticesLoading","Loading notices...");
    notices = new Array();
    printNotices(codesOfCous,noNotices,1000000);
}

function getLatestNoticeNo(courseCodes,marker){
    var request1 = createRequest();
    if (request1==null){
        alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
    }
    else{
        var url1= "../resources/ajax/getLatestNoticeNo.php";
        request1.onreadystatechange = function(evt){
            if(request1.readyState == 4){
                if(request1.status == 200){
                    eval(request1.responseText);
                    checkNewNotices = setTimeout(function(){
                        gotNewNotices(courseCodes,marker);
                    },1000);
                }
            }
        }
        //THIS IS AN ASYNCHRONOUS REQUEST
        request1.open("POST",url1,true);
        request1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request1.send("ownerCourse=" + courseCodes);
    }
}

function gotNewNotices(courseCodes,marker){
    getLatestNoticeNo(courseCodes,marker);
    if(canCheckNewNotices){
        if(currNoticeNo < latestNoticeNo){
            marker.style.display = "inline";
        }
        else{
            marker.style.display = "none";
        }
    }
}

function printNoticesCallBackFn(){
    
}

function saveNote(){
    if(!isNoteSaving){
        isNoteSaving = true;
        var request = createRequest();
        if (request==null){
            alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
        }
        else{
            var sPadVal = scratchPad.value;
            var url= "../resources/ajax/saveNote.php";
            request.onreadystatechange = function(evt){
                if(request.readyState == 4){
                    if(request.status == 200){
                        isNoteSaving = false;
                        noteSaving.style.display = "none";
                        scratchPadPrevText = sPadVal;//for the even that the text is changed while the note is being saved
                    }
                }
            }
            request.open("POST",url,true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var noteContent = sPadVal.replace(/(\r\n|\n|\r)/gm," ");
            noteContent = encodeURIComponent(noteContent);
            request.send("note=" + noteContent);
        }
    }
}

function fillScratchPad(){
    var request = createRequest();
    if (request==null){
        alert("We're really sorry but there was a problem creating the AJAX request. Try reloading the page.");
    }
    else{
        var url= "../resources/ajax/getNote.php";
        request.onreadystatechange = function(evt){
            if(request.readyState == 4){
                if(request.status == 200){
                    document.getElementById("loadingInfo1").style.display = "none";
                    scratchPad.disabled = false;
                    var noteDecodedCont = request.responseText.replace(/\|@_#\|/g,"/");
                    noteDecodedCont = noteDecodedCont.replace(/\|@-#\|/g,"\\");
                    scratchPad.value = noteDecodedCont;
                    scratchPadPrevText = noteDecodedCont;
                    if(request.responseText == ""){
                        sPadInstr.style.display = "block";
                    }
                }
            }
        }
        request.open("POST",url,true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send();
    }
}

//slots in the window.resizes function
function resizesSlot1(){
    contentSizeUp();
}
function resizesSlot2(){
    
}
function resizesSlot3(){
    
}

//slots in the body.click fn.
function clickBody1(){
    
}
function clickBody2(){
    
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



function Course(title,code,location,alias,courseID,metaData){
    this.nameTitle = title;
    this.code = code;
    this.location = location;
    this.alias = alias;
    this.ID = courseID;
    this.metaData = metaData;
    if(this.alias == ""){
        this.displayTitle = this.code;
    }
    else{
        this.displayTitle = this.alias;
    }

    this.bindById = function(ID){
        var givElement = document.getElementById(ID);
        givElement.assoCourseID = this.ID;
        givElement.innerHTML = this.displayTitle + "<p class=\"locationSlot\">" + this.location + "</p>";
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
            resizesSlot3 = function(){
            }
        }
        //the code below is to close the div
        document.body.onmousedown = function(evt){
            if(!evt){
                evt = window.event;
            }
            
            var scrolled2 = getScrolledLen();
            if(((evt.clientX + scrolled2[0] - 200 < Number(popupDiv.style.left.replace("px",""))) || (evt.clientX + scrolled2[0] - 201 > Number(popupDiv.style.left.replace("px","")) + 320)) || ((evt.clientY + scrolled2[1] < Number(popupDiv.style.top.replace("px",""))) || (evt.clientY + scrolled2[1] - 1 > Number(popupDiv.style.top.replace("px","")) + 220))){
                fireEvent(popupCloser,"click");
            }
            
            document.body.onmousedown = null;
        }

        //just to increase comfort levels --- 370=width plus gap bet popup and leftEdge plus left padding of main page. 200 = width of leftBar.
        var X = Number(popupDiv.style.left.replace("px",""));
        
        resizesSlot3 = function(){
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



function Notice(content,postersID,postedTime,ownerCourseCode,ID,postersName,ownerCouDT,noticeOrder,posterRollNo){
    this.content = content;
    this.postersID = postersID;
    this.postedTime = postedTime;
    this.ownerCourseCode = ownerCourseCode;
    this.ID = ID;
    this.postersName = postersName;
    this.ownerCourseDisplayTitle = ownerCouDT;
    this.noticeOrder = noticeOrder;
    
    var currNotice = this;
    
    this.bigDisplay = function(inBoxCont){
        var couDTp = "";
        if(!isSingleCourse){
            couDTp = "<p class=\"bigOptCouDT\">" + currNotice.ownerCourseDisplayTitle + "</p>";
        }
        areNotsMaximised = true;
        var noticeDiv = document.createElement("div");
        var noticeDecodedCont = currNotice.content.replace(/\|@_#\|/g,"/");
        noticeDecodedCont = noticeDecodedCont.replace(/\|@-#\|/g,"\\");
        noticeDiv.innerHTML = noticeDecodedCont + "<div class=\"noticeRightBar\">" + couDTp + "<p class=\"bigOptTime\">" + currNotice.postedTime + "</p><p title=\"" + posterRollNo + "\" class=\"bigOptPosterName\">" + currNotice.postersName + "</p></div>";
        noticeDiv.style.paddingRight = "141px";
        noticeDiv.style.minHeight = "52px";
        noticeDiv.className = "inBoxNotice";
        inBoxCont.appendChild(noticeDiv);
    }
    this.smallDisplay = function(inBoxCont){
        var couDT = "";
        var topPadding = "10px";
        if(!isSingleCourse){
            couDT = "<div class=\"smallOptCouDT\"><p>" + currNotice.ownerCourseDisplayTitle + "</p></div>";
            topPadding = "30px";
        }
        areNotsMaximised = false;
        var noticeDiv = document.createElement("div");
        var noticeDecodedCont = currNotice.content.replace(/\|@_#\|/g,"/");
        noticeDecodedCont = noticeDecodedCont.replace(/\|@-#\|/g,"\\");
        noticeDiv.innerHTML = noticeDecodedCont + couDT + "<div class=\"noticeFooter\"><p title=\"" + posterRollNo + "\" class=\"smallOptPosterName\">" + currNotice.postersName + "</p><p class=\"smallOptTime\">" + currNotice.postedTime + "</p></div>";
        noticeDiv.style.paddingTop = topPadding;
        noticeDiv.style.paddingBottom = "30px";
        noticeDiv.className = "inBoxNotice";
        inBoxCont.appendChild(noticeDiv);
    }
}

//###################END OF SECTION######################///////