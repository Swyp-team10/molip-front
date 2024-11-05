'use client';

import React, { Dispatch, SetStateAction } from 'react';
import styles from './styles/optionButton.module.css';

interface IOptionButtonProps {
	active: '메뉴판' | '옵션';
	setActive: Dispatch<SetStateAction<'메뉴판' | '옵션'>>;
}

export default function OptionButton({
	active,
	setActive,
}: IOptionButtonProps) {
	return (
		<div className={styles.Container}>
			<button
				className={`${styles.Button} ${active === '메뉴판' ? styles.active : styles.inactive}`}
				onClick={() => {
					setActive('메뉴판');
					console.log('menu');
				}}
			>
				메뉴판 불러오기
			</button>
			<button
				className={`${styles.Button} ${active === '옵션' ? styles.active : styles.inactive}`}
				onClick={() => {
					setActive('옵션');
					console.log('option');
				}}
			>
				옵션 선택하기
			</button>
		</div>
	);
}
