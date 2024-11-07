'use client';

import { Map, MapMarker } from 'react-kakao-maps-sdk';
useKakaoLoader;
import { useEffect, useRef, useState } from 'react';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import Loading from '@/components/Loading';
import styles from './map.module.css';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import useSearchStore from '../store/useSearchStore';
import KeywordBox from './KeywordBox';
// import Icon_marker_current from '../../../../public/icons/kakaoMap/Icon_marker_current.svg';
// import Icon_marker from '../../../../public/icons/kakaoMap/Icon_marker.svg';
// import Icon_marker_selected from '../../../../public/icons/kakaoMap/Icon_marker_selected.svg';

interface IKakaoMap {
	onLoad: () => void;
}

export default function Kakao_Map({ onLoad }: IKakaoMap) {
	useKakaoLoader();
	const mapRef = useRef<kakao.maps.Map>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [position, setPosition] = useState<{ lat: number; lng: number }>({
		lat: 33.450701,
		lng: 126.570667,
	});

	// const markerIcon = new kakao.maps.MarkerImage(
	// 	Icon_marker,
	// 	new kakao.maps.Size(24, 24),
	// 	{
	// 		alt: 'marker img',
	// 	},
	// );

	const [info, setInfo] = useState<{
		content: string;
		position: { lat: number; lng: number };
	} | null>(null);

	// const [markers, setMarkers] = useState<
	// 	{ position: { lat: number; lng: number }; content: string }[]
	// >([]);

	const { map, setMap, searchResult, markers } = useSearchStore();

	useEffect(() => {
		const watchId = navigator.geolocation.watchPosition(
			(pos) => {
				setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
				setIsLoading(false);
			},
			(err) => {
				console.error(err);
			},
		);
		onLoad();
		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, []);

	useEffect(() => {
		if (markers.length > 0 && map) {
			const bounds = new kakao.maps.LatLngBounds();

			// 내 위치를 LatLngBounds에 추가
			const myPosition = new kakao.maps.LatLng(position.lat, position.lng);
			bounds.extend(myPosition);

			// 모든 마커의 위치를 LatLngBounds에 추가
			markers.forEach((marker) => {
				const position = new kakao.maps.LatLng(
					marker.position.lat,
					marker.position.lng,
				);
				bounds.extend(position);
			});

			// 마커들이 모두 보이도록 지도 경계를 설정
			map.setBounds(bounds);
		}
	}, [markers, position, map]);

	return (
		<div>
			{isLoading ? (
				<div className={styles.LoadingBox}>
					<Loading backgroundColor='white' />
				</div>
			) : (
				<Map // 지도를 표시할 Container
					center={{ lat: position.lat, lng: position.lng }}
					style={{
						// 지도의 크기
						width: '100%',
						height: 'calc(100vh - 96.2px)',
					}}
					level={3} // 지도의 확대 레벨
					ref={mapRef}
					onCreate={setMap}
				>
					{markers.map((marker) => (
						<MapMarker
							key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
							position={marker.position}
							onClick={() => setInfo(marker)}
						>
							{info && info.content === marker.content && (
								<div
									style={{
										color: 'black',
										backgroundColor: 'transparent',
										border: 'none',
									}}
								>
									{marker.content}
								</div>
							)}
						</MapMarker>
					))}
					<MapMarker
						position={{ lat: position.lat, lng: position.lng }}
						// image={{
						// 	src: Icon_marker_current,
						// 	size: { width: 24, height: 24 },
						// }}
					></MapMarker>
				</Map>
			)}
			<BottomSheet>
				<ul>
					{searchResult?.map((result, index) => (
						<p key={index}>
							<KeywordBox>{result.place_name}</KeywordBox>
						</p>
					))}
				</ul>
			</BottomSheet>
		</div>
	);
}
