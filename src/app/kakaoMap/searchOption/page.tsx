'use client';
import Header from '@/components/Header';
import styles from './option.module.css';
import Button from '@/components/buttons/Button';
import Image from 'next/image';
import resetBtn_disabled from '../../.././../public/svg/map/resetBtn_Disabled.svg';
import resetBtn from '../../.././../public/svg/map/resetBtn.svg';
import TopNavBar from '@/components/TopNavBar';
import OptionButton from './_components/OptionButton';
import { useState } from 'react';
import MyMenus from './_components/MyMenus';
import SelectOption from './_components/SelectOption';

export default function SearchOption() {
	const [active, setActive] = useState<'메뉴판' | '옵션'>('메뉴판');

	return (
		<div className={styles.Main}>
			<Header />
			<div className={styles.Container}>
				<TopNavBar title='검색 조건 설정' backRoute='/home' />
				<OptionButton active={active} setActive={setActive} />
				{active === '메뉴판' ? <MyMenus /> : <SelectOption />}

				<div className={styles.ButtonBox}>
					<Button
						size='medium'
						onClick={() => {
							return;
						}}
					>
						건의 결과보기
					</Button>
					<Image
						className={styles.ResetBtn}
						src={resetBtn_disabled}
						width={80}
						height={60}
						alt='reset'
						onClick={() => window.location.reload()}
					/>
				</div>
			</div>
		</div>
	);
}
