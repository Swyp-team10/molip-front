'use client';

import styles from './kakaoMap.module.css';
import Header from '@/components/Header';
import Kakao_Map from './components/Kakao_Map';
import TabNavigation from '@/components/TabNavigation';
import Image from 'next/image';
import Icon_option from '../../../public/icons/buttons/option.svg';
import Icon_search from '../../../public/icons/Icon_search.svg';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { useAuthStore } from '../login/store/useAuthStore';
import { useRouter } from 'next/navigation';
import InputArea from './components/InputArea';
import useSearchStore from './store/useSearchStore';

export default function KakaoMap() {
	const { searchKeyword, setSearchKeyword } = useSearchStore();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSearch, setIsSearch] = useState<boolean>(false);
	const route = useRouter();
	const { isLogin } = useAuthStore.getState();

	useEffect(() => {
		!isLogin && route.push('/login');
	}, [isLogin]);

	const handleMapLoad = () => {
		setIsLoading(false);
	};

	return (
		<div>
			<Header />
			<TabNavigation />
			<div className={styles.topContainer}>
				{!isSearch && (
					<>
						<div className={styles.inputContainer}>
							<input
								className={styles.input}
								placeholder={searchKeyword ?? '메뉴 혹은 맛집을 입력하세요.'}
								onFocus={() => {
									setIsSearch(true);
								}}
							/>
							<Image
								className={styles.searchIcon}
								src={Icon_search}
								width={24}
								height={24}
								alt='search'
							/>
						</div>
						<div className={styles.optionBox}>
							<Image src={Icon_option} width={24} height={24} alt='option' />
						</div>
					</>
				)}
			</div>
			{isLoading ? (
				<div className={styles.loading}>
					<Loading backgroundColor='white' />
				</div>
			) : !isSearch ? (
				<Kakao_Map onLoad={handleMapLoad} />
			) : (
				<InputArea setIsSearch={setIsSearch} />
			)}
		</div>
	);
}
