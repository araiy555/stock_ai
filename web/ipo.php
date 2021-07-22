<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);


    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, 'http://ipo-cal.appspot.com/api/ipo?page=0');
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // 証明書の検証を行わない
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);  // curl_execの結果を文字列で返す
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json;charset=utf-8'));
    $response = curl_exec($curl);

    $result2 = json_decode($response, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    foreach ($result2["data"] as $key => $val) {
        $result = getIpo($pdo, $val);
        if ($result[0] < 1) {
            setIpo($pdo, $val);
        }
    }
curl_close($curl);

} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function getIpo($pdo, $val)
{

    $ipo_id = $val['_id'];
    $sql = "SELECT count(1) FROM ipo WHERE ipo_id = '$ipo_id'";

    $result = $pdo->query($sql);

    $aryItem = $result->fetch();
    return $aryItem;
}
function setIpo($pdo, $val)
{
    $ipo_id = $val['_id'];
    $code = $val['code'];
    $date = $val['date'];
    $name = $val['name'];
    $market_key= $val['market_key'];
    $market_name = $val['market_name'];
    $sector_key = $val['sector_key'];
    $sector_name = $val['sector_name'];
    $url = $val['url'];
    $p_kari = $val['p_kari'];
    $v_kobo = $val['v_kobo'];
    $p_uri = $val['p_uri'];
    $v_uri = $val['v_uri'];
    $unit = $val['unit'];

    $sql = "
INSERT INTO ipo (
      ipo_id,
      code,
      date,
      name,
      market_key,
	  market_name,
      sector_key,
      sector_name,
      url,
      p_kari,
      v_kobo,
      p_uri,
      v_uri,
      unit,
      country
    ) values (
       '$ipo_id',
       '$code',
       '$date',
       '$name',
       '$market_key',
       '$market_name',
       '$sector_key',
       '$sector_name',
       '$url',
       '$p_kari',
       '$v_kobo',
       '$p_uri',
       '$v_uri',
       '$unit',
       'JP'
    )";
    return $pdo->query($sql);
}