<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, 'https://newsapi.org/v2/top-headlines?country=jp&apiKey=d04fe253ccbc4b80b3de989cda8cf68b');
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // 証明書の検証を行わない
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);  // curl_execの結果を文字列で返す
    $response = curl_exec($curl);

    $apiResult = json_decode($response, true);

    foreach ($apiResult['articles'] as $key => $val) {
        $result = getNews($pdo, $val);
        if ($result[0] < 1) {
            setNews($pdo, $val);
        }
    }

    curl_close($curl);

} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function getNews($pdo, $val)
{

    $title = $val['title'];
    $sql = "SELECT count(1) FROM news WHERE title = '$title'";

    $result = $pdo->query($sql);

    $aryItem = $result->fetch();
    return $aryItem;
}

function setNews($dbh, $val)
{
    $news_id = $val['source']['id'];
    $name = $val['source']['name'];
    $author = $val['author'];
    $title = $val['title'];
    $description = $val['description'];
    $url = $val['url'];
    $urlToImage = $val['urlToImage'];
    $publishedAt = $val['publishedAt'];
    $content = $val['content'];

    $sql = "
INSERT INTO news (
      news_id,
      name,
      author,
      title,
      description,
	  url,
      urlToImage,
      publishedAt,
      content,
      contry,
      update_at
    ) values (
       '$news_id',
       '$name',
       '$author',
       '$title',
       '$description',
       '$url',
       '$urlToImage',
       '$publishedAt',
       '$content',
       'JP',
        current_timestamp
    )";
    return $dbh->query($sql);
}