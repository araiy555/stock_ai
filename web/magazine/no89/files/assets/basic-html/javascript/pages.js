
    pageList = [{}
    
      ,{"item" : "page1", "title" : "1",  "src" : "../flash/pages/page0001_s.jpg"}
    
      ,{"item" : "page2", "title" : "2",  "src" : "../flash/pages/page0002_s.jpg"}
    
      ,{"item" : "page3", "title" : "3",  "src" : "../flash/pages/page0003_s.jpg"}
    
      ,{"item" : "page4", "title" : "4",  "src" : "../flash/pages/page0004_s.jpg"}
    
      ,{"item" : "page5", "title" : "5",  "src" : "../flash/pages/page0005_s.jpg"}
    
    ]

    function getPageTmb(num){
      var  i=1;
      var src=false;
      while(pageList[i]){
        if(pageList[i].title == num) {
          src = pageList[i].src;
          break;
        }
        i++;
      }
      return src;
    }
     function getSrcByTmbName(num){
        var  i=1;
        var src=false;
        while(pageList[i]){
            if(pageList[i].item == num) {
                src = pageList[i].src;
                break;
            }
            i++;
        }
        return src;
    }
       
  	function getPageSeo(num){
      var  i=1;
      var item=false;
      while(pageList[i]){
        if(pageList[i].title == num) {
          item = pageList[i].item;
          break;
        }
        i++;
      }
      return item;
    }
  