<?php

try {

    $folder_name = $_REQUEST['c'];

    define('BASE_URL', 'https://' . $_SERVER['SERVER_NAME'] . '/magazine/');
    define('LIB_URL', BASE_URL . 'libraries/');
    define('IMG_URL', BASE_URL . $folder_name . '/files/assets/common/page-substrates');
    define('IMG_THUMBNAIL_URL', BASE_URL . $folder_name . '/files/assets/flash/pages');

    $img_thumbnail_path = '/home/users/2/versus.jp-stocktown/web/magazine/' . $folder_name . '/files/assets/flash/pages';
    $img_path = '/home/users/2/versus.jp-stocktown/web/magazine/' . $folder_name . '/files/assets/common/page-substrates';

    if (!file_exists($img_path) || !file_exists($img_thumbnail_path)) {
        throw new Exception('ディレクトリが存在しません。');
    }

    if ($handle = opendir($img_path)) {
        $result = array();
        while (false !== ($file = readdir($handle))) {
            if (preg_match('/^page\d{1,4}.jpg/', $file)) {
                $result[] = $file;
            }
        }
        closedir($handle);
        sort($result);
    } else {
        throw new Exception('ディレクトリが開けませんでした。');
    }

    $thumbnails = array();
    foreach ($result as $index => $page) {

        $is_thumbnail_path = false;
        $page_thumbnail = str_replace(".jpg", "_s.jpg", $page);

        if (file_exists($img_thumbnail_path .'/'. $page_thumbnail)) {
            $is_thumbnail_path = true;
        }

        $image_name = $is_thumbnail_path ? $page_thumbnail : $page;
        $thumbnail_url = IMG_THUMBNAIL_URL . '/' . $image_name;

        $thumbnail_name = sprintf("page%d", ($index + 1));

        $thumbnails[$thumbnail_name] = $thumbnail_url;
    }

    $image_count = count($result);
} catch (Exception $e) {
    header("Location: " . "/error");
    exit;
}
