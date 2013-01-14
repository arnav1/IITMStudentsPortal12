<?php
include_once 'resources/DBfunct.php';
include_once 'resources/nDBfunct.php';
///////////// end of file includes

session_start();
///////////started the session

$isLoginValid = true; //to ensure that the invalidLogin message doesn't show up when user accesses the page to login
//incase the student hasn't logged on to the student's portal yet. You'll have to set the usercookie here too
if (isset($_POST['userName']) && isset($_POST['passWord'])) {
    $isLoginValid = authUser($_POST['userName'], $_POST['passWord']);
    if ($isLoginValid) {
        $_SESSION['uname'] = $_POST['userName'];
        $_SESSION['membInfo'] = retrieveMembInfo($_SESSION['uname']);
        if (!$_SESSION['membInfo']) {
            unset($_SESSION['membInfo']);
            $_SESSION['createUser'] = $_SESSION['uname'];
            header('Location: registerUser/registerUser.php');
            exit();
        } else {
            if ($_POST["remember"]) {
                setcookie("user", $_SESSION['uname'], time() + 60 * 60 * 999, "/");
            }
        }
    }
}

//incase the student has clicked on 'keep me logged in' and returns to safire directly
else if (isset($_COOKIE["user"])) {
    $_SESSION['uname'] = $_COOKIE["user"];
    $_SESSION['membInfo'] = retrieveMembInfo($_SESSION['uname']);
    if (!$_SESSION['membInfo']) {
        $_SESSION['membInfo'] = createUser($_SESSION['uname']);
    }
}

//incase the student is logged in to the portal already
if (isset($_SESSION['membInfo'])) {
    header('Location: displayer/displayer.php');
    exit();
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Safire</title>
        <link href="resources/cryinMe.css" rel="stylesheet" type="text/css" />
        <link href="indexCSS.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        <?php
        include_once "resources/googleAnalytics.php";
        pageInit();
        ?>
        <div id="mainPage">
            <div id="content">
                <img id="frontLogo" alt="" src="resources/websiteImgs/frontLogo1.png"><br>
                <p id="welcome">Welcome to Safire, a place where you can store your timetable and even print it!</p>
                <p id="invLogin" style="<?php
        global $isLoginValid;
        if (!$isLoginValid)
            echo "color: #ba0d0d;";
        ?>">The login credentials that you have provided are incorrect</p>
                <form action="" method="POST">
                    <div id="aContainer">
                        <table id="loginInfo">
                            <tr>
                                <td>Username:</td><td><input id="userID" class="defInput" name="userName" type="text"/></td>
                            </tr>
                            <tr>
                                <td>Password:</td><td><input id="passIn" class="defInput" name="passWord" type="password"/></td>
                            </tr>
                        </table>
                        <p>Use the Student Portal's login credentials</p>
                    </div>
                    <br>
                    <input id="logOn" name="Submit1" type="submit" value="Log in" disabled="disabled"><input type="checkbox" name="remember"><p id="rembPass">Remember Me</p>
                </form>
            </div>
        </div>
    </body>
    <script type="text/javascript" src="resources/cryinMe.js"></script>
    <script type="text/javascript" src="indexJS.js"></script>
</html>
