import { Dispatch, SetStateAction, useState } from 'react';
import styles from './styles/menuSelectBox.module.css';
import Image from 'next/image';
import Icon_up from '../../../../../public/icons/up.svg';
import Icon_down from '../../../../../public/icons/down.svg';
import { useQuery } from '@tanstack/react-query';
import { getMyMenuList } from '@/api/getMyMenuList';

interface IMenuSelectBox {
	num: number;
	selectedBoardId: number[];
	setSelectedBoardId: Dispatch<SetStateAction<number[]>>;
}

export default function MenuSelectBox({
	num,
	setSelectedBoardId,
	selectedBoardId,
}: IMenuSelectBox) {
	const [isShowSelectBox, setIsShowSelectBox] = useState<boolean>(false);
	const [selectedMyMenu, setSelectedMyMenu] = useState<string>('');

	const { data: myMenuList } = useQuery<IGetMyMenuType[]>({
		queryKey: ['MY_MENU_LIST'],
		queryFn: () => getMyMenuList(),
	});

	const handleMyBoardClick = (board: IGetMyMenuType) => {
		setSelectedMyMenu(board.name);
		setSelectedBoardId([...selectedBoardId, board.personalBoardId]);
		setIsShowSelectBox(false);
	};

	return (
		<>
			<div className={styles.container}>
				<p className={styles.sub}>선택{num}</p>
				<div className={styles.SelectBox}>
					<div
						className={styles.selectBar}
						onClick={() => setIsShowSelectBox(!isShowSelectBox)}
					>
						{selectedMyMenu === '' ? (
							<p className={styles.defaultMenu}>메뉴판을 선택하세요.</p>
						) : (
							<p className={styles.selectedMenu}>{selectedMyMenu}</p>
						)}
						<Image
							src={isShowSelectBox ? Icon_up : Icon_down}
							width={20}
							height={20}
							alt='Icon_down'
						/>
					</div>
					<ul className={isShowSelectBox ? styles.ul : styles.disabled}>
						{myMenuList?.map((board, index) => (
							<li
								className={styles.li}
								key={index}
								value={board.name}
								onClick={() => handleMyBoardClick(board)}
							>
								{board.name}
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
