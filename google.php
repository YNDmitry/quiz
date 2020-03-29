<?php
// change your web app url in $web_app
$web_app = '';
$field = '';
$count_field = 1;
$arrAlpha = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W');
foreach($_POST as $key => $value){
	$k = urlencode($key);
	$v = urlencode($value);
	$current_letter = $arrAlpha[$count_field];
	if($count_field == 1){
		$field .= "$current_letter=$k*-*$v";
	}else{
		$field .= "&$current_letter=$k*-*$v";
	}
	$count_field++;
}
function getUrlContent($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: application/json"));
	curl_setopt($ch, CURLOPT_URL, $url);
	$data = curl_exec($ch);
	
	curl_close($ch);
}
getUrlContent($web_app.'?'.$field);

?>
