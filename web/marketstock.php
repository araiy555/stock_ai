<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);


    for ($i = 0; $i <= 300; $i++) {

        $queryString = http_build_query([
            'access_key' => 'a54e1687262eda9a5362a63844d0e752',
            'limit' => '2000',
            'offset' => '2000' * $i,
        ]);
        $ch = curl_init(sprintf('%s?%s', 'http://api.marketstack.com/v1/tickers', $queryString));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $json = curl_exec($ch);
        curl_close($ch);

        $apiResult = json_decode($json, true);

        foreach ($apiResult['data'] as $stocksData) {
            $result = getStock($pdo, $stocksData);
            if ($result[0] < 1) {
                var_dump(setStock($pdo, $stocksData));
            }
        }

    }


} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}
function getStock($dbh, $apiResult)
{
    $symbol = $apiResult['symbol'];
    $sql = "SELECT count(1) FROM marketstock WHERE symbol = '$symbol'";

    $result = $dbh->query($sql);

    $aryItem = $result->fetch();
    return $aryItem;
}
function setStock($dbh, $apiResult)
{
    $stock_name = $apiResult['name'];
    $symbol = $apiResult['symbol'];
    $has_intraday = $apiResult['has_intraday'];
    $has_eod = $apiResult['has_eod'];
    $country = $apiResult['country'];
    $name = $apiResult['stock_exchange']['name'];
    $acronym = $apiResult['stock_exchange']['acronym'];
    $mic = $apiResult['stock_exchange']['mic'];
    $stock_exchange_country = $apiResult['stock_exchange']['country'];
    $stock_exchange_country_code = $apiResult['stock_exchange']['country_code'];
    $city = $apiResult['stock_exchange']['city'];
    $website = $apiResult['stock_exchange']['website'];

    $sql = "
INSERT INTO marketstock (
      stock_name,
      symbol,
      has_intraday,
      has_eod,
      country,
	  stock_exchange_name,
      acronym,
      mic,
      stock_exchange_country,
      stock_exchange_country_code,
      city,
      website
    ) values (
       '$stock_name',
       '$symbol',
       '$has_intraday',
       '$has_eod',
       '$country',
       '$name',
       '$acronym',
       '$mic',
       '$stock_exchange_country',
       '$stock_exchange_country_code',
       '$city',
       '$website'
    )";
    return $dbh->query($sql);
}