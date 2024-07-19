import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './styles/modifyModal.module.css';
import ModalButton from '../buttons/ModalButton';
import ReactDOM from 'react-dom';

interface ModifyModalProps {
  setIsModifyModalOpen: Dispatch<SetStateAction<boolean>>;
  teamName: string;
  teamNumber: number;
}

function ModifyModal({
  teamName,
  teamNumber,
  setIsModifyModalOpen,
}: ModifyModalProps) {
  const [name, setName] = useState<string>(teamName);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<number>(teamNumber);

  const handleNumberSelect = (num: number) => {
    setSelectedNumber(num);
  };

  const handleSave = (): void => {
    if (name === '') {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    setIsModifyModalOpen(false);
  };

  const closeModal = (): void => {
    setIsModifyModalOpen(false);
  };

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  return ReactDOM.createPortal(
		<>
			<div
				className={styles.overlay}
				onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
					if (event.target === event.currentTarget) {
						setIsModifyModalOpen(false);
					}
				}}
			>
				<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
					<div className={styles.topSection}>팀 정보 수정</div>
					<div className={styles.midSection}>
						{isEmpty ? (
							<p className={`${styles.midTitle} ${styles.empty}`}>
								팀 이름을 입력하세요.*
							</p>
						) : (
							<p className={styles.midTitle}>팀 이름을 입력하세요.</p>
						)}

						<input
							value={name}
							placeholder='팀 이름'
							onChange={(e) => inputChange(e)}
							className={styles.inputSection}
						/>
					</div>
					<div className={styles.bottomSection}>
						<p className={styles.bottomTitle}>인원수를 선택하세요.</p>
						<div className={styles.teamNumberSelect}>
							{items.map((item, index) => (
								<div
									key={index}
									className={`${styles.teamNumberItem} ${selectedNumber === item ? styles.selected : ''}`}
									onClick={() => handleNumberSelect(item)}
								>
									{item}명
								</div>
							))}
						</div>
					</div>
					<div className={styles.buttonSection}>
						<ModalButton
							buttonText='취소'
							handleClick={closeModal}
							color='gray'
						/>
						<ModalButton
							buttonText='확인'
							handleClick={handleSave}
							color='orange'
						/>
					</div>
				</div>
			</div>
		</>,
		document.body,
	);
}

export default ModifyModal;
