import { apiRoutes } from '@/_lib/apiRoutes';
import api from '@/_lib/fetcher';
import { useAuthStore } from '@/app/login/store/useAuthStore';
import { connectWebSocket } from '@/utils/websocket';
import { useEffect, useState } from 'react';

export const getVoteResult = async (
	teamBoardId: number,
): Promise<IGetVoteList> => {
	const { accessToken } = useAuthStore.getState();
	return await api.get({
		endpoint: `${apiRoutes.votes}/teamboards/${teamBoardId}/votes`,
		authorization: `${accessToken ? accessToken : process.env.NEXT_PUBLIC_ACCESS}`,
	});
};

export const useVoteWebSocket = (teamBoardId: number) => {
	const [voteList, setVoteList] = useState<IGetVoteList | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	useEffect(() => {
		const ws = connectWebSocket(teamBoardId, (data) => {
			setVoteList(data);
			setIsError(false); // 데이터 수신 성공 시 오류 상태 해제
		});

		setIsConnected(true);

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
			setIsError(true); // 오류 발생 시 상태 설정
		};

		ws.onclose = () => {
			setIsConnected(false);
		};

		return () => {
			ws.close();
			setIsConnected(false);
		};
	}, [teamBoardId]);

	return { voteList, isConnected, isError };
};
