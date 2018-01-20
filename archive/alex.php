<?php

if (isset($_REQUEST['svr'])) {

    $servername = $_REQUEST['svr'];

    $d1 = disk_free_space("/");
    $a1 = disk_total_space("/");

    $dfree = number_format(($d1 / $a1 * 100), 0, '.', '');

    $exec_free = explode("\n", trim(shell_exec('free')));
    $get_mem   = preg_split("/[\s]+/", $exec_free[1]);
    $mem       = round($get_mem[2] / $get_mem[1] * 100, 0);

    $load = sys_getloadavg();

/* if (strcasecmp($servername, 'ollie') == 0 || strcasecmp($servername, 'oops') == 0 ) {  */

    if (($load[0] * 100) == 0) {$show = 'idle';} else { $show = 'at ' . ($load[0] * 100) . ' percent';}

    if ($load[0] < $load[1]) {
        $suffix = "Server load is " . $show . " and falling on " . $servername;
    } elseif ($load[0] > $load[1]) {
        $suffix = "Server load is " . $show . " and rising on " . $servername;
    } else {
        $suffix = "Server load is " . $show . " and steady on " . $servername;
    }

    $suffix = $suffix . ". " . $dfree . " percent of the disk, and " . $mem . " percent of the memory are in use. ";

    $exec_uptime = preg_split("/[\s]+/", trim(shell_exec('uptime')));
    $uptime      = $exec_uptime[2];

    $suffix = $suffix . $servername . " has been up for " . $uptime . " days.";
} else {
    $suffix = 'There is no server by that name, please restate your request.';
}

$data = ["response" => $suffix];

header('Content-type: application/json');
echo json_encode($data);

?>