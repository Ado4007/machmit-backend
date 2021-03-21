const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fetch = require('node-fetch');
const db = require('mysql-promise')();
const fs = require('fs');
const https = require('https');

const key = fs.readFileSync('/etc/letsencrypt/live/vmi254279.contaboserver.net/privkey.pem');
const cert = fs.readFileSync('/etc/letsencrypt/live/vmi254279.contaboserver.net/fullchain.pem');
const options = {
  key: key,
  cert: cert
};

db.configure({
	host: 'localhost',
	user: 'machmit',
	password: 'um2UWTSDvzFWAkYiPPtf',
	database: 'machmit'
});
const statusURL = 'https://api.blockcypher.com/v1/ltc/main/addrs';
const settings = { method: "Get" };

const token = "dc438169a62e4abdac886d364a5e8a14";

const app = express();
app.use(cors());

app.get('/projects', async(req, res) => {
	console.log('som kokot');
	const rows = await db.query('SELECT id,name,description,long_description,litecoin_address,image FROM projects p');
	//console.log(rows[0]);
	/*let addresses = [];
	let projectsId = {};
	for (let project of rows[0]) {
		addresses.push(project['litecoin_address']);
		projectsId[project['litecoin_address']] = project['litecoin_address'];
	}

	console.log(addresses.join(";"));
	let resp = await fetch(statusURL + '/' + addresses.join(";") + '/balance?token='+token, settings);
	resp = await resp.json();
	console.log(resp);
	for(let addr of resp) {
		projectsId[addr.address].votes = addr.final_balance/1000
	}*/
	console.log("processed");
	res.json({projects: rows[0]});
});


app.get('/projects/:id', async (req, res) => {
	console.log('som kkt');
	let project;
     /*   db.query('SELECT id,name,description,litecoin_address,image FROM projects WHERE id=?', [req.params.id], async (err, rows, fields) => {
                if (err) {
                        console.log(err);
                        return;
                }
		console.log('query processed');
		let project = rows[0];
		//console.log(project);
		let resp = await fetch(statusURL + '/' + project['litecoin_address']  + '/balance', settings);
		resp = await resp.json();
		project.votes = resp.final_balance/1000;
                console.log("processed");
//		console.log(project)
                await db.query('SELECT name, text FROM comments WHERE project_id = ?', [project['id']], (err, rows, fields) => {
			                                if (err) {console.log(err); return;}
			                                project.comments = rows;
			                        });
		res.json({project: project});
        });*/
    console.log("ID",req.params.id);
    let rows = await db.query('SELECT id,name,description,long_description,litecoin_address,image,budget,user,location FROM projects WHERE id=?', [req.params.id]);    
    
    /*project = rows[0][0];
	let resp = await fetch(statusURL + '/' + project['litecoin_address']  + '/balance?token='+token, settings);
	resp = await resp.json();
	console.log(resp);
	project.votes = resp.final_balance/1000;*/

	console.log("processed ",project.id);
	rows = await db.query('SELECT name, text FROM comments WHERE project_id = ?', [project['id']]);
	console.log("Comments: ",rows);

	project.comments = rows[0];
	res.json({project: project});

	/*db.query('SELECT id,name,description,litecoin_address,image FROM projects WHERE id=?', [req.params.id]).then( (err, rows, ) => {
		project = rows[0];
		let resp =  fetch(statusURL + '/' + project['litecoin_address']  + '/balance', settings);
		project.votes = resp.final_balance/1000;
		console.log("processed ",project.id);
	        //res.json({project: project});
		return ;
	}).then(rows => {
		console.log("Comments: ",rows);
		project.comments = rows;
		return;
		}).then( () => {
			res.json({project: project});
		})*/
	
});

/*app.listen(5000, () =>
	console.log('listening at 5000'),
);*/

	const httpsServer = https.createServer(options, app);

		httpsServer.listen(5000, () => {
		  console.log("server starting on port : " + 5000);
		});