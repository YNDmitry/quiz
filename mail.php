<?php
//проверяем значения полученые при проверке скриптом формы
if (empty($_POST)) {
	echo 'fasle';
}
else {
	$site = $_SERVER['SERVER_NAME'];

	// от кого
	$fromMail = 'mail@'.$_SERVER['SERVER_NAME'];
	// Сюда введите Ваш email
	$emailTo = '';
	/*THEME OF LETTER*/
	$subject = 'Форма обратной связи с сайта '.$site;
	$subject = "=?utf-8?b?". base64_encode($subject) ."?=";
	$headers = "From: Обратная связь<$fromMail>\n";
	$headers .= 'Content-type: text/html; charset="utf-8"\r\n';
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Date: ". date('D, d M Y h:i:s O') ."\r\n";
	
	$fields = "";
	foreach($_POST as $key => $value){
		if($value === 'on'){ $value = 'Да'; }
		if($key === 'sendto'){
			$email = $value;
		}elseif($key === 'required_fields'){
			$required = explode(',', $value);
		}else{
			if(is_array($value)){
			  $fields .= str_replace('_',' ',$key).': <b>'.implode(', ', $value).'</b> <br />';
			}else{
			  if($value !== ''){ $fields .= str_replace('_',' ',$key).': <b>'.urldecode($value).'</b> <br />'; }
			}
		}
	}

	// тело письма
	$body = "Получено письмо с сайта ".$site." \n\n<br>".$fields;
	mail($emailTo, $subject, $body, $headers );


	echo 'ok';
}
?>