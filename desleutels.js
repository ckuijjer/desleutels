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
            var rented = $this.find('.PriceColumn p.RedColor').text();
            var infoUrl = $this.find('.ReactColumn a').attr('href');
            var photo = $this.find('.PhotoColumn img').attr('src');

            var photoHtml = '<img src="' + photo + '" />';

            feed.item({
                title: address + ' ' + price + ' ' + rented,
                url: baseUrl + infoUrl,
                description: photoHtml + addressBlock + ' ' + price + ' ' + rented,
                guid: infoUrl
            });
        });

    var xml = feed.xml();
    process.stdout.write(xml);
});
