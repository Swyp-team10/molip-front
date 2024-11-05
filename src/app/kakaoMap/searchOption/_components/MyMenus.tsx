import { useState } from 'react';
import MenuSelectBox from './MenuSelectBox';
import styles from './styles/myMenus.module.css';
import Image from 'next/image';
import Icon_add from '../../../../../public/icons/kakaoMap/add.svg';

export default function MyMenus() {
	const [menuNum, setMenuNum] = useState<number>(1);
	const [selectedBoardId, setSelectBoardId] = useState<number[]>([]);

	const handleAddMenu = () => {
		setMenuNum(menuNum + 1);
	};

	return (
		<div className={styles.Container}>
			<div className={styles.CommentBox}>
				<div className={styles.TopCommentBox}>
					<p className={styles.TopComment}>메뉴판을 선택해주세요.</p>
					<p className={styles.SelectedNum}>{selectedBoardId.length}/5</p>
				</div>
				<p className={styles.BtmComment}>
					선택된 메뉴판에 있는 메뉴가 지도 상에 표시됩니다.
				</p>
			</div>
			<div className={styles.MenuBox}>
				{Array.from({ length: menuNum }, (_, i: number) => (
					<MenuSelectBox
						num={i + 1}
						selectedBoardId={selectedBoardId}
						setSelectedBoardId={setSelectBoardId}
					/>
				))}
			</div>
			{menuNum < 5 && (
				<div className={styles.AddMenuButton} onClick={handleAddMenu}>
					<Image src={Icon_add} width={24} height={24} alt='add' />
				</div>
			)}
		</div>
	);
}
