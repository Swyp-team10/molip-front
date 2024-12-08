'use client';

import Header from '@/components/Header';
import useFunnel from '@/hooks/useFunnel';
import Voting from './components/voting';
import VoteDone from './components/voteDone';
import VoteResult from './components/voteResult';
import TabNavigation from '@/components/TabNavigation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getVoteResult, useVoteWebSocket } from '@/api/getVoteResult';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../login/store/useAuthStore';

const steps: string[] = ['투표중', '투표완료', '투표결과'];

export default function Vote() {
	const [isVote, setIsVote] = useState<boolean>(false);

	const searchParams = useSearchParams();
	const menuId = Number(searchParams.get('menuId'));
	const menuName = searchParams.get('menuName');
	const router = useRouter();
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('Prev_Page');
		}
	}, []);

	const { isLogin } = useAuthStore.getState();

	useEffect(() => {
		!isLogin && router.push('/login');
	}, [isLogin]);

	const {
		data: initialVoteList,
		isLoading,
		isError,
		error,
	} = useQuery<IGetVoteList>({
		queryKey: ['VOTE_LIST', menuId],
		queryFn: () => getVoteResult(menuId),
	});

	const [Funnel, Step, setStep] = useFunnel(
		initialVoteList?.isVote ? steps[1] : steps[0],
	);

	const {
		voteList,
		isConnected,
		isError: isSocketError,
	} = useVoteWebSocket(menuId);

	// if (isSocketError) {
	// 	return <p>웹소켓 통신 중 에러가 발생했습니다.</p>;
	// }

	// if (!isConnected) {
	// 	return <p>데이터 로드 중...</p>;
	// }

	const currentVoteList = voteList || initialVoteList;

	useEffect(() => {
		if (initialVoteList) {
			setIsVote(initialVoteList.isVote);
		}
		if (isError) {
			if (error.message === '투표를 찾을 수 없습니다.') {
				setIsVote(false);
			}
		}
	}, [initialVoteList, isError]);

	return (
		<>
			{!isLoading && (
				<>
					<Header />
					<TabNavigation />
					<Funnel>
						<Step name='투표중'>
							<Voting
								onNext={() => setStep('투표완료')}
								menuId={menuId}
								menuName={menuName ?? ''}
								isVoted={isVote}
							/>
						</Step>
						<Step name='투표완료'>
							<VoteDone
								onNext={() => setStep('투표결과')}
								onBefore={() => setStep('투표중')}
								menuId={menuId}
								menuName={menuName ?? ''}
							/>
						</Step>
						<Step name='투표결과'>
							<VoteResult
								voteResult={currentVoteList}
								menuId={menuId}
								menuName={menuName ?? ''}
							/>
						</Step>
					</Funnel>
				</>
			)}
		</>
	);
}
