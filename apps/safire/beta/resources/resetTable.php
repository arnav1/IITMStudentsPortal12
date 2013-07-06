<?php

include_once 'DBfunct.php';
///////////// end of file includes

session_start();
///////////started the session

if (isset($_GET['template'])) {
    switch ($_GET['template']) {
        case "mostCommon":
            resetTable2MostCommon($_SESSION['membInfo'][0]);
            header('Location: ../manager/tableManager.php');
            break;
        case "blank":
            resetTable2Blank($_SESSION['membInfo'][0]);
            header('Location: ../manager/tableManager.php');
            break;
        default:
            echo "Choose a proper template";
    }
} else {
    echo "Please choose a template.";
}

exit();
?>
