<?php


ini_set('mbstring.internal_encoding', 'UTF-8');

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える

function honyaku($source_text)
{

    $deepl_api_url = 'https://api-free.deepl.com/v2/translate';
    $your_api_key = '29b5da12-27e9-c8f9-c109-51f298b7b08d:fx';

    $header = [
        'Content-Type: application/x-www-form-urlencoded',
    ];
    $content = [
        'auth_key' => $your_api_key,
        'text' => $source_text,
        'source_lang' => 'EN',
        'target_lang' => 'JA',
    ];

    $params = [
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $header),
            'content' => http_build_query($content, '', '&'),
        ]
    ];

    $request = file_get_contents(
        $deepl_api_url,
        false,
        stream_context_create($params)
    );
    $result = json_decode($request);

    return $result->translations[0]->text;
}

function set($dbh, $id, $longBusinessSummary, $stock_name)
{
    $sql = "
INSERT INTO market_translation (
      marketstock_id,
      company,
      overview,
      update_at
    ) values (
       '$id',
       '$longBusinessSummary',
       '$stock_name',
       current_timestamp
    )";

    return $dbh->query($sql);
}

function check($pdh, $id)
{

    $sql = "SELECT count(1) FROM market_translation WHERE marketstock_id = '$id'";

    $result = $pdh->query($sql);

    $aryItem = $result->fetch();
    return $aryItem;
}

function get($pdo)
{

    $sql = "SELECT ms.id, ms.stock_name, msi.data as info 
FROM marketstock AS ms
INNER JOIN marketstockinfo as msi ON msi.marketstock_id = ms.id";

    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}


try {

    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);

    $getStock = get($pdo);
    foreach ($getStock as $val) {

        $rel = check($pdo, $val['id']);
        if ($rel[0] < 1) {

            $stock_name = honyaku($val['stock_name']);
            $info = json_decode($val['info']);
            $longBusinessSummary = honyaku($info->longBusinessSummary);

            if ($longBusinessSummary !== null || $stock_name !== null) {
                set($pdo, $val['id'], $longBusinessSummary, $stock_name);
            }
        }
    }

} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}
