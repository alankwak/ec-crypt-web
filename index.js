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
const port = process.env.PORT || 53140;

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

// Basic route

app.get('/', (req, res) => {
    res.render('index.html')
    return
});
    
app.post('/update-curve', async (req, res) => {
    const mod = parseInt(req.body.mod);
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);

    if(isNaN(a) || isNaN(b) || isNaN(mod)) {
        res.status(400).send("Invalid Request");
        return;
    }

    try {
        let ecInfo = await executePythonScript('py_scripts/getEcInfo.py', [a, b, mod, "", ""]);
        ecInfo = JSON.parse(ecInfo);

        res.json({
            'cthead': ecInfo.cthead, 
            'ctbody': ecInfo.ctbody,
            'echead': ecInfo.echead,
            'ecbody': ecInfo.ecbody
        });
    } catch (error) {
        console.error('Error executing Python script:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/encrypt', async (req, res) => {
    const mod = parseInt(req.body.mod) || 13;
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);
    const msg = req.body.msg;

    if(isNaN(a) || isNaN(b)) {
        res.status(400).send("Invalid Request");
        return;
    }

    try {
        let ecInfo = await executePythonScript('py_scripts/getEcInfo.py', [a, b, mod, msg, ""]);
        ecInfo = JSON.parse(ecInfo);
        
        res.json({
            encrypted_msg: ecInfo.encrypted
        });
    } catch (error) {
        console.error('Error executing Python script:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/decrypt', async (req, res) => {
    const mod = parseInt(req.body.mod) || 13;
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);
    const msg = req.body.msg;

    if(isNaN(a) || isNaN(b)) {
        res.status(400).send("Invalid Request");
        return;
    }

    try {
        let ecInfo = await executePythonScript('py_scripts/getEcInfo.py', [a, b, mod, "", msg]);
        ecInfo = JSON.parse(ecInfo);
        
        res.json({
            plaintext_msg: ecInfo.decrypted
        });
    } catch (error) {
        console.error('Error executing Python script:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use((req, res) => {
    res.status(404).send(`Sorry, ${req.url} cannot be found here.`);
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});