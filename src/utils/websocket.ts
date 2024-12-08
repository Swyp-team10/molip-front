import { apiRoutes } from '@/_lib/apiRoutes';

export const connectWebSocket = (
	teamBoardId: number,
	onMessage: (data: IGetVoteList) => void,
) => {
	const websocketUrl = process.env.NEXT_PUBLIC_API!.replace('https', 'wss');
	if (!websocketUrl) {
		throw new Error('WebSocket URL is not defined');
	}

	const ws = new WebSocket(`${websocketUrl}/ws/vote`);

	ws.onopen = () => {
		console.log('WebSocket Connected');
		ws.send(
			JSON.stringify({
				type: 'SUBSCRIBE',
				topic: `${apiRoutes.socketVote}/${teamBoardId}`,
			}),
		);
	};

	ws.onmessage = (event) => {
		try {
			const message = JSON.parse(event.data);
			if (message.topic === `${apiRoutes.socketVote}/${teamBoardId}`) {
				onMessage(message.data);
			}
		} catch (err) {
			console.error('Error parsing WebSocket message:', err);
		}
	};

	ws.onerror = (error) => {
		console.error('WebSocket Error : ', error);
	};

	ws.onclose = (event) => {
		console.error(
			`WebSocket Closed: Code ${event.code}, Reason ${event.reason}`,
		);
	};

	return ws;
};
