'use client';

import Header from '@/components/Header';
import styles from './makeTeam.module.css';
import TopNavBar from '@/components/TopNavBar';
import { useEffect, useState } from 'react';
import Button from '@/components/buttons/Button';
import BigInput from '@/components/InputBox/BigInput';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postCreateTeamMenu } from '@/api/postCreatTeamMenu';
import { getTeamMenuList } from '@/api/getTeamMenuList';
import { useAuthStore } from '../login/store/useAuthStore';

const numArr = [2, 3, 4, 5, 6, 7, 8];

export default function MakeTeam() {
	const router = useRouter();
	const [teamName, setTeamName] = useState<string>('');
	const [selectedNum, setSelectedNum] = useState<number>(0);
	const [menuBoardName, setMenuBoardName] = useState<string>(
		`${teamName}의 메뉴판`,
	);
	const queryClient = useQueryClient();
	const { isLogin } = useAuthStore.getState();

	useEffect(() => {
		!isLogin && router.push('/login');
	}, [isLogin]);

	const { mutate: createTeamMenu } = useMutation<IGetTeamMenuType>({
		mutationFn: () => postCreateTeamMenu(teamName, selectedNum, menuBoardName),
		mutationKey: ['CREATE_TEAM_MENU'],
		onSuccess: (data: IGetTeamMenuType) => {
			queryClient.invalidateQueries({ queryKey: ['MY_MENU_LIST'] });
			queryClient.invalidateQueries({ queryKey: ['TEAM_MENU_LIST'] });
			router.push(
				`/teamMenuPage?menuName=${data.teamBoardName}&menuId=${data.teamBoardId}`,
			);
		},
		onError: (error) => console.error(error),
	});

	const { data: teamMenuList } = useQuery<IGetTeamMenuType[]>({
		queryKey: ['TEAM_MENU_LIST'],
		queryFn: getTeamMenuList,
	});

	useEffect(() => {
		const teamBoardNames = teamMenuList?.filter(
			(item) => item.teamBoardName === `${teamName}의 메뉴판`,
		);
		if (teamBoardNames && teamBoardNames.length > 1) {
			setMenuBoardName(`${teamName}의 메뉴판${teamBoardNames.length + 1}`);
		} else {
			setMenuBoardName(`${teamName}의 메뉴판`);
		}
	}, [teamName, teamMenuList]);

	const handleSelectNum = (num: number) => {
		if (num === selectedNum) {
			setSelectedNum(0);
		} else setSelectedNum(num);
	};

	const handleOk = () => {
		teamName && createTeamMenu();
	};

	return (
		<div className={styles.Container}>
			<Header />
			<TopNavBar title='팀 만들기' backRoute='/home' />
			<div className={styles.ContentsContainer}>
				<div className={styles.InputContainer}>
					<p className={styles.Sub}>팀 이름을 입력하세요.</p>
					<BigInput
						placeholder='전략기획 1팀'
						value={teamName}
						setValue={setTeamName}
					/>
				</div>
				<div className={styles.OptionContainer}>
					<p className={styles.Sub}>인원수를 선택하세요.</p>
					<div className={styles.OptionButtonBox}>
						{numArr.map((num, index) => (
							<div
								key={index}
								className={`${styles.OptionButton} ${selectedNum === num ? styles.active : styles.default}`}
								onClick={() => handleSelectNum(num)}
							>
								{num}명
							</div>
						))}
					</div>
				</div>
			</div>
			<div className={styles.ButtonBox}>
				<Button
					size='big'
					state={teamName !== '' && selectedNum !== 0 ? 'default' : 'disabled'}
					onClick={handleOk}
				>
					완료
				</Button>
			</div>
		</div>
	);
}
