let url = location.pathname;

jQuery(document).on('input', '#search-text', function (e) {
    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/autocomplete.php',
        type: 'GET',
        dataType: 'json',
        cache: true,
        data: {q: jQuery('#search-text').val()}
    }).done(function (data) {
        jQuery("#searchNext ul").remove();
        jQuery('#searchNext').append('<ul></ul>');
        jQuery.each(data, function (index, value) {
            let serch_text = '<li><a href="/search?value=' + value.overview + '">' + value.overview + '</a></li>';
            jQuery('#searchNext ul').append(serch_text);
        });

    }).fail(function (data) {
    });
});


if (url.match('/')) {

    jQuery(function () {

        jQuery.ajax({
            url: 'https://stocktown.versus.jp/api/moneyorder.php',
            type: 'GET',
            dataType: 'json'
        }).done(function (data) {
            jQuery.each(data, function (index, value) {
                if (value['code_name'] === '^N225') {

                    jQuery('#n225_time').append('(' + value['create_at'] + ')');
                    jQuery('#n225_rate').append(value['rate'] + '%');
                    jQuery('#n225_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === '000001.SS') {

                    jQuery('#000001_time').append('(' + value['create_at'] + ')');
                    jQuery('#000001_rate').append(value['rate'] + '%');
                    jQuery('#000001_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === '^NSEI') {
                    jQuery('#NSEI_time').append('(' + value['create_at'] + ')');
                    jQuery('#NSEI_rate').append(value['rate'] + '%');
                    jQuery('#NSEI_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === '^HSI') {

                    jQuery('#HSI_time').append('(' + value['create_at'] + ')');
                    jQuery('#HSI_rate').append(value['rate'] + '%');
                    jQuery('#HSI_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === '^GSPC') {

                    jQuery('#SP500_time').append('(' + value['create_at'] + ')');
                    jQuery('#SP500_rate').append(value['rate'] + '%');
                    jQuery('#SP500_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === '^DJI') {
                    jQuery('#DJI_time').append('(' + value['create_at'] + ')');
                    jQuery('#DJI_rate').append(value['rate'] + '%');
                    jQuery('#DJI_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === '^NDX') {

                    jQuery('#NDX_time').append('(' + value['create_at'] + ')');
                    jQuery('#NDX_rate').append(value['rate'] + '%');
                    jQuery('#NDX_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === '^VIX') {

                    jQuery('#CBOE_time').append('(' + value['create_at'] + ')');
                    jQuery('#CBOE_rate').append(value['rate'] + '%');
                    jQuery('#CBOE_today').append(Math.round(value['today'] * 10) / 10);
                }

                if (value['code_name'] === 'USDJPY=X') {

                    jQuery('#USD_time').append('(' + value['create_at'] + ')');
                    jQuery('#USD_rate').append(value['rate'] + '%');
                    jQuery('#USD_today').append(Math.round(value['today'] * 10) / 10 + ' 円');
                }

                if (value['code_name'] === 'EURJPY=X') {

                    jQuery('#EUR_time').append('(' + value['create_at'] + ')');
                    jQuery('#EUR_rate').append(value['rate'] + '%');
                    jQuery('#EUR_today').append(Math.round(value['today'] * 10) / 10 + ' 円');
                }

                if (value['code_name'] === 'AUDJPY=X') {

                    jQuery('#AUD_time').append('(' + value['create_at'] + ')');
                    jQuery('#AUD_rate').append(value['rate'] + '%');
                    jQuery('#AUD_today').append(Math.round(value['today'] * 10) / 10 + ' 円');
                }


                if (value['code_name'] === 'CADJPY=X') {
                    jQuery('#CAD_time').append('(' + value['create_at'] + ')');

                    jQuery('#CAD_rate').append(value['rate'] + '%');
                    jQuery('#CAD_today').append(Math.round(value['today'] * 10) / 10 + ' 円');
                }

                if (value['code_name'] === 'GBPJPY=X') {

                    jQuery('#GBP_time').append('(' + value['create_at'] + ')');
                    jQuery('#GBP_rate').append(value['rate'] + '%');
                    jQuery('#GBP_today').append(Math.round(value['today'] * 10) / 10 + ' 円');
                }

            });
        }).fail(function (data) {
        });

        jQuery.ajax({
            url: 'https://stocktown.versus.jp/api/soaring.php',
            type: 'GET',
            dataType: 'json'
        }).done(function (data) {
            jQuery('#soaring_rize').append('<h1>上昇率</h1>');
            jQuery.each(data[0], function (index, value) {
                jQuery('#soaring_rize_list').append('<tr>\n' +
                    '<td><a href="/stock?value=' + value.symbol + '">' + value.overview + '</a></td>\n' +
                    '<td>' + value.soaring_rate + '</td>\n' +
                    '</tr>');
            });

            jQuery('#soaring_fall').append('<h1>下落率</h1>');
            jQuery.each(data[1], function (index, value) {
                jQuery('#soaring_fall_list').append('<tr>\n' +
                    '<td><a href="/stock?value=' + value.symbol + '">' + value.overview + '</a></td>\n' +
                    '<td>' + value.soaring_rate + '</td>\n' +
                    '</tr>');
            });

        }).fail(function (data) {
        });

        jQuery.ajax({
            url: 'https://stocktown.versus.jp/api/news.php',
            type: 'GET',
            dataType: 'json'
        }).done(function (data) {
            jQuery('#news_top').append('<h1>ニュース</h1>');
            jQuery.each(data, function (index, value) {
                const MAX_LENGTH = 30; //文字数上限
                let modStr = value.title;
                let description = value.description;
                let images = '<img style="width: 100px; height: 100px; border-radius: 10px;" src="' + value.urlToImage + '" onerror="this.src=\'/\'"/ >';

                if (value.title.length > MAX_LENGTH) {
                    modStr = value.title.substr(0, MAX_LENGTH) + '...'
                }
                if (value.description.length > 200) {
                    description = value.description.substr(0, MAX_LENGTH) + '...'
                }
                if (!value.urlToImage) {
                    images = '';
                }
                jQuery('#news').prepend('' +
                    '<div class="box">\n' +
                    '  <div class="text">\n' +
                    '    <h3><a href="' + value.url + '">' + modStr + '</a></h3>\n' +
                    '    <p class="description">' + description + '</p>\n' +
                    '    <p class="time"><i class="far fa-clock"></i>' + value.publishedAt + '</p>\n' +
                    '    <p class="author"><i class="fas fa-at"></i>' + value.author + '</p>\n' +
                    '  </div>\n' +
                    ' <div class="pict"></div>' +
                    '</div>\n');
            });

        }).fail(function (data) {
        });
    });
}


if (url === '/p/7-market-average') {


    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/index.php',
        type: 'GET',
        dataType: 'json',
        async: true,
        cache: false,
    }).done(function (data) {
        let dow_closing_price = parseInt(data[0].closing_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
        let n225_closing_price = parseInt(data[4].closing_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
        let nasdaq_closing_price = parseInt(data[2].closing_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
        let hongseng_closing_price = parseInt(data[1].closing_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
        let kospi_closing_price = parseInt(data[3].closing_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);

        jQuery('#n225').html('<!-- TradingView Widget BEGIN -->\n' +
            '<div class="tradingview-widget-container">\n' +
            '  <div class="tradingview-widget-container__widget"></div>\n' +
            '  <div class="tradingview-widget-copyright"><a href="https://jp.tradingview.com/symbols/FRED-NIKKEI225/" rel="noopener" target="_blank"><span class="blue-text">NIKKEI225相場</span></a></div>\n' +
            '  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>\n' +
            '  {\n' +
            '  "symbol": "FRED:NIKKEI225",\n' +
            '  "width": 350,\n' +
            '  "height": 220,\n' +
            '  "locale": "ja",\n' +
            '  "dateRange": "12M",\n' +
            '  "colorTheme": "light",\n' +
            '  "trendLineColor": "rgba(41, 98, 255, 1)",\n' +
            '  "underLineColor": "rgba(41, 98, 255, 0.3)",\n' +
            '  "underLineBottomColor": "rgba(41, 98, 255, 0)",\n' +
            '  "isTransparent": false,\n' +
            '  "autosize": false,\n' +
            '  "largeChartUrl": ""\n' +
            '}\n' +
            '  </script>\n' +
            '</div>\n' +
            '<!-- TradingView Widget END -->');
        jQuery('#dow').html('<!-- TradingView Widget BEGIN -->\n' +
            '<div class="tradingview-widget-container">\n' +
            '  <div class="tradingview-widget-container__widget"></div>\n' +
            '  <div class="tradingview-widget-copyright">TradingView提供の<a href="https://jp.tradingview.com/symbols/FRED-DJIA/" rel="noopener" target="_blank"><span class="blue-text">DJIA相場</span></a></div>\n' +
            '  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>\n' +
            '  {\n' +
            '  "symbol": "FRED:DJIA",\n' +
            '  "width": 350,\n' +
            '  "height": 220,\n' +
            '  "locale": "ja",\n' +
            '  "dateRange": "12M",\n' +
            '  "colorTheme": "light",\n' +
            '  "trendLineColor": "rgba(41, 98, 255, 1)",\n' +
            '  "underLineColor": "rgba(41, 98, 255, 0.3)",\n' +
            '  "underLineBottomColor": "rgba(41, 98, 255, 0)",\n' +
            '  "isTransparent": false,\n' +
            '  "autosize": false,\n' +
            '  "largeChartUrl": ""\n' +
            '}\n' +
            '  </script>\n' +
            '</div>\n' +
            '<!-- TradingView Widget END -->');
        jQuery('#nasdaq').html('<!-- TradingView Widget BEGIN -->\n' +
            '<div class="tradingview-widget-container">\n' +
            '  <div class="tradingview-widget-container__widget"></div>\n' +
            '  <div class="tradingview-widget-copyright">TradingView提供の<a href="https://jp.tradingview.com/symbols/FRED-NASDAQ100/" rel="noopener" target="_blank"><span class="blue-text">NASDAQ100相場</span></a></div>\n' +
            '  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>\n' +
            '  {\n' +
            '  "symbol": "FRED:NASDAQ100",\n' +
            '  "width": 350,\n' +
            '  "height": 220,\n' +
            '  "locale": "ja",\n' +
            '  "dateRange": "12M",\n' +
            '  "colorTheme": "light",\n' +
            '  "trendLineColor": "rgba(41, 98, 255, 1)",\n' +
            '  "underLineColor": "rgba(41, 98, 255, 0.3)",\n' +
            '  "underLineBottomColor": "rgba(41, 98, 255, 0)",\n' +
            '  "isTransparent": false,\n' +
            '  "autosize": false,\n' +
            '  "largeChartUrl": ""\n' +
            '}\n' +
            '  </script>\n' +
            '</div>\n' +
            '<!-- TradingView Widget END -->');
        jQuery('#hongseng').html('<!-- TradingView Widget BEGIN -->\n' +
            '<div class="tradingview-widget-container">\n' +
            '  <div class="tradingview-widget-container__widget"></div>\n' +
            '  <div class="tradingview-widget-copyright">TradingView提供の<a href="https://jp.tradingview.com/symbols/FRED-SP500/" rel="noopener" target="_blank"><span class="blue-text">SP500相場</span></a></div>\n' +
            '  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>\n' +
            '  {\n' +
            '  "symbol": "FRED:SP500",\n' +
            '  "width": 350,\n' +
            '  "height": 220,\n' +
            '  "locale": "ja",\n' +
            '  "dateRange": "12M",\n' +
            '  "colorTheme": "light",\n' +
            '  "trendLineColor": "rgba(41, 98, 255, 1)",\n' +
            '  "underLineColor": "rgba(41, 98, 255, 0.3)",\n' +
            '  "underLineBottomColor": "rgba(41, 98, 255, 0)",\n' +
            '  "isTransparent": false,\n' +
            '  "autosize": false,\n' +
            '  "largeChartUrl": ""\n' +
            '}\n' +
            '  </script>\n' +
            '</div>\n' +
            '<!-- TradingView Widget END -->');
        jQuery('#kospi').html('<!-- TradingView Widget BEGIN -->\n' +
            '<div class="tradingview-widget-container">\n' +
            '  <div class="tradingview-widget-container__widget"></div>\n' +
            '  <div class="tradingview-widget-copyright">TradingView提供の<a href="https://jp.tradingview.com/symbols/KRX-KOSPI/" rel="noopener" target="_blank"><span class="blue-text">KOSPI相場</span></a></div>\n' +
            '  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>\n' +
            '  {\n' +
            '  "symbol": "KRX:KOSPI",\n' +
            '  "width": 350,\n' +
            '  "height": 220,\n' +
            '  "locale": "ja",\n' +
            '  "dateRange": "12M",\n' +
            '  "colorTheme": "light",\n' +
            '  "trendLineColor": "rgba(41, 98, 255, 1)",\n' +
            '  "underLineColor": "rgba(41, 98, 255, 0.3)",\n' +
            '  "underLineBottomColor": "rgba(41, 98, 255, 0)",\n' +
            '  "isTransparent": false,\n' +
            '  "autosize": false,\n' +
            '  "largeChartUrl": ""\n' +
            '}\n' +
            '  </script>\n' +
            '</div>\n' +
            '<!-- TradingView Widget END -->');
    }).fail(function (data) {
        alert('通信失敗！');
    });
}


if (url.match('stock')) {

    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/stock.php',
        type: 'GET',
        dataType: 'json',
        async: true,
        cache: false,
        data: {search: getParam('value')}
    }).done(function (data) {
            if (!data.length) {
                alert('申し訳ありません。株情報が存在しません。');
            }

            jQuery('.price-box__exchange').text(data[0][6]);
            if (data[0].overview == null) {
                stock_name = data[0].stock_name;
            } else {
                stock_name = data[0].overview;
            }

            jQuery('.price-box__title').text(stock_name + '(' + data[0].symbol + ')');
            jQuery('.price-box__description').text(data[0].company);
            document.title = data[0].stock_name + ' - STOCKTOWN: ストックタウン ';

            let closing_price = parseInt(data[0].closing_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
            let open_price = parseInt(data[0].open_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
            let high_price = parseInt(data[0].high_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
            let low_price = parseInt(data[0].low_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
            let volume = parseInt(data[0].volume.replace(/\[/, ' ').replace(/\]/, ' '), 10);

            jQuery('#update_day').text('前日比 (' + data[0][23] + ')');
            jQuery('#closing_price').text(closing_price);
            jQuery('#open_price').text(open_price);
            jQuery('#high_price').text(high_price);
            jQuery('#low_price').text(low_price);
            jQuery('#volume').text(volume.toLocaleString() + '株');
            jQuery('#trading_price').text(data[0].trading_price);
            jQuery('#deviation').text(data[0].deviation + '%');

            let info = JSON.parse(data[0].info);
            console.log(data[0].qf);

            if (data[0].qf != '') {

                let quarterly_financials = data[0].qf;
                let Era_name = quarterly_financials.match(/.*/);
                let en = Era_name[0].split(/\s/);
                let arr0 = en.filter(function (s) {
                    return s !== '';
                });

                jQuery('#era_name0').text(arr0[0]);
                jQuery('#Income_Before_Tax0').text(arr0[1]);
                jQuery('#Total_Revenue0').text(arr0[2]);
                jQuery('#gross_profit0').text(arr0[3]);

                let ibt = quarterly_financials.match(/Income Before Tax .*/);
                let Income_Before_Tax = ibt[0].split(/\s/);
                let arr = Income_Before_Tax.filter(function (s) {
                    return s !== '' && s !== 'Income' && s !== 'Before' && s !== 'Tax';
                });
                jQuery('#era_name1').text(arr[0]);
                jQuery('#Income_Before_Tax1').text(arr[1]);
                jQuery('#Total_Revenue1').text(arr[2]);
                jQuery('#gross_profit1').text(arr[3]);

                let tr = quarterly_financials.match(/Total Revenue .*/);
                let Total_Revenue = tr[0].split(/\s/);
                let arr2 = Total_Revenue.filter(function (s) {
                    return s !== '' && s !== 'Total' && s !== 'Revenue';
                });

                jQuery('#era_name2').text(arr2[0]);
                jQuery('#Income_Before_Tax2').text(arr2[1]);
                jQuery('#Total_Revenue2').text(arr2[2]);
                jQuery('#gross_profit2').text(arr2[3]);

                let gp = quarterly_financials.match(/Gross Profit .*/);
                let gross_profit = gp[0].split(/\s/);
                let arr3 = gross_profit.filter(function (s) {
                    return s !== '' && s !== 'Gross' && s !== 'Profit';
                });

                jQuery('#era_name3').text(arr3[0]);
                jQuery('#Income_Before_Tax3').text(arr3[1]);
                jQuery('#Total_Revenue3').text(arr3[2]);
                jQuery('#gross_profit3').text(arr3[3]);
            }

        // let balance_sheet = data[0].balance_sheet.replace(/(\s|&nbsp;)+/g, ' ');
            //
           // let bs = quarterly_financials.match(/Total Stockholder Equity (.\S*)/);
            //
            // let bps = info.sharesOutstanding / 321195000;
            //
            // let pbr = closing_price / bps;
            //
            // jQuery('#pbr').text(pbr);
            // jQuery('#bps').text(bps);


            let images = '<img style="width: 100px; height: 100px; border-radius: 10px;" src="' + info.logo_url + '" onerror="this.src=\'/\'"/>';

            jQuery('.price-box__img').append(images);
            jQuery('#marketCap').text(info.marketCap.toLocaleString() + '円');
            jQuery('#sharesOutstanding').text(info.sharesOutstanding.toLocaleString() + '枚');
            jQuery('#dividend').text(info.dividendYield);
            jQuery('#short_ratio').text(info.shortRatio);
            jQuery('#roe').text(data[0].roe + '%');
            jQuery('#eps').text(data[0].eps);
            jQuery('#per').text(data[0].per + '倍');
            jQuery('#pbr').text(data[0].pbr);

            let test2 = [];

            jQuery.each(JSON.parse(data[0].data), function (index, value) {

                test2.push(
                    [new Date(value[0]), Math.floor(Number(value[1]))]
                );
                // test2.push({
                //   x: new Date(value[0]),
                //   y: [Number(value[1]), Number(value[2]), Number(value[3]), Number(value[4])]
                // });

            });
            // https://iexcloud.io/docs/api/#ceo-compensation
            //https://gray-code.com/html_css/side-by-side-for-text-and-thumbnail-image/
            //https://apexcharts.com/javascript-chart-demos/area-charts/datetime-x-axis/
            //<div class="price-box__body">
            //         <p class="price-box__price">-</p>
            //         <p class="price-box__description">-</p>
            //       </div>

            var options = {
                series: [{
                    data: test2
                }],
                chart: {
                    id: 'chart2',
                    type: 'line',
                    height: 230,
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    }
                },
                colors: ['#546E7A'],
                stroke: {
                    width: 3
                },
                dataLabels: {
                    enabled: false
                },
                fill: {
                    opacity: 1,
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    type: 'datetime'
                }
            };

            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();

            var optionsLine = {
                series: [{
                    data: test2
                }],
                chart: {
                    id: 'chart1',
                    height: 130,
                    type: 'area',
                    brush: {
                        target: 'chart2',
                        enabled: true
                    },
                    selection: {
                        enabled: true,
                        // xaxis: {
                        //   min: new Date('19 Jun 2017').getTime(),
                        //   max: new Date('14 Aug 2021').getTime()
                        // }
                    },
                },
                colors: ['#008FFB'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.91,
                        opacityTo: 0.1,
                    }
                },
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        enabled: false
                    }
                },
                yaxis: {
                    tickAmount: 2
                }
            };

            var chart = new ApexCharts(document.querySelector("#chart-line2"), optionsLine);
            chart.render();



        }
    ).fail(function (data) {
        alert('通信失敗！');
    });
}


if (url.match('search')) {
    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/search_stock.php',
        type: 'GET',
        dataType: 'json',
        async: true,
        cache: false,
        data: {search: getParam('value')}
    }).done(function (data) {
            if (data.length === 0) {
            }

            jQuery.each(data, function (index, value) {
                let info = JSON.parse(value.data);

                if (value.overview == null) {
                    stock_name = value.stock_name;
                } else {
                    stock_name = value.overview;
                }

                let closing_price = parseInt(value.closing_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
                let open_price = parseInt(value.open_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
                let high_price = parseInt(value.high_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
                let low_price = parseInt(value.low_price.replace(/\[/, ' ').replace(/\]/, ' '), 10);
                let volume = parseInt(value.volume.replace(/\[/, ' ').replace(/\]/, ' '), 10);


                jQuery('#search').append(
                    ' <div class="stock"><div class="pict"><img style="width: 100px; height: 100px; border-radius: 10px;" src="' + info.logo_url + '" onerror="this.src=\'/\'"/></div>' +
                    '    <h3 style="text-align: center"><a href="/p/stock?value=' + value.symbol + '">' + value.overview + '</a></h3>\n' +
                    '<div class="box">\n' +
                    ' <div class="text">\n' +
                    ' <p class="description">' + value.company + '</p>\n' +
                    '<p class="time"><i class="far fa-clock"></i>' + value.update_at + '</p>\n' +
                    '<p class="author"><i class="fas fa-at"></i>' + value.website + '</p>\n' +
                    '  </div>' +
                    '<div class="stock-nav">\n' +
                    '<h6><span id="update_day">前日比（' + value.update_at + '）</span></h6>      \n' +
                    '<table>\n' +
                    '<tr>\n' +
                    '<td >前日終値</td>\n' +
                    '<td id="closing_price">' + closing_price + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>始値</td>\n' +
                    '<td id="open_price">' + open_price + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>高値</td>\n' +
                    '<td id="high_price">' + high_price + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>安値</td>\n' +
                    '<td id="low_price">' + low_price + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>出来高</td>\n' +
                    '<td id="volume">' + volume + '</td>\n' +
                    '</tr>\n' +
                    '</table>\n' +
                    '<h6><span>参考指数</span></h6>\n' +
                    '   \n' +
                    '<table>\n' +
                    '       <tr>\n' +
                    '<td>時価総額</td>\n' +
                    '<td id="marketCap">' + info.marketCap.toLocaleString() + '円' + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>発行済株式数</td>\n' +
                    '<td id="sharesOutstanding">' + info.sharesOutstanding.toLocaleString() + '枚' + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>PER（株価収益率）</td>\n' +
                    '<td id="per">' + value.per + '倍</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>PBR（株価純資産倍率）</td>\n' +
                    '<td id="pbr">' + value.pbr + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>EPS（1株当たりの当期純利益）</td>\n' +
                    '<td id="eps">' + value.eps + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>ROE（株主資本利益率）</td>\n' +
                    '<td id="roe">' + value.roe + '%</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>配当利回り</td>\n' +
                    '<td id="dividend">' + info.dividendYield + '</td>\n' +
                    '</tr>\n' +
                    ' <tr>\n' +
                    '<td>空売り比率</td>\n' +
                    '<td id="short_ratio">' + info.shortRatio + '</td>\n' +
                    '</tr>\n' +
                    '</table>\n' +
                    '</div><hr>' +
                    '</div></div>');
            });

        }
    ).fail(function (data) {
        alert('通信失敗！');
    });
}
if (url.match('news')) {
    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/news.php',
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        // <div class="box">
        //     <div class="text">
        //     <h3>見出しが入ります</h3>
        //     <p>親譲りの無鉄砲で小供の時から損ばかりしている。</p>
        //   </div>
        //   <div class="pict"><img src="data:image/jpeg;base64,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" alt="iojijoijoj"></div>
        //     </div>
        jQuery.each(data, function (index, value) {
            const MAX_LENGTH = 30; //文字数上限
            let modStr = value.title;
            let description = value.description;
            let images = '<img style="width: 100px; height: 100px; border-radius: 10px;" src="' + value.urlToImage + '" onerror="this.src=\'/\'"/>';

            if (value.title.length > MAX_LENGTH) {
                modStr = value.title.substr(0, MAX_LENGTH) + '...'
            }
            if (value.description.length > 200) {
                description = value.description.substr(0, MAX_LENGTH) + '...'
            }
            if (!value.urlToImage) {
                images = '';
            }
            jQuery('#news').prepend('' +
                '<div class="box">\n' +
                '  <div class="text">\n' +
                '    <h3><a href="' + value.url + '">' + modStr + '</a></h3>\n' +
                '    <p class="description">' + description + '</p>\n' +
                '    <p class="time"><i class="far fa-clock"></i>' + value.publishedAt + '</p>\n' +
                '    <p class="author"><i class="fas fa-at"></i>' + value.author + '</p>\n' +
                '  </div>\n' +
                ' <div class="pict">' + images + '</div>' +
                '</div>\n');
        });

    }).fail(function (data) {
        alert('通信失敗！');
    });
}


if (url.match('cheap')) {
    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/cheap.php',
        type: 'GET',
        dataType: 'json',
        data: {
            market: getParam('market'),
            secter: getParam('secter')
        }
    }).done(function (data) {
        jQuery('#search-button').click(function () {
            var area_val = jQuery('[name=color]:checked').val();
            var data = {
                market: getParam('market'),
                secter: getParam('secter'),
                area_val: area_val
            };
            jQuery.ajax({
                url: 'https://stocktown.versus.jp/api/search.php',
                type: 'GET',
                dataType: 'json',
                data: data
            }).done(function (data) {

                jQuery('#osusume tr').remove();
                jQuery.each(data, function (index, value) {
                    if (value.overview == null) {
                        stock_name = value.stock_name;
                    } else {
                        stock_name = value.overview;
                    }

                    let cheap = '<tr><td><div><a href="/stock?value=' + value.symbol + '">' + stock_name + '</a></div></td><td><div class="stocktown-eps" style="text-align: center"> ' + value.eps + '</div></td><td><div class="stocktown-per" style="text-align: center"> ' + value.per + '倍</div></td><td><div class="stocktown-pbr" style="text-align: center"> ' + value.pbr + '</div></td><td><div class="stocktown-roe" style="text-align: center">' + value.roe + '％</div></td></tr>';

                    jQuery('#osusume').append(cheap);
                });
            }).fail(function (data) {
                alert('通信失敗！');
            });
        });


        jQuery.each(data, function (index, value) {
            if (value.overview == null) {
                stock_name = value.stock_name;
            } else {
                stock_name = value.overview;
            }
            jQuery('#osusume').append('' +
                '    <tr><td><div><a href="/stock?value=' + value.symbol + '">' + stock_name + '</a></div></td>\n' +
                '      <td><div class="stocktown-eps" style="text-align: center"> ' + value.eps + '</div></td>\n' +
                '      <td><div class="stocktown-per" style="text-align: center"> ' + value.per + '倍</div></td>\n' +
                '      <td><div class="stocktown-pbr" style="text-align: center"> ' + value.pbr + '</div></td>\n' +
                '      <td><div class="stocktown-roe" style="text-align: center">' + value.roe + '％</div></td>\n' +
                '      </tr>');
        });
        jQuery('.colorGroup').on('click', function () {
            if (jQuery(this).prop('checked')) {
                // 一旦全てをクリアして再チェックする
                jQuery('.colorGroup').prop('checked', false);
                jQuery(this).prop('checked', true);
            }
        });
    }).fail(function (data) {
        alert('通信失敗！');
    });


}


if (url.match('ipo')) {
    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/ipo.php',
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        jQuery.each(data, function (index, value) {

            jQuery('#ipo').append('' +
                '    <tr>' +
                '<td class="icon bird"><div>' +
                '<a href="' + value.url + '"><i class="fa fa-connectdevelop"></i>' + value.name + '</a></div></td>\n' +
                '<td><div style="text-align: center">' + value.sector_name + '</div></td>\n' +
                '      <td><div style="text-align: center">' + value.market_name + '</div></td>\n' +
                '      <td><div style="text-align: center"> ' + value.date + '</div></td>\n' +
                '      <td><div style="text-align: center">' + value.p_kari + '</div></td>\n' +
                '      </tr>');
        });


    }).fail(function (data) {
        alert('通信失敗！');
    });
}

if (url.match('earnings_calendar')) {
    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/earnings_calendar.php',
        type: 'GET',
        dataType: 'json'
    }).done(function (data) {
        jQuery.each(data, function (index, value) {
            jQuery('#osusume').append('' +
                '<tr>' +
                '<td class="icon bird"><div>' +
                '<a href="/p/stock?value=' + value.symbol + '">' + value.overview + '</a></div></td>\n' +
                '<td><div>' + value.calendar_start + ' ～ ' + value.calendar_end + '</div></td>\n' +
                '      </tr>');
        });


    }).fail(function (data) {
        alert('通信失敗！');
    });
}

function hoge(code) {
    if (13 === code) {
        const textbox = document.getElementById("search-text");
        const value = textbox.value.trim();

        if (value !== '') {
            window.location.href = '/search?value=' + value; // 通常の遷移
        }
    }
}

/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\jQuery&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|jQuery)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent
    (results[2].replace(/\+/g, " "));
}


function inquiry() {
    jQuery.ajax({
        url: 'https://stocktown.versus.jp/api/sendgrid.php',
        type: 'GET',
        dataType: 'json',
        data: {
            name: jQuery('#name').val(),
            message: jQuery('#message').val(),
            phone: jQuery('#phone').val(),
            mail: jQuery('#mail').val()
        }
    }).done(function (data) {
        alert(data);
    }).fail(function (data) {
        alert(data);
    });
}


