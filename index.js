import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import { SerialPort } from 'serialport';
// import { WebSocketServer, WebSocket } from 'ws';
import { Routers } from './src/routes/index.js';
import { checkToken } from './src/middleware/checkToken.js';
import apiresult from './src/model/apiresult.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const port = process.env.PORT || 8082;

let portCom = null;
let comPathCache = null;

let currentWeight = '0.00';
let lastUpdated = 0;

const findComPort = async () => {
	try {
		const ports = await SerialPort.list();
		const scalePort = ports.find((p) =>
			p.manufacturer?.toLowerCase().includes('prolific') ||
			(p.vendorId === '067B' && p.productId === '23A3')
		);
		return scalePort ? scalePort.path : null;
	} catch (err) {
		console.error('Lỗi khi tìm cổng COM:', err);
		return null;
	}
};

// const setupWebSocket = (server) => {
// 	const wss = new WebSocketServer({ server });

// 	function heartbeat() { this.isAlive = true; }

// 	wss.on('connection', (ws) => {
// 		console.log('Client WebSocket đã kết nối');
// 		ws.isAlive = true;
// 		ws.on('pong', heartbeat);
// 		ws.on('close', () => console.log('Client ngắt kết nối'));
// 		ws.on('error', (err) => console.error('WS lỗi:', err.message));
// 	});

// 	const interval = setInterval(() => {
// 		wss.clients.forEach((ws) => {
// 			if (!ws.isAlive) return ws.terminate();
// 			ws.isAlive = false;
// 			ws.ping();
// 		});
// 	}, 30000);

// 	wss.on('close', () => clearInterval(interval));
// 	return wss;
// };

const setupComPort = (comPath /*, wss */) => {
	if (!comPath) return null;

	console.log(`✅ Mở cổng cân: ${comPath}`);
	const portCom = new SerialPort({
		path: comPath,
		baudRate: 9600,
		dataBits: 8,
		parity: 'none',
		stopBits: 1,
		autoOpen: true
	});

	let buffer = '';
	let lastSend = 0;

	portCom.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split(/[\r\n]+/);

		for (let i = 0; i < lines.length - 1; i++) {
			const line = lines[i].trim();
			if (!line || !line.includes('T.:')) continue;

			const match = line.match(/(\d+\.?\d+\s*[a-zA-Z]+)/);
			if (match) {
				const now = Date.now();
				if (now - lastSend > 300) {
					const weightString = match[1].trim();
					console.log('⚖️ Trọng lượng:', weightString);
					currentWeight = weightString;
					lastUpdated = Date.now();

					// wss.clients.forEach((client) => {
					// 	if (client.readyState === WebSocket.OPEN) {
					// 		client.send(JSON.stringify({ weight: weightString }));
					// 	}
					// });

					lastSend = now;
				}
			}
		}

		buffer = lines[lines.length - 1];
	});

	portCom.on('close', () => { setTimeout(() => reconnectCom(/*wss*/), 3000); });

	portCom.on('error', (err) => {
		try { portCom.close(); } catch { }
		setTimeout(() => reconnectCom(/*wss*/), 3000);
	});

	return portCom;
};

const reconnectCom = async (/*wss*/) => {
	const path = await findComPort();
	if (!path) {
		console.warn('⚠️ Không tìm thấy thiết bị cân, thử lại sau...');
		setTimeout(() => reconnectCom(/*wss*/), 5000);
		return;
	}

	if (comPathCache !== path || !portCom || !portCom.isOpen) {
		comPathCache = path;
		portCom = setupComPort(path /*, wss*/);
	}
};

app.post('/api/weight', (req, res) => {
	const response = new apiresult(false, '', '', {
		weight: currentWeight,
		updatedAt: lastUpdated,
		timestamp: lastUpdated ? new Date(lastUpdated).toLocaleString('vi-VN') : null
	});
	res.json(response);
});

app.get('/statusCom', (req, res) => {
	res.json({
		portOpen: !!portCom && portCom.isOpen,
		currentWeight,
		lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleString('vi-VN') : null
	});
});

const startServer = async () => {
	// const wss = setupWebSocket(server); //

	const path = await findComPort();
	if (!path) {
		setTimeout(() => reconnectCom(/*wss*/), 3000);
	} else {
		comPathCache = path;
		portCom = setupComPort(path /*, wss*/);
	}

	Routers.map((item) => {
		app.use(item.path, item.middleware ? [checkToken, item.router] : item.router);
	});

	server.listen(port, () => {});
};

startServer();