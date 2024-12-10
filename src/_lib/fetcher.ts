import { useAuthStore } from '@/app/login/store/useAuthStore';

interface IFetchOptions<T = unknown> {
	endpoint: string;
	body?: T;
	method?: string;
	authorization?: string;
	id?: string;
}

interface IGetOptions {
	endpoint: string;
	authorization?: string;
}

interface IPostOptions<T = unknown> {
	endpoint: string;
	body?: T;
	authorization?: string;
}

interface IDeleteOptions {
	endpoint: string;
	authorization: string;
}

const postRefresh = async() => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/reissue-token`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
	);
	if (!response.ok) {
		throw new Error('Failed to refresh token');
	}
	const data = await response.json();
	return data;
}

const _fetch = async <T = unknown, R = unknown>({
	method,
	endpoint,
	body,
	authorization,
}: IFetchOptions<T>): Promise<R> => {
	const headers: HeadersInit = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};

	if (authorization) {
		headers.access = authorization;
	}

	const requestOptions: RequestInit = {
		method,
		headers,
		credentials: 'include',
	};

	if (body) {
		requestOptions.body = JSON.stringify(body);
	}

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API}${endpoint}`,
			requestOptions,
		);

		if (!res.ok) {
			if (res.status === 401 || res.status === 400) {
				try {
					const newToken = await postRefresh();
					if (newToken) {
						useAuthStore.setState({
							isLogin: true,
							accessToken: newToken.access,
						});
						headers.access = newToken.access;
						const retryRequestOptions: RequestInit = {
							...requestOptions,
							headers,
						};
						const retryRes = await fetch(
							`${process.env.NEXT_PUBLIC_API}${endpoint}`,
							retryRequestOptions,
						);

						if (!retryRes.ok) {
							const retryErrorData = await retryRes.json();
							throw new Error(retryErrorData.message);
						}
						return await retryRes.json();
					}
				} catch (error) {
					useAuthStore.setState({ isLogin: false, accessToken: null });
					window.location.reload();
					localStorage.clear();
					throw new Error('Session expired. Please log in again.');
				}
			}
			const errorData = await res.json();
			throw new Error(errorData.message);
		}
		return await res.json();
	} catch (error) {
		throw error;
	}
};

// T: 요청 body의 타입,
// R: 응답 body의 타입

const _get = async <R = unknown>({
	endpoint,
	authorization,
}: IGetOptions): Promise<R> => {
	return _fetch<never, R>({ method: 'GET', endpoint, authorization });
};

const _post = async <T = unknown, R = unknown>({
	endpoint,
	body,
	authorization,
}: IPostOptions<T>): Promise<R> => {
	return _fetch<T, R>({ method: 'POST', endpoint, body, authorization });
};

const _patch = async <T = unknown, R = unknown>({
	endpoint,
	body,
	authorization,
}: IPostOptions<T>): Promise<R> => {
	return _fetch<T, R>({ method: 'PATCH', endpoint, body, authorization });
};

const _put = async <T = unknown, R = unknown>({
	endpoint,
	body,
	authorization,
}: IPostOptions<T>): Promise<R> => {
	return _fetch<T, R>({ method: 'PUT', endpoint, body, authorization });
};

const _delete = async <R = unknown>({
	endpoint,
	authorization,
}: IDeleteOptions): Promise<R> => {
	return _fetch<never, R>({ method: 'DELETE', authorization, endpoint });
};

const api = {
	get: _get,
	post: _post,
	patch: _patch,
	put: _put,
	delete: _delete,
};

export default api;
