var express = require('express');
var request = require('request');
var router = express.Router();

var data = new Array();
var list = new Array();
var color = new Array(3);

var get_data = function() {
    console.log('Updating data...');
    request({
        url : 'http://opendata.epa.gov.tw/ws/Data/REWXQA/?$orderby=SiteName&$skip=0&$top=1000&format=json',
        method : 'GET'
    },function(error, response, body){
        if(!error){
            data = JSON.parse(body);
            for(var i = 0; i < data.length; i++){
                list[i] = data[i].SiteName;
            }
            console.log('Update successfully!');
            return;
        }
    });
};

get_data();
setInterval(get_data,1000*60*10);

router.get('/', function(req, res, next) {
    if(req.query.city){
        var code = req.query.city;
    }
    else{
        var code = 0;
    }
    console.log(data.length + ' data(s)');
    console.log('City code : ' + code);
    var psi = data[code].PSI;
    if(psi < 50){
        color = [0, 255, 0];
    }
    else if(psi < 100){
        color = [255, 255, 0];
    }
    else if(psi < 150){
        color = [255, 128, 0];
    }
    else if(psi < 200){
        color = [255, 0, 0];
    }
    else if (psi < 300) {
        color = [153, 0, 153];
    }
    else{
        color = [102, 0, 51];
    }
    res.render('index', { title: 'PM2.5', data: data[code], list: list, code: code,r: color[0], g: color[1], b: color[2]} );
});

module.exports = router;
