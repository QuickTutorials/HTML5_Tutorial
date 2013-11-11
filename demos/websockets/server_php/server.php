<?php

// prevent the server from timing out
set_time_limit(0);

// include the web sockets server script (the server is started at the far bottom of this file)
require 'class.PHPWebSocket.php';

// when a client sends data to the server
function wsOnMessage($clientID, $message, $messageLength, $binary) {
    global $Server;
    $ip = long2ip($Server->wsClients[$clientID][6]);

    $Server->wsSend($clientID, "thinking...");

    // check if message length is 0
    if ($messageLength == 0) {
        $Server->wsClose($clientID);
        return;
    }

    //The speaker is the only person in the room. Don't let them feel lonely.
    if (sizeof($Server->wsClients) == 1) {
        //$Server->wsSend($clientID, "There isn't anyone else in the room, but I'll still listen to you. --Your Trusty Server");
        $Server->wsSend($clientID, "Type _help ");
    }
    else
    //Send the message to everyone but the person who said it
        foreach ($Server->wsClients as $id => $client)
            if ($id != $clientID)
                $Server->wsSend($id, "Visitor $clientID ($ip) said \"$message\"");

    // Try to process an order
    if (preg_match('/_help/', $message)) {
        $Server->wsSend($clientID, "Hi, my orders are:
	_help To print this list.
	_question To share with you some wisdom about Chuck Norris Facts.");
    } else if (preg_match('/_question/', $message)) {
        $Server->wsSend($clientID, "Hmmm Do you know that? " . randomFact());
    }
}

// when a client connects
function wsOnOpen($clientID) {
    global $Server;
    $ip = long2ip($Server->wsClients[$clientID][6]);

    $Server->log("$ip ($clientID) has connected.");

    //Send a join notice to everyone but the person who joined
    foreach ($Server->wsClients as $id => $client)
        if ($id != $clientID)
            $Server->wsSend($id, "Visitor $clientID ($ip) has joined the room.");
}

// when a client closes or lost connection
function wsOnClose($clientID, $status) {
    global $Server;
    $ip = long2ip($Server->wsClients[$clientID][6]);

    $Server->log("$ip ($clientID) has disconnected.");

    //Send a user left notice to everyone in the room
    foreach ($Server->wsClients as $id => $client)
        $Server->wsSend($id, "Visitor $clientID ($ip) has left the room.");
}

function randomFact() {
    $xml = simplexml_load_string(file_get_contents('data.xml'));
    return trim($xml->fact[rand(1, sizeof($xml))]);
}

// start the server
$Server = new PHPWebSocket();
$Server->bind('message', 'wsOnMessage');
$Server->bind('open', 'wsOnOpen');
$Server->bind('close', 'wsOnClose');
// for other computers to connect, you will probably need to change this to your LAN IP or external IP,
// alternatively use: gethostbyaddr(gethostbyname($_SERVER['SERVER_NAME']))
//$Server->wsStartServer('127.0.0.1', 9300);
//$Server->wsStartServer('192.168.0.52', 9300);

$Server->wsStartServer(getHostByName(getHostName()), 8081);

?>
