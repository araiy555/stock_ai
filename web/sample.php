<?php

$weekday = array(
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"
);

// 2016年から3年分取得

for ($now_year = 2022; $now_year <= 2022; $now_year++) {

    for ($now_month = 1; $now_month <= 12; $now_month++) {
        $countdate = date('t', strtotime("{$now_year}/{$now_month}/1"));
        for ($day = 1; $day <= $countdate; $day++) { //今月の日数分ループする
            $w = date("w", mktime(0, 0, 0, $now_month, $day, $now_year));
            $month = sprintf('%02d', $now_month);
            $day = sprintf('%02d', $day);

            switch ($w) {
                case 0: //日曜日
                case 6: //土曜日
                    echo '<pre>';
                    echo "'{$now_year}-{$month}-{$day}', //{$weekday[$w]}\n";
                    echo '<pre>';
                    break;

                default:
                    break;
            }
        }
    }
}

