'use client';

import styles from './login.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../swiper.bundle.css';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import LoginImage from '../../../public/svg/kakao_login_large_wide.svg';
import Button from '@/components/buttons/Button';
import TutorialStep from './_components/TutorialStep';
import { useRouter } from 'next/navigation';

export default function Login() {
	const route = useRouter();

	const loginHandler = () => {
		window.location.href =
			'https://api.molip.site/oauth2/authorization/kakao';
	};
	const handleTrialClick = () => {
		route.push('/trial_version');
	};

	return (
		<div className={styles.Container}>
			<div className={styles.TutorialBox}>
				<Swiper
					pagination={{
						clickable: true,
					}}
					modules={[Pagination]}
					className={styles.TutorialBox}
				>
					<SwiperSlide>
						<TutorialStep step={1} />
					</SwiperSlide>
					<SwiperSlide>
						<TutorialStep step={2} />
					</SwiperSlide>
					<SwiperSlide>
						<TutorialStep step={3} />
					</SwiperSlide>
					<SwiperSlide>
						<TutorialStep step={4} />
					</SwiperSlide>
				</Swiper>
			</div>
			<div className={styles.BtnBox}>
				<p className={styles.Sub}>
					오늘, 당신의 입맛을 반영한 '나의 메뉴판'을 만들어보세요!
				</p>
				<Button state='test' onClick={handleTrialClick}>
					'나의 메뉴판' 체험하기
				</Button>
				<Image
					className={styles.Kakao}
					src={LoginImage}
					width={350}
					height={60}
					alt='login'
					onClick={loginHandler}
				/>
			</div>
		</div>
	);
}
