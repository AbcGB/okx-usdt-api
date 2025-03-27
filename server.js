// server.js - OKX USDT 汇率 Render 后端接口

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ OKX API 凭证（只读）
const API_KEY = 'deaa65ac-3ec1-4725-a19a-92f377a72703';
const SECRET_KEY = 'F41BC6112FA10C50D8D31A7B729C605B';
const PASSPHRASE = 'Cymhyll888@';

function getSignature(timestamp, method, requestPath, body = '') {
  const preHash = timestamp + method + requestPath + body;
  return crypto.createHmac('sha256', SECRET_KEY).update(preHash).digest('base64');
}

app.get('/api/usdt-rate', async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const requestPath = '/api/v5/market/ticker?instId=USDT-USDC';
    const body = '';
    const signature = getSignature(timestamp, method, requestPath, body);

    const response = await axios.get('https://www.okx.com' + requestPath, {
      headers: {
        'OK-ACCESS-KEY': API_KEY,
        'OK-ACCESS-SIGN': signature,
        'OK-ACCESS-TIMESTAMP': timestamp,
        'OK-ACCESS-PASSPHRASE': PASSPHRASE,
        'Content-Type': 'application/json',
      },
    });

    const price = response.data.data[0].last;
    res.json({
      success: true,
      price,
      base: 'USDT-USDC',
      timestamp: new Date().toLocaleString()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '抓取失败', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ OKX 汇率 Render 接口已运行，访问 /api/usdt-rate 获取数据');
});

app.listen(PORT, () => {
  console.log(`✅ 服务器已启动：端口 ${PORT}`);
});
