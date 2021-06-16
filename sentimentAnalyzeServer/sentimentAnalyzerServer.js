
const express = require('express');
const app = new express();

const dotenv = require('dotenv');
dotenv.config();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

const nlu = getNLUInstance();

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion':{}
        }
    }

    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(JSON.stringify(Object.entries(analysisResults.result.emotion.document.emotion), null, 2));
        })
        .catch(err => {
            return res.status(400).send({
                message: err
            });
        });
});

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment':{}
        }
    }  

    nlu.analyze(analyzeParams)
        .then(analysisResults => {
        console.log(analysisResults.result.sentiment.document.label)
        return res.send(JSON.stringify(analysisResults.result.sentiment.document.label, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion':{} 
        }
    }

    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(JSON.stringify(Object.entries(analysisResults.result.emotion.document.emotion), null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment':{} 
        }
    };

    nlu.analyze(analyzeParams)
        .then(analysisResults => {

        console.log(analysisResults.result.sentiment.document.label)
        return res.send(JSON.stringify(analysisResults.result.sentiment.document.label, null, 2));
        })
        .catch(err => {
            console.log(err);
            return res.send("Could not do desired operation "+err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
});

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const nluV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const nlu = new nluV1({
        version: "2021-05-16",
        authenticator: new IamAuthenticator({apikey: api_key}),
        serviceUrl: api_url,
    });

    return nlu;
}
