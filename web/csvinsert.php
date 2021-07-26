<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える

$row = 1;
$test = [];
try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);

    // ファイルが存在しているかチェックする
    if (($handle = fopen("csv/AX/BHP.csv", "r")) !== false) {
        // 1行ずつfgetcsv()関数を使って読み込む
        while (($data = fgetcsv($handle))) {
            foreach ($data as $value) {
                $test[$row][] = $value;
            }
            $row++;
        }
        $data = json_encode($test);

        setChart($pdo, $data);
        var_dump($data);
        fclose($handle);
    }

} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}


function setChart($dbh, $val)
{

    $sql = "
INSERT INTO marketstockchart (
      marketstock_id,
      date,
      update_at
    ) values (
       1,
       '$val',
        current_timestamp
    )";
    return $dbh->query($sql);
}