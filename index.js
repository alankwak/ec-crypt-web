'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const executePythonScript = (scriptPath, args) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, ...args]);
        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });

        pythonProcess.on('close', () => {
            resolve(result);
        });
    });
};

const app = express();  
const port = 53140;
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine); 
app.set('view engine', 'handlebars');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

// Basic route

app.get('/', async (req, res) => {
    const mod = req.query.mod || 13;
    const a = req.query.a;
    const b = req.query.b;

    if(!a || !b) {
        res.render('ecInfo');
        return;
    }

    try {
        let ecInfo = await executePythonScript('py_scripts/getEcInfo.py', [a, b, mod, "", ""]);
        ecInfo = JSON.parse(ecInfo);

        res.render('ecInfo', {
            'a': a,
            'b': b,
            'mod': mod,
            'cthead': ecInfo.cthead, 
            'ctbody': ecInfo.ctbody,
            'echead': ecInfo.echead,
            'ecbody': ecInfo.ecbody,
            'encrypted-message': ecInfo.encrypted,
            'decrypted-message': ecInfo.decrypted});
    } catch (error) {
        console.error('Error executing Python script:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});