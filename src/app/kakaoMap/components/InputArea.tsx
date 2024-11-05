'use client';

import styles from './inputArea.module.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Icon_search from '../../../../public/icons/Icon_search.svg';
import Icon_back from '../../../../public/icons/Icon_back.svg';
import Image from 'next/image';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getSearch } from '@/api/getSearch';
import { postSearch } from '@/api/postSearch';
import useSearchStore from '../store/useSearchStore';

interface IInputArea {
	setIsSearch: Dispatch<SetStateAction<boolean>>;
}
export default function InputArea({ setIsSearch }: IInputArea) {
	const [recentKeywords, setRecentKeywords] = useState<IGetSearchKeyword[]>([]);
	const { searchKeyword, setSearchKeyword, searchResult, setSearchResult } =
		useSearchStore();

	const { data: myKeywords } = useQuery<IGetSearchKeyword[]>({
		queryKey: ['SEARCH_KEYWORDS'],
		queryFn: () => getSearch(),
	});

	useEffect(() => {
		if (myKeywords) {
			setRecentKeywords(myKeywords);
		}
	}, []);

	useEffect(() => {
		const ps = new kakao.maps.services.Places();

		ps.keywordSearch(searchKeyword, (data, status) => {
			if (status === kakao.maps.services.Status.OK) {
				setSearchResult(data);
			}
		});
	}, [searchKeyword]);

	const { mutate: postSearchKeyword } = useMutation<IPostSearchKeyword>({
		mutationFn: () => postSearch(searchKeyword),
		onSuccess: () => {},
	});

	const handleEnterEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === 'Enter' &&
			searchKeyword.trim() !== '' &&
			!e.nativeEvent.isComposing
		) {
			e.preventDefault();
			setIsSearch(false);
		}
	};

	const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchKeyword(e.target.value);
	};

	const handleClickSearch = () => {
		setIsSearch(false);
	};

	return (
		<div className={styles.Container}>
			<div className={styles.InputContainer}>
				<Image
					className={styles.Icon}
					src={Icon_back}
					width={24}
					height={24}
					alt='back'
					onClick={() => setIsSearch(false)}
				/>
				<input
					className={styles.Input}
					placeholder='메뉴 혹은 맛집을 입력하세요.'
					value={searchKeyword}
					onChange={handleKeywordChange}
					onKeyDown={handleEnterEvent}
				/>
				<Image
					className={styles.Icon}
					src={Icon_search}
					width={24}
					height={24}
					alt='search'
					onClick={handleClickSearch}
				/>
			</div>
			{searchResult ? (
				<ul>
					{searchResult.map((result, index) => (
						<li key={index}>{result.place_name}</li>
					))}
				</ul>
			) : recentKeywords.length === 0 ? (
				<p className={styles.Comment}>검색어를 입력하세요.</p>
			) : (
				<div className={styles.KeywordsContainer}>
					<p>최근 검색</p>
					<div className={styles.KeywordBox}></div>
				</div>
			)}
		</div>
	);
}
