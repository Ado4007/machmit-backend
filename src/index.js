const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fetch = require('node-fetch');
const db = require('mysql-promise')();

db.configure({
	host: 'localhost',
	user: 'machmit',
	password: 'um2UWTSDvzFWAkYiPPtf',
	database: 'machmit'
});
const statusURL = 'https://api.blockcypher.com/v1/ltc/main/addrs';
const settings = { method: "Get" };

const app = express();
app.use(cors());

app.get('/projects', (req, res) => {
	console.log('som kokot');
	db.query('SELECT id,name,description,litecoin_address,image FROM projects p', async (err, rows, fields) => {
		if (err) {
			console.log(err);
			return;
		}
		for (let project of rows) {
			let resp = await fetch(statusURL + '/' + project['litecoin_address']  + '/balance', settings);
	                resp = await resp.json();
        	        project.votes = resp.final_balance/1000;
	                console.log("processed");
			await db.query('SELECT name, text FROM comments WHERE project_id = ?', [project['id']], (err, rows, fields) => {
			if (err) {console.log(err); return;}
				project.comments = rows;
			});
		}
		console.log("processed");
		res.json({projects: rows});
	});
});


app.get('/projects/:id', (req, res) => {
	console.log('som kokot');
        db.query('SELECT id,name,description,litecoin_address,image FROM projects WHERE id=?', [req.params.id], async (err, rows, fields) => {
                if (err) {
                        console.log(err);
                        return;
                }
		let project = rows[0];
		//console.log(project);
		let resp = await fetch(statusURL + '/' + project['litecoin_address']  + '/balance', settings);
		resp = await resp.json();
		project.votes = resp.final_balance/1000;
                console.log("processed");
//		console.log(project)
                res.json({project: project});
        });
});

app.listen(5000, () =>
	console.log('listening at 5000'),
);


