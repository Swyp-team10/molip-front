import { apiRoutes } from '@/_lib/apiRoutes';
import api from '@/_lib/fetcher';
import { useAuthStore } from '@/app/login/store/useAuthStore';

export const deleteSearch = async (searchId: number) => {
	const { accessToken } = useAuthStore.getState();
	return await api.delete({
		endpoint: `${apiRoutes.map}/search/${searchId}`,
		authorization: `${accessToken ? accessToken : process.env.NEXT_PUBLIC_ACCESS}`,
	});
};
