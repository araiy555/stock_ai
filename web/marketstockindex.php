<?php


ini_set('mbstring.internal_encoding', 'UTF-8');

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える



function get($pdo)
{

    $sql = "SELECT ms.id, msi.closing_price, msi.open_price, msi.high_price, msi.low_price, msi.volume, msi.trading_price, msi.data as info, msi.balance_sheet 
FROM marketstock AS ms
INNER JOIN marketstockinfo as msi ON msi.marketstock_id = ms.id";

    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}


function setindexUpdate($dbh, $id, $per, $roe, $trailingEps, $pbr)
{

    $sql = "
UPDATE marketstockindex SET 
      per = '$per',
      eps = '$trailingEps',
      roe = '$roe',
      pbr = '$pbr',
      update_at = current_timestamp  
WHERE marketstock_id = '$id'
";
    return $dbh->query($sql);
}

function check($pdh, $id)
{

    $sql = "SELECT count(1) FROM marketstockindex WHERE marketstock_id = '$id'";

    $result = $pdh->query($sql);

    $aryItem = $result->fetch();
    return $aryItem;
}

function setindex($dbh, $id, $rer, $roe, $trailingEps, $pbr)
{
    $sql = "
INSERT INTO marketstockindex (
      marketstock_id,
      per,
      eps,
      roe,
      pbr,
      update_at
    ) values (
       '$id',
       '$rer',    
       '$trailingEps',
       '$roe',
       '$pbr',
       '$trailingEps',
       current_timestamp
    )";

    return $dbh->query($sql);
}




try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);

    $getStock = get($pdo);


    foreach ($getStock as $val) {

        $closing_price = preg_replace('/\[|\]/', '', $val['closing_price']);
        $closing_price = floor($closing_price);
        $info = json_decode($val['info']);
        ## PER(株価収益率) = 株価/EPS
        $per = (int)$closing_price / $info->trailingEps;
        $roe = $info->returnOnEquity * 100;

        // BPS = 純資産÷発行済み株式数
        preg_match("/Total Assets (.*) /", $val['balance_sheet'],$matches);
        $balance_sheet =  trim($matches[1]);
        $balance_sheets = explode("  ", $balance_sheet);
        $bps = $balance_sheets[0] / $info->sharesOutstanding;

        // PBR = 株価 / BPS
        $pbr = (int)$closing_price / (int)$bps;

        $per = floor($per) . PHP_EOL;

        $rel = check($pdo, $val['id']);
        if ($rel[0] < 1) {
            $result = setindex($pdo, $val['id'], (int)$per, (int)$roe, (int)$info->trailingEps,floor($pbr));
        } else {
            $result = setindexUpdate($pdo, $val['id'], (int)$per, (int)$roe, (int)$info->trailingEps,floor($pbr));
        }

    }

//時価総額 	1756919758848
//発行済株式数 	506440992
//PER（株価収益率） 	60倍
//EPS（1株当たりの当期純利益） 	57.395
//ROE（株主資本利益率） 	31%
//配当利回り
//空売り比率 	1.5

} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}
