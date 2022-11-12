<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える
header('Access-Control-Allow-Origin: *');

try {
    $tenbagger[] = [];
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $result = getNews($pdo);
    delete($pdo);
    echo '<pre>';

    foreach ($result as $key => $value) {

        if (preg_match("/.*/", $value['balance_sheet'])) {
            $Era_name = explode("/\s/", $value['balance_sheet']);
            preg_match("/Total Assets .*/", $Era_name[0], $TotalAssets);
            $array = explode(' ', $TotalAssets[0]);
            $array = array_reverse(array_diff($array, ["Total", "Assets", ""]), true);

            $first = array_key_first($array);
            $last = array_key_last($array);

            for ($i = 0; $i <= count($array); $i++) {
                $error = false;
                if (isset($array[$i])) {
                    if (intval($array[$i + 1]) < intval($array[$i])) {
                        $error = true;
                        break;
                    }
                }
            }

            if (intval(intval($array[$last]) >= intval(intval($array[$first])))) {

                if (preg_match("/.*/", $value['qf'])) {
                    $Era_name = explode("/\s/", $value['qf']);
//                    var_dump($Era_name);
                    preg_match("/Income Before Tax .*/", $Era_name[0], $IncomeBeforeTax);

                    $array = explode(' ', $IncomeBeforeTax[0]);
                    $array = array_merge(array_reverse(array_diff($array, ["Income", "Before", "Tax", "", " 0 "]),
                        true));

                    for ($i = 0; $i <= count($array); $i++) {
                        $error = false;
                        if (array_key_exists($i + 1, $array)) {
                            if (isset($array[$i])) {
//                            var_dump(intval($array[$i + 1]));
//                            echo '---------------';
//                            var_dump(intval($array[$i]));
                                if (intval($array[$i + 1]) <= intval($array[$i])) {
                                    $error = true;
                                    break;
                                }
                            }
                        }
                    }

                    if ($error === true) {
                        continue;
                    }

                    preg_match("/Total Revenue .*/", $Era_name[0], $TotalRevenue);

                    $array = explode(' ', $TotalRevenue[0]);
                    $array = array_merge(array_reverse(array_diff($array, ["Total", "Revenue", "", " 0 "]), true));

                    for ($i = 0; $i <= count($array); $i++) {
                        $error = false;
                        if (array_key_exists($i + 1, $array)) {
//                            var_dump(intval($array[$i + 1]));
//                            echo '---------------';
//                            var_dump(intval($array[$i]));
                            if (intval($array[$i + 1]) <= intval($array[$i])) {
                                $error = true;
                                break;
                            }
                        }
                    }

                    if ($error === true) {
                        continue;
                    }

                    $data = json_decode($value['data'], true);

                    if (intval($data['marketCap']) > 300000000000) {
                        continue;
                    }

                    var_dump($value['listing_date']);
                    var_dump($value['stock_name']);

                    set($pdo, $value['id']);

                }
            }
        }
    }
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function getNews($pdo)
{

    $sql = "SELECT ms.*, msi.deviation, msi.data, msi.financials as qf, msi.balance_sheet , msid.roe, msc.listing_date
FROM marketstock AS ms
INNER JOIN marketstockinfo as msi ON msi.marketstock_id = ms.id
INNER JOIN marketstockindex as msid ON msid.marketstock_id = ms.id
INNER JOIN marketstockchart as msc ON msc.marketstock_id = ms.id
WHERE msi.financials != '' AND msi.balance_sheet != '' AND msid.roe > 5 AND msc.listing_date BETWEEN NOW() - INTERVAL 8 YEAR AND CAST(CURRENT_TIMESTAMP as date);
";


    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}


function set($dbh, $id)
{
    $sql = "
INSERT INTO tenbagger (
      marketstock_id,
      update_at
    ) values (
       '$id',
        current_timestamp
    )";
    return $dbh->query($sql);
}


function delete($dbh)
{
    $sql = "DELETE FROM tenbagger";
    return $dbh->query($sql);
}