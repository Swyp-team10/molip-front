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
import KeywordBox from './KeywordBox';

interface IInputArea {
	setIsSearch: Dispatch<SetStateAction<boolean>>;
}
export default function InputArea({ setIsSearch }: IInputArea) {
	const [latitude, setLatitude] = useState<number>(33.450701);
	const [longitude, setLongitude] = useState<number>(126.570667);
	const {
		setMarkers,
		searchKeyword,
		setSearchKeyword,
		searchResult,
		setSearchResult,
	} = useSearchStore();

	const { data: myKeywords } = useQuery<IGetSearchKeyword[]>({
		queryKey: ['SEARCH_KEYWORDS'],
		queryFn: () => getSearch(),
	});

	// 현재 위치 가져오기
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setLatitude(position.coords.latitude);
				setLongitude(position.coords.longitude);
			});
		}
	}, []);

	useEffect(() => {
		console.log(searchKeyword, searchResult);
		const ps = new kakao.maps.services.Places();
		const currentLocation = new kakao.maps.LatLng(latitude, longitude);
		ps.keywordSearch(
			searchKeyword,
			(data, status) => {
				if (status === kakao.maps.services.Status.OK) {
					const filteredData = data.filter(
						(place) => Number(place.distance) <= 500,
					);
					const newMarkers = filteredData.map((place) => {
						const position = new kakao.maps.LatLng(
							parseFloat(place.y),
							parseFloat(place.x),
						);

						return {
							position: { lat: position.getLat(), lng: position.getLng() },
							content: place.place_name,
						};
					});

					// 필터링된 결과와 마커 설정
					setMarkers(newMarkers);
					setSearchResult(filteredData);
				} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
					setSearchResult(null);
				}
			},
			{
				location: currentLocation,
			},
		);
	}, [searchKeyword, latitude, longitude]);

	const { mutate: postSearchKeyword } = useMutation<IPostSearchKeyword>({
		mutationFn: () => postSearch(searchKeyword),
		onSettled: () => {
			setIsSearch(false);
		},
	});

	const handleEnterEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === 'Enter' &&
			searchKeyword.trim() !== '' &&
			!e.nativeEvent.isComposing
		) {
			e.preventDefault();
			postSearchKeyword();
		}
	};

	const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.trim() === '') {
			setSearchResult(null);
		}
		setSearchKeyword(e.target.value);
	};

	const handleClickSearch = () => {
		postSearchKeyword();
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
						<p key={index}>
							<KeywordBox
								isLocation={true}
								category={result.category_name}
								distance={result.distance}
							>
								{result.place_name}
							</KeywordBox>
						</p>
					))}
				</ul>
			) : myKeywords && myKeywords.length === 0 ? (
				<p className={styles.Comment}>검색어를 입력하세요.</p>
			) : (
				<div className={styles.KeywordsContainer}>
					<p className={styles.Recent}>최근 검색</p>
					<div className={styles.KeywordBox}>
						{myKeywords?.map((item, index) => (
							<p key={index}>
								<KeywordBox id={item.id}>{item.word}</KeywordBox>
							</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
