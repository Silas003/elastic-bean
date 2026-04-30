const express = require('express');
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

const app = express();
const PORT = process.env.PORT || 8080;  // EB injects PORT

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-3' });

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        version: process.env.APP_VERSION || 'unknown',
        environment: process.env.APP_ENV || 'unknown',
        deployedAt: process.env.DEPLOY_TIME || 'unknown',
    });
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

app.get('/data', async (req, res) => {
    try {
        const result = await dynamo.send(new ScanCommand({
            TableName: process.env.DYNAMO_TABLE_NAME,
            Limit: 10,
        }));
        res.json({ items: result.Items, count: result.Count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/status",(req,res)=>{
    res.json({
        owner:"silas kumi",
        version:"v5"
    })
})
app.listen(PORT, () => console.log(`Listening on ${PORT}`));