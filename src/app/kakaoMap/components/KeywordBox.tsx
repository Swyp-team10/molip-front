import Image from 'next/image';
import styles from './KeywordBox.module.css';
import Icon_search from '../../../../public/icons/kakaoMap/search.svg';
import Icon_location from '../../../../public/icons/kakaoMap/location.svg';
import Icon_delete from '../../../../public/icons/kakaoMap/delete.svg';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSearch } from '@/api/deleteSearch';

interface IKeywordBox {
	children: React.ReactNode;
	isLocation?: boolean;
	distance?: string;
	category?: string;
	id?: number;
}

export default function KeywordBox({
	children,
	isLocation = false,
	distance,
	category,
	id = 0,
}: IKeywordBox) {
	const queryClient = useQueryClient();
	const [categoryName, setCategoryName] = useState<string>('');
	useEffect(() => {
		const spiltedCategory = category?.split('>');
		spiltedCategory && setCategoryName(spiltedCategory[1]);
	}, []);

	const { mutate: deleteKeyword } = useMutation({
		mutationFn: () => deleteSearch(id),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['SEARCH_KEYWORDS'] });
		},
	});

	const handleDeleteKeyword = () => {
		deleteKeyword();
	};
	return (
		<div className={styles.Container}>
			<div className={styles.ContentBox}>
				<Image
					src={isLocation ? Icon_location : Icon_search}
					width={20}
					height={20}
					alt='search'
				/>
				<p className={styles.Word}>{children}</p>
			</div>
			{isLocation ? (
				<>
					<p className={styles.Category}>{categoryName}</p>
					<p className={styles.Distance}>{distance}m</p>
				</>
			) : (
				<Image
					className={styles.Delete}
					src={Icon_delete}
					width={20}
					height={20}
					alt='delete'
					onClick={handleDeleteKeyword}
				/>
			)}
		</div>
	);
}
