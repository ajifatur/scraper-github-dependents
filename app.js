const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    axios
        .get('https://github.com/ajifatur/faturhelper/network/dependents')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let data = [];
                $('.Box-row').each(function(i, elem) {
                    data[i] = {
                        user_name: $(elem).find('a[data-hovercard-type="user"]').text(),
                        user_url: "https://github.com" + $(elem).find('a[data-hovercard-type="user"]').attr('href'),
                        repo_name: $(elem).find('a[data-hovercard-type="repository"]').text(),
                        repo_url: "https://github.com" + $(elem).find('a[data-hovercard-type="repository"]').attr('href')
                    };
                });
                data = data.filter(n => n !== undefined);
                res.json(data);
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});