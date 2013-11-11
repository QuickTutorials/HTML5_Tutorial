<?php
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');

    // Número aleatorio
    //$numero = rand(1000, 9999);
    //echo "data: Nuevo número: $numero"."\n\n";

    // Fecha
    //$date = date('H:i:s');
    //echo "data: La hora del servidor es: ".$date.PHP_EOL."".PHP_EOL;
    
    // XML aleatorio
    //$xml = simplexml_load_string(file_get_contents('data.xml'));
    //$position = intval(rand(1, sizeof($xml)));
    //echo "data: " . htmlentities(utf8_encode($xml->linea[$position]->autor)) . ": " . htmlentities(utf8_decode($xml->linea[$position]->frase)) . PHP_EOL."".PHP_EOL;
    
    // Twitter
    switch(rand(1,5)) {
        case 1: echo "data: @la_informacion: ".getTwitterStatus("la_informacion").PHP_EOL."".PHP_EOL; break;
        case 2: echo "data: @lainfo_cultura: ".getTwitterStatus("lainfo_cultura").PHP_EOL."".PHP_EOL; break;
        case 3: echo "data: @lainfo_economia: ".getTwitterStatus("lainfo_economia").PHP_EOL."".PHP_EOL; break;
        case 4: echo "data: @lainfo_deportes: ".getTwitterStatus("lainfo_deportes").PHP_EOL."".PHP_EOL; break;
        case 5: echo "data: @marca: ".getTwitterStatus("marca").PHP_EOL; break;
    }
    
    ob_flush();
    //flush();
    sleep(rand(1,3));

    // Twitter funcion
    function getTwitterStatus($userid) {
        $url = "https://api.twitter.com/1/statuses/user_timeline/$userid.xml?count=1&include_rts=1callback=?";
        $xml = simplexml_load_file($url) or die("could not connect");

        foreach ($xml->status as $status) {
            $text = $status->text;
        }
        return $text;
    }
?>