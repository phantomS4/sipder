var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');
var items = [];
var concurrencyCount = 0;

var Url = 'http://m.byr.cn/board/ParttimeJob';
var baseUrl = 'http://m.byr.cn/';

//获取一个页面的主题帖的url和titile
function page(pageurl,callback,cb)
{
        items = [];
        superagent.get(pageurl).end(function(err,res){
            if(err) return console.log(err);
            $ = cheerio.load(res.text); 
            var count = 0;
            $('li','.list').each(function(idx,element){
                var $element = $(element);
                var turl = $element[0].children[0].children[0].attribs['href'];
                var title = $element[0].children[0].children[0].children[0].data;
                turl = url.resolve(baseUrl,turl);
                console.log(turl);
                console.log(title);
                items.push({'title':title,'url':turl});
            });
            callback(cb);
        });
}

//获取一个主题的页面内容
function getContent(articleurl,title,callback)
{
    concurrencyCount++;
    superagent.get(articleurl).end(function(err,res){
       if(err) return console.log(err); 
        
       console.log('现在的并发数是：' + concurrencyCount + ',正在爬取' + articleurl  );
       $ = cheerio.load(res.text);
       var content = $('.sp','#m_main').text();
       callback(null,content);
       concurrencyCount--;
    });        
}

//同时发起5条请求
function startDown(cb)
{
    async.mapLimit(items,5,function(item,callback){
        getContent(item.url,item.text,callback);
    },function(err,result){
        console.log('final:');
        cb(null,result);
    });
}
//执行爬取
var args = process.argv;
if(args.length == 2)
{
        page(Url,startDown,function(err,result){
            console.log(result);
        });
}
else
{
    console.log(typeof args[2]);
    if(args[2] >= 1)
    {
        var pages = [];
        for(var i = 1; i <= args[2] ; i++)
        {
            pages.push(Url + '?' + i);

        }
        async.mapSeries(pages,function(pageurl,callback){
            console.log('pages:' + pageurl);
            page(pageurl,startDown,callback);
        },function(err,result){
            console.log(result);
        });
    }
}
