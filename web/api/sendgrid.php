<?php

header('Access-Control-Allow-Origin: *');

$to = "k016c1200@it-neec.jp";
$subject = $_GET['name'];
$message = $_GET['phone'].'<br>'.$_GET['message'];

$headers = "From: ".$_GET['mail'];
$headers .= "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8";

if(mb_send_mail($to, $subject, $message, $headers))
{
    $result =  "お問い合わせありがとうございました";
}
else
{
    $result =  "お問い合わせに失敗致しました。";
}

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLAS);

//Email.send({
//    Host: "smtp.sendgrid.net",
//    To: 'fakemash777@gmail.com',
//    From: $('#mail').val(),
//    Subject: "お問い合わせ：" + $('#name').val(),
//    Body: "メッセージ：" + $('#message').val() + "<br>" +
//'電話番号：' + $('#phone').val()
