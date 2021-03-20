const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fetch = require('node-fetch');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'machmit',
	password: 'um2UWTSDvzFWAkYiPPtf',
	database: 'machmit'
});
const statusURL = 'https://api.blockcypher.com/v1/ltc/main/addrs';
const settings = { method: "Get" };

const app = express();
app.use(cors());
connection.connect();

app.get('/projects', (req, res) => {
	console.log('som kokot');
	connection.query('SELECT id,name,description,litecoin_address,image FROM projects', (err, rows, fields) => {
		if (err) {
			console.log(err);
			return;
		}
		fetch(statusURL, settings).then(res => res.json()).then((json) => {});
		console.log("processed");
		res.json({projects: rows});
	});
});


app.get('/projects/:id', (req, res) => {
	console.log('som kokot');
        connection.query('SELECT id,name,description,litecoin_address,image FROM projects WHERE id=?', [req.params.id], (err, rows, fields) => {
                if (err) {
                        console.log(err);
                        return;
                }
		let project = rows[0];
		console.log(typeof project);
		fetch(statusURLi + '/' + project['litecoin_address']  + '/balance', settings).then(res => res.json()).then((json) => {console.log(json)});
                console.log("processed");
                res.json({project: project});
        });
});

app.listen(5000, () =>
	console.log('listening at 5000'),
);


