import { apiRoutes } from '@/_lib/apiRoutes';
import { fetchData } from '@/_lib/axios';
import { useAuthStore } from '@/app/login/store/useAuthStore';

export const postCreateTeamMenu = async (
	teamName: string,
	teamMembersNum: number,
	teamBoardName: string,
) => {
	const { accessToken } = useAuthStore.getState();
	return await fetchData(
		'POST',
		`${apiRoutes.teamBoards}?teamName=${teamName}&teamMembersNum=${teamMembersNum}&teamBoardName=${teamBoardName}`,
		`${accessToken ? accessToken : process.env.NEXT_PUBLIC_ACCESS}`,
	);
};
