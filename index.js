const newsPlatforms = require('./newsplatfroms');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;
const articles = [];

newsPlatforms.forEach((newspaper)=>{
    axios.get(newspaper.link)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                name: newspaper.name,
                title,
                url: newspaper.base + url
            })
        })
    })
    .catch(err=>{
        console.log("Error: Opps! Sever side error.")
    })
})

app.get('/', (req, res)=>{
    res.json(articles)
})

app.listen(port, ()=>{
    console.log("Server is listening on port " + port);
})