import React, { useState } from 'react';
import styles from './myMenuItem.module.css';
import Image from 'next/image';
import MoreModal from '../modals/MoreModal';

interface MyMenuItemProps {
	menuTitle: string;
}

function MyMenuItem({ menuTitle }: MyMenuItemProps) {
	const [isMoreModalOpen, setIsMoreModalOpen] = useState<boolean>(false);

	return (
		<>
			<div className={styles.itemContainer}>
				<p className={styles.menuTitle}>{menuTitle}</p>
				<Image
					alt='moreIcon'
					src='/svg/moreIcon.svg'
					width={24}
					height={24}
					onClick={(e) => {
						e.preventDefault();
						isMoreModalOpen
							? setIsMoreModalOpen(false)
							: setIsMoreModalOpen(true);
					}}
					style={{ position: 'relative', cursor: 'pointer', zIndex: '1' }}
				/>
				{isMoreModalOpen && (
					<>
						<div
							style={{
								position: 'absolute',
								transform: 'translate(191.5px, 65px)',
								zIndex: '6',
							}}
						>
							<MoreModal
								menuTitle={menuTitle}
								teamNumber={0}
								teamTitle=''
								pageType='outsideMyMenu'
							/>
						</div>
					</>
				)}
			</div>
		</>
	);
}

export default MyMenuItem;
