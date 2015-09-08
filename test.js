var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');
var items = [];

//var Url = 'http://m.byr.cn/board/ParttimeJob/';
var Url = 'http://m.byr.cn/article/ParttimeJob/458088'
var baseUrl = 'http://m.byr.cn/';

//获取一个页面的主题帖的url和titile
        superagent.get(Url).end(function(err,res){
            if(err) return console.log(err);
            $ = cheerio.load(res.text); 
            console.log($('.sp').text());
            });

async.mapSeries([1,2,3],function(item,callback){
    callback(null,item*2);
},function(err,result){
    console.log(result);
});
