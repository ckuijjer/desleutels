var cheerio = require('cheerio');
var request = require('request');
var Rss = require('rss');

var baseUrl = 'http://desleutels.woningnethollandrijnland.nl'
var url = baseUrl + '/Zoeken/model-Koop%20en%20Vrijesectorhuur/page-1,20';

request(url, function(err, response, body) {
    var feed = new Rss({
        title: 'de Sleutels koop en vrijesector',
        feed_url: url,
        site_url: url,
        author: 'Casper Kuijjer'
    });

    var $ = cheerio.load(body);

    $('#results .ResultBox')
        .each(function() {
            var $this = $(this);

            var address = $this.find('.AdressColumn h6').text();
            var addressBlock = $this.find('.AdressColumn').text();
            var price = $this.find('.PriceColumn h6').text().replace(/\n/g, '').replace(/\s+/g, ' ');
            var infoUrl = $this.find('.ReactColumn a').attr('href');

            feed.item({
                title: address + ' ' + price,
                url: baseUrl + infoUrl,
                description: addressBlock + ' ' + price, 
                guid: infoUrl
            });
        });

    var xml = feed.xml();
    process.stdout.write(xml);
});
