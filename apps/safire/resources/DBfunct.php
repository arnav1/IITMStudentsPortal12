<?php

$conn = mysql_connect("localhost", "eddyhudson", "eddy12db");
mysql_select_db("students", $conn);

function resetTable2Blank($usersUniqId) {
    $lunchSlots = 'mon5,tue5,wed5,thu5,fri5,';
    $nullSlots = 'mon1,tue1,wed1,thu1,fri1,mon2,tue2,wed2,thu2,fri2,mon3,tue3,wed3,thu3,fri3,mon4,tue4,wed4,thu4,fri4,mon6,tue6,wed6,thu6,fri6,mon7,tue7,wed7,thu7,fri7,mon8,tue8,wed8,thu8,fri8,mon9,tue9,wed9,thu9,fri9,mon10,tue10,wed10,thu10,fri10,';

    if ($GLOBALS['conn']) {

        $result = mysql_query("DELETE FROM courses_safire WHERE OWNERUNIQUSERID='" . $usersUniqId . "'");
        if ($result) {
            
        } else {
            echo "failure";
        }

        $result = mysql_query("UPDATE users_safire SET LUNCHSLOTS='" . $lunchSlots . "', NULLSLOTS='" . $nullSlots . "' WHERE USERSUNIQID='" . $usersUniqId . "'");
        if ($result) {
            
        } else {
            echo "failure";
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function resetTable2MostCommon($usersUniqId) {
    $lunchSlots = 'mon5,tue5,wed5,thu5,fri5,';
    $nullSlots = 'mon10,tue10,wed10,thu10,fri10,';

    if ($GLOBALS['conn']) {

        $result = mysql_query("DELETE FROM courses_safire WHERE OWNERUNIQUSERID='" . $usersUniqId . "'");
        if ($result) {
            
        } else {
            echo "failure";
        }

        $result = mysql_query("UPDATE users_safire SET LUNCHSLOTS='" . $lunchSlots . "', NULLSLOTS='" . $nullSlots . "' WHERE USERSUNIQID='" . $usersUniqId . "'");
        if ($result) {
            
        } else {
            echo "failure";
        }

        //create all the courses' sql create strings here as an array and then feed it to createCourses.
        $defCourses[0] = "INSERT INTO courses_safire VALUES ('','', 'mon1,tue6,thu4,fri3,', '', '||##::##||', '" . uniqid("A___") . "', 'A', 'slotted|__|notify|__|')";
        $defCourses[1] = "INSERT INTO courses_safire VALUES ('','', 'mon2,tue1,wed6,fri4,', '', '||##::##||', '" . uniqid("B___") . "', 'B', 'slotted|__|notify|__|')";
        $defCourses[2] = "INSERT INTO courses_safire VALUES ('','', 'mon3,tue2,wed1,fri6,', '', '||##::##||', '" . uniqid("C___") . "', 'C', 'slotted|__|notify|__|')";
        $defCourses[3] = "INSERT INTO courses_safire VALUES ('','', 'mon4,tue3,wed2,thu6,', '', '||##::##||', '" . uniqid("D___") . "', 'D', 'slotted|__|notify|__|')";
        $defCourses[4] = "INSERT INTO courses_safire VALUES ('','', 'tue4,wed3,thu1,', '', '||##::##||', '" . uniqid("E___") . "', 'E', 'slotted|__|notify|__|')";
        $defCourses[5] = "INSERT INTO courses_safire VALUES ('','', 'wed4,thu2,fri1,', '', '||##::##||', '" . uniqid("F___") . "', 'F', 'slotted|__|notify|__|')";
        $defCourses[6] = "INSERT INTO courses_safire VALUES ('','', 'mon6,thu3,fri2,', '', '||##::##||', '" . uniqid("G___") . "', 'G', 'slotted|__|notify|__|')";
        $defCourses[7] = "INSERT INTO courses_safire VALUES ('','', 'mon7,mon8,mon9,', '', '||##::##||', '" . uniqid("P___") . "', 'P', 'slotted|__|notify|__|')";
        $defCourses[8] = "INSERT INTO courses_safire VALUES ('','', 'tue7,tue8,tue9,', '', '||##::##||', '" . uniqid("Q___") . "', 'Q', 'slotted|__|notify|__|')";
        $defCourses[9] = "INSERT INTO courses_safire VALUES ('','', 'wed7,wed8,wed9,', '', '||##::##||', '" . uniqid("R___") . "', 'R', 'slotted|__|notify|__|')";
        $defCourses[10] = "INSERT INTO courses_safire VALUES ('','', 'thu7,thu8,thu9,', '', '||##::##||', '" . uniqid("S___") . "', 'S', 'slotted|__|notify|__|')";
        $defCourses[11] = "INSERT INTO courses_safire VALUES ('','', 'fri7,fri8,fri9,', '', '||##::##||', '" . uniqid("T___") . "', 'T', 'slotted|__|notify|__|')";
        createCourses($defCourses, $usersUniqId);
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function changeUserMetaData($usersUniqId, $metaData) {
    if ($GLOBALS['conn']) {
        $result = mysql_query("UPDATE users_safire SET METADATA='" . $metaData . "' WHERE USERSUNIQID='" . $usersUniqId . "'");
        if ($result) {
            
        } else {
            echo "failure";
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function createUser($userName, $chosenTemplate, $emailID) {
    $emailID = htmlspecialchars($emailID, ENT_QUOTES);
    $emailID = stripslashes($emailID);
    $template = $chosenTemplate;
    $rollNumber = $userName;
    if ($emailID == "") {
        $emailID = $rollNumber . "@smail.iitm.ac.in";
    }
    $usersUniqId = uniqid($rollNumber, true);
    $metaData = "newUser==";
    $lunchSlots = 'mon5,tue5,wed5,thu5,fri5,';
    $nullSlots = 'mon1,tue1,wed1,thu1,fri1,mon2,tue2,wed2,thu2,fri2,mon3,tue3,wed3,thu3,fri3,mon4,tue4,wed4,thu4,fri4,mon6,tue6,wed6,thu6,fri6,mon7,tue7,wed7,thu7,fri7,mon8,tue8,wed8,thu8,fri8,mon9,tue9,wed9,thu9,fri9,mon10,tue10,wed10,thu10,fri10,';
    if ($GLOBALS['conn']) {

        $result = mysql_query("SELECT fullname FROM users WHERE username = '$userName'");
        $fullName = mysql_fetch_array($result);
        $names = explode(" ", $fullName[0]);

        $result = mysql_query("INSERT INTO users_safire VALUES ('$userName','" . $names[0] . "','" . end($names) . "','$lunchSlots','$nullSlots','$rollNumber','$usersUniqId','$metaData','$emailID','')");
        if ($result) {
            $membInfo = retrieveMembInfo($username);
        } else {
            echo "failure";
            $membInfo = false;
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";

    switch ($template) {
        case "mostCommon":
            resetTable2MostCommon($usersUniqId);
            break;
        case "blank":
            resetTable2Blank($usersUniqId);
            break;
        default:
            echo "Choose a proper template";
    }

    return $membInfo;
}

function retrieveMembInfo($username) {
    if ($GLOBALS['conn']) {
        $result = mysql_query("SELECT usersuniqid,firstname,lastname,metadata,rollnumber FROM users_safire WHERE username = '$username'");
        if ($result) {
            $res = mysql_fetch_array($result);
            return $res;
        } else {
            echo "failure";
            return false;
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function getCou4displayer($usersUniqId) {
    $i = 0;
    if ($GLOBALS['conn']) {
        //for all the courses a user has
        $result = mysql_query("SELECT * FROM courses_safire WHERE owneruniquserid = '$usersUniqId'");
        if ($result) {
            echo "courses = new Array();";
            while ($res = mysql_fetch_array($result)) {
                echo "courses[" . $i . "] = new Course(\"" . $res[1] . "\",\"" . $res[0] . "\",\"" . $res[3] . "\",\"" . $res[6] . "\",\"" . $res[5] . "\",\"" . $res[7] . "\");";
                $slotIDs = parseCSV($res[2]);
                foreach ($slotIDs as $slotID) {
                    echo "courses[" . $i . "].bindById(\"" . $slotID . "\");";
                }
                $i++;
            }
        } else {
            echo "job1 not done";
        }
        //for the lunch slots a user has
        $result = mysql_query("SELECT lunchslots FROM users_safire WHERE usersuniqid = '$usersUniqId'");
        if ($result) {
            echo "var lunchslot = new Lunch();";
            $res = mysql_fetch_array($result);
            $slotIDs = parseCSV($res[0]);
            foreach ($slotIDs as $slotID) {
                echo "lunchslot.bindById(\"" . $slotID . "\");";
            }
        } else {
            echo "job1 not done";
        }
        //for the null slots a user has
        $result = mysql_query("SELECT nullslots FROM users_safire WHERE usersuniqid = '$usersUniqId'");
        if ($result) {
            echo "var nullslot = new nullSlot();";
            $res = mysql_fetch_array($result);
            $slotIDs = parseCSV($res[0]);
            foreach ($slotIDs as $slotID) {
                echo "nullslot.bindById(\"" . $slotID . "\");";
            }
        } else {
            echo "job1 not done";
        }
        //get user meta data - remember to change the session cookie too if you're modifying this.
        echo "usersMetaData = \"" . $_SESSION['membInfo'][0] . "\";";
    } else {
        echo "I'm sorry but we couldn't connect to the database.";
    }
}

function getCou4manager($usersUniqId) {
    $i = 0;
    if ($GLOBALS['conn']) {
        //for all the courses a user has
        $result = mysql_query("SELECT * FROM courses_safire WHERE owneruniquserid = '$usersUniqId' ORDER BY alias DESC");
        if ($result) {
            echo "courses = new Array();";
            while ($res = mysql_fetch_array($result)) {
                echo "courses[" . $i . "] = new cCourse();";
                echo "courses[" . $i . "].code =\"" . $res[0] . "\";";
                echo "courses[" . $i . "].nameTitle =\"" . $res[1] . "\";";
                echo "courses[" . $i . "].bindList =\"" . $res[2] . "\";";
                echo "courses[" . $i . "].location =\"" . $res[3] . "\";";
                echo "courses[" . $i . "].alias =\"" . $res[6] . "\";";
                echo "courses[" . $i . "].metaData =\"" . $res[7] . "\";";
                echo "courses[" . $i . "].ID =\"" . $res[5] . "\";";
                echo "courses[" . $i . "].init();";
                echo "courses[" . $i . "].bindOptByID(\"opt" . $i . "\");";
                echo "courses[" . $i . "].optID = \"opt" . $i . "\";";
                $slotIDs = parseCSV($res[2]);
                foreach ($slotIDs as $slotID) {
                    echo "courses[" . $i . "].bindCellByID(\"" . $slotID . "\");";
                }
                $i++;
            }
            echo "numbCourses = courses.length;";
        } else {
            echo "job1 not done";
        }
        //for the lunch slots a user has
        $result = mysql_query("SELECT lunchslots FROM users_safire WHERE usersuniqid = '$usersUniqId'");
        if ($result) {
            echo "lunchSlot = new cLunch();";
            $res = mysql_fetch_array($result);
            $slotIDs = parseCSV($res[0]);
            echo "lunchSlot.bindList =\"" . $res[0] . "\";";
            echo "lunchSlot.init();";
            echo "lunchSlot.bindOpt();";
            foreach ($slotIDs as $slotID) {
                echo "lunchSlot.bindCellByID(\"" . $slotID . "\");";
            }
        } else {
            echo "job1 not done";
        }
        //for the null slots a user has
        $result = mysql_query("SELECT nullslots FROM users_safire WHERE usersuniqid = '$usersUniqId'");
        if ($result) {
            echo "nullSlot = new cNullSlot();";
            $res = mysql_fetch_array($result);
            $slotIDs = parseCSV($res[0]);
            echo "nullSlot.bindList =\"" . $res[0] . "\";";
            echo "nullSlot.init();";
            foreach ($slotIDs as $slotID) {
                echo "nullSlot.bindCellByID(\"" . $slotID . "\");";
            }
        } else {
            echo "job1 not done";
        }
    } else {
        echo "I'm sorry but we couldn't connect to the database";
    }
}

function getNumbCourses($usersUniqId) {
    if ($GLOBALS['conn']) {
        $result = mysql_query("SELECT COUNT(*) FROM courses_safire WHERE owneruniquserid = '$usersUniqId'");
        if ($result) {
            $res = mysql_fetch_array($result);
            return $res[0];
        } else {
            echo "failure";
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function createCourses($fullQuery, $usersUniqId) {
    if ($GLOBALS['conn']) {
        foreach ($fullQuery as $oneQuery) {
            $result = mysql_query(str_replace("||##::##||", $usersUniqId, $oneQuery));
            if ($result) {
                
            } else {
                echo "failure";
            }
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function deleteCourses($fullQuery) {
    if ($GLOBALS['conn']) {
        foreach ($fullQuery as $oneQuery) {
            $result = mysql_query($oneQuery . $_SESSION['membInfo'][0] . "'");
            if ($result) {
                
            } else {
                echo "failure";
            }
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function updateCourses($fullQuery) {
    if ($GLOBALS['conn']) {
        foreach ($fullQuery as $oneQuery) {
            $result = mysql_query($oneQuery . " AND OWNERUNIQUSERID='" . $_SESSION['membInfo'][0] . "'");
            if ($result) {
                
            } else {
                echo "failure";
            }
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function updateLunchNull($query) {
    if ($GLOBALS['conn']) {
        $result = mysql_query($query . "USERSUNIQID='" . $_SESSION['membInfo'][0] . "'");
        if ($result) {
            
        } else {
            echo "failure";
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function authUser($username, $password) {
    $username = htmlspecialchars($username, ENT_QUOTES);
    $username = stripslashes($username);

    if ($GLOBALS['conn']) {
        $result = mysql_query("SELECT encrypted_password FROM users WHERE username = '$username'");
        if ($result) {
            $res = mysql_fetch_array($result);
            $putativePassword = $res[0];
            if ($res = mysql_fetch_array($result)) {//this checks if there is more than one user with the same username
                return false;
            } else if ($password == $putativePassword) {
                //the "" doesn't seem necc., it's just a blank string anyway. --  crypt($password . "", $putativePassword) == $putativePassword -- This is what you should add in the prev. if struct. once you're done testing, just replace it with this text.
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    else
        echo "Sorry, we couldn't connect to the database.";
}

function addNotice($noticeContent, $noticeCourse, $usersUniqId, $postedTime, $postUniqID) {
    if ($GLOBALS['conn']) {
        $result = mysql_query("INSERT INTO notices_safire (postuniqid,posteruniqid,postcontent,posttime,ownercourse) VALUES ('$postUniqID','$usersUniqId','$noticeContent',$postedTime,'$noticeCourse')");
        if ($result) {
            return true;
        } else {
            return false;
        }
    }
    else
        return false;
}

function getNoticesObjs($courseCode, $noRecords, $startingNo) {
    $i = 0;
    if ($GLOBALS['conn']) {
        $result = mysql_query("SELECT * FROM notices_safire WHERE ownercourse = '$courseCode' AND noticeorder < " . $startingNo . " ORDER BY noticeorder DESC LIMIT " . $noRecords);
        if ($result) {
            echo "delLoadiMess(\"noticesLoading\");";
            echo "var noNotices = notices.length;";
            date_default_timezone_set("Asia/Calcutta");
            while ($res = mysql_fetch_array($result)) {

                $formattedTime = date("G:i - j/n", $res[3]);

                //to get the poster's name
                $postersName = "Unknown User";
                $mysqlStmt1 = "SELECT firstname,lastname,rollnumber FROM users_safire WHERE usersuniqid = '" . $res[1] . "'";
                $result1 = mysql_query($mysqlStmt1);
                if ($result1) {
                    if ($res1 = mysql_fetch_array($result1)) {
                        $postersName = $res1[0] . " " . $res1[1];
                    }
                }

                echo "notices[" . $i . "+noNotices] = new Notice(\"" . $res[2] . "\",\"" . $res[1] . "\",\"" . $formattedTime . "\",\"" . $res[4] . "\",\"" . $res[0] . "\",\"" . $postersName . "\"," . $res[4] . ".displayTitle," . $res[5] . ",\"" . $res1[2] . "\");";
                echo "notices[" . $i . "+noNotices].smallDisplay(inBoxCont);";
                $i++;
            }

            echo "addLoadiMess(inBoxCont,\"noticesLoading\",\"Loading notices...\");";
            if ($i < $noRecords) {
                echo "document.getElementById(\"noticesLoading\").innerHTML = \"No more notices to load.\";";
                echo "haveMoreNots = false;";
            }
        } else {
            return false;
        }
    }
    else
        return false;
}

function getAllCouNoticeObjs($courseCodes, $noRecords, $startingNo) {
    $i = 0;
    $orPart = "ownercourse = '" . $courseCodes[0] . "'";
    array_shift($courseCodes);
    foreach ($courseCodes as $courseCode) {
        $orPart .= (" OR ownercourse = '" . $courseCode . "'");
    }
    $mysqlStmt = "SELECT * FROM notices_safire WHERE (" . $orPart . ") AND noticeorder < " . $startingNo . " ORDER BY noticeorder DESC LIMIT " . $noRecords;
    if ($GLOBALS['conn']) {
        $result = mysql_query($mysqlStmt);
        if ($result) {
            echo "delLoadiMess(\"noticesLoading\");";
            echo "var noNotices = notices.length;";
            date_default_timezone_set("Asia/Calcutta");
            while ($res = mysql_fetch_array($result)) {

                $formattedTime = date("G:i - j/n", $res[3]);

                //to get the poster's name
                $postersName = "Unknown User";
                $mysqlStmt1 = "SELECT firstname,lastname,rollnumber FROM users_safire WHERE usersuniqid = '" . $res[1] . "'";
                $result1 = mysql_query($mysqlStmt1);
                if ($result1) {
                    if ($res1 = mysql_fetch_array($result1)) {
                        $postersName = $res1[0] . " " . $res1[1];
                    }
                }

                echo "notices[" . $i . "+noNotices] = new Notice(\"" . $res[2] . "\",\"" . $res[1] . "\",\"" . $formattedTime . "\",\"" . $res[4] . "\",\"" . $res[0] . "\",\"" . $postersName . "\"," . $res[4] . ".displayTitle," . $res[5] . ",\"" . $res1[2] . "\");";
                echo "notices[" . $i . "+noNotices].smallDisplay(inBoxCont);";
                $i++;

                echo "currNoticeNo = notices[0].noticeOrder;";
            }

            echo "addLoadiMess(inBoxCont,\"noticesLoading\",\"Loading notices...\");";
            if ($i < $noRecords) {
                echo "document.getElementById(\"noticesLoading\").innerHTML = \"No more notices to load.\";";
                echo "haveMoreNots = false;";
            }
        } else {
            return false;
        }
    }
    else
        return false;
}

function getNoticeRecps($courseCode) {
    $namesCSV = "";
    $rollNumbCSV = "";
    if ($GLOBALS['conn']) {
        $result = mysql_query("SELECT * FROM courses_safire WHERE code='" . $courseCode . "'");
        if ($result) {
            while ($res = mysql_fetch_array($result)) {
                $result1 = mysql_query("SELECT firstname,lastname,rollnumber FROM users_safire WHERE usersuniqid='" . $res[4] . "'");
                if ($result1) {
                    if ($resD = mysql_fetch_array($result1)) {
                        $namesCSV .= ($resD[0] . " " . $resD[1] . ",");
                        $rollNumbCSV .= ($resD[2] . ",");
                    }
                } else {
                    return false;
                }
            }
            return $namesCSV . "|_|_|" . $rollNumbCSV;
        } else {
            return false;
        }
    }
    else
        return false;
}

function getLatestNoticeNo($courseCodes) {
    if ($GLOBALS['conn']) {
        $orPart = "ownercourse = '" . $courseCodes[0] . "'";
        array_shift($courseCodes);
        foreach ($courseCodes as $courseCode) {
            $orPart .= (" OR ownercourse = '" . $courseCode . "'");
        }
        $result = mysql_query("SELECT noticeorder FROM notices_safire WHERE (" . $orPart . ") ORDER BY noticeorder DESC LIMIT 1");
        if ($result) {
            if ($res = mysql_fetch_array($result)) {
                echo "latestNoticeNo=" . $res[0] . ";";
            }
        } else {
            return false;
        }
    }
    else
        return false;
}

function setCouMetaData($courseList, $metaDataList, $usersUniqId) {
    $i = 0;
    $couIDs = parseCSV($courseList);
    $metaData = parseCSV($metaDataList);
    $result = false;
    if ($GLOBALS['conn']) {
        foreach ($couIDs as $couID) {
            $result = mysql_query("UPDATE courses_safire SET metadata='" . $metaData[$i] . "' WHERE courseid='" . $couID . "' AND owneruniquserid='" . $usersUniqId . "'");
            $i++;
        }
        if ($result) {
            return true;
        } else {
            return false;
        }
    }
    else
        return false;
}

function emailNotice($courseCode, $content, $postersFname) {
    if ($GLOBALS['conn']) {
        $result = mysql_query("SELECT * FROM courses_safire WHERE code='" . $courseCode . "'");
        if ($result) {
            while ($res = mysql_fetch_array($result)) {
                if (strpos($res[7], "notify|__|") !== false) {
                    $result1 = mysql_query("SELECT firstname,emailaddr FROM users_safire WHERE usersuniqid='" . $res[4] . "'");
                    if ($result1) {
                        if ($resD = mysql_fetch_array($result1)) {
                            sendMail($content, $resD[1], $resD[0], $res[0], $res[6], $postersFname);
                        }
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }
    }
    else
        return false;
}

function updtNote($noteCont, $usersUniqId){
    if ($GLOBALS['conn']) {
        $result = mysql_query("UPDATE users_safire SET NOTECONT='" . $noteCont . "' WHERE USERSUNIQID='" . $usersUniqId . "'");
        if ($result) {
            return true;
        } else {
            return false;
        }
    }
    else
        return false;
}

function getNote($usersUniqId){
    if ($GLOBALS['conn']) {
        $result = mysql_query("SELECT notecont FROM users_safire WHERE usersuniqid = '$usersUniqId'");
        if ($result) {
            $res = mysql_fetch_array($result);
            return $res[0];
        } else {
            return false;
        }
    }
    else
        return false;
}

?>