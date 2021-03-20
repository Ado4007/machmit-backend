const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'machmit',
	password: 'um2UWTSDvzFWAkYiPPtf',
	database: 'machmit'
})

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
		console.log("processed");
		res.json({projects: rows});
	});
});


app.listen(5000, () =>
	console.log('listening at 5000'),
);


