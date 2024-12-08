'use client';

import Button from '@/components/buttons/Button';
import styles from './voteComponents.module.css';
import TopNavBar from '@/components/TopNavBar';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import Icon_check from '../../../../public/icons/checkOrange_small.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface IVoteResultProps {
	voteResult: IGetVoteList | undefined;
	menuId: number;
	menuName: string;
}

export default function VoteResult({
	voteResult,
	menuId,
	menuName,
}: IVoteResultProps) {
	const router = useRouter();
	const maxVoteValue = voteResult?.votes[0]?.voteValue;
	const teamMembers = Number(localStorage.getItem('VOTED_USER_COUNT'));

	return (
		<>
			<TopNavBar
				title={menuName}
				backRoute={`/menu?menuId=${menuId}&menuName=${menuName}`}
			/>
			<div className={styles.ResultContentsContainer}>
				<div className={styles.ResultTextBox}>
					<p className={styles.VotingP}>투표 결과</p>
					<div className={styles.ResultDateBox}>
						<p className={styles.ResultDate}>{voteResult?.voteDate}</p>
						<p className={styles.ResultSubRight}>익명 투표</p>
					</div>
				</div>
				<div className={styles.ResultVoteListBox}>
					{voteResult?.votes.map((item, idx) => (
						<div className={styles.ResultMenuItemBox}>
							<div className={styles.ResultMenuItemTextBox}>
								<p key={idx} className={styles.ResultMenuItem}>
									{item.menuName}
									{item.voteValue === maxVoteValue && (
										<Image
											src={Icon_check}
											width={24}
											height={24}
											alt='check'
										/>
									)}
								</p>
								<p className={styles.ResultMenuVoteValue}>{item.voteValue}표</p>
							</div>
							<div className={styles.ResultProgressBox}>
								<ProgressBar
									members={teamMembers}
									voteValue={item.voteValue}
									color={item.voteValue === maxVoteValue ? 'orange' : 'gray'}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className={styles.DoubleButtonBox}>
				<Button size='small' onClick={() => router.push('/vote/voteResult')}>
					지난 결과 보기
				</Button>
			</div>
		</>
	);
}
