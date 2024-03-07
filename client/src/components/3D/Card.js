// client\src\components\3D\Card.js

import React, { useRef, useEffect } from 'react';
import styles from './Card.module.css';


function Card({ selectedImage }) {
    const cardRef = useRef();
    const frameId = useRef(null);
    const glossEffectRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        let overlay = card.querySelector('.' + styles['imageOverlay']);
        let mouseX = 0;
        let mouseY = 0;
        const sensitivity = 15;

        // 광택 효과 요소 생성 및 스타일 설정
        let glossEffect = document.createElement('div');
        glossEffect.className = styles['gloss-effect']; // CSS 모듈 사용 시 클래스 이름 수정
        card.appendChild(glossEffect);
        glossEffectRef.current = glossEffect;

        const updateOverlay = (e) => {
            if (!overlay) return; // overlay 존재 확인
            var xPercent = e.offsetX;
            var yPercent = e.offsetY;
            overlay.style.backgroundPosition = `${xPercent / 1 + yPercent / 1}%`;
            overlay.style.filter = `opacity(${Math.min(xPercent / 200, 1)}) brightness(1.2)`;
        };

        const handleMouseMove = (e) => {
            const cardRect = card.getBoundingClientRect();

            // 마우스 위치에 따라 rotate 값 계산
            mouseX = ((e.clientX - cardRect.left) / cardRect.width) * 2 - 1;
            mouseY = ((e.clientY - cardRect.top) / cardRect.height) * 2 - 1;

            const rotateX = mouseY * sensitivity * -1; // X축 회전 값
            const rotateY = mouseX * sensitivity; // Y축 회전 값

            // 카드 스타일에 회전 적용
            card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(40px)`;

            // 실시간 변환을 위해 트랜지션을 'none'으로 설정
            card.style.transition = 'none';

            // 오버레이 스타일 업데이트
            cancelAnimationFrame(frameId.current);
            frameId.current = requestAnimationFrame(() => updateOverlay(e));

            // 마우스 X 좌표에 따라 카드의 투명도 조정
            card.style.opacity = 1.7 - Math.abs(mouseX);

            // 광택 효과 위치 업데이트
            const glossX = e.clientX - cardRect.left;
            const glossY = e.clientY - cardRect.top;
            glossEffect.style.left = `${glossX - glossEffect.offsetWidth / 12}px`;
            glossEffect.style.top = `${glossY - glossEffect.offsetHeight / 11}px`;
        };

        card.addEventListener('mousemove', handleMouseMove);

        // 마우스 엔터 시 전환 효과 제거
        const handleMouseEnter = () => {
            card.style.transition = 'none';
        };
        const handleMouseLeave = () => {
            // overlay 존재 확인
            if (!overlay) overlay = card.querySelector('.' + styles['imageOverlay']);
            // overlay가 존재할 때만 스타일 적용
            if (overlay) {
                // 마우스 리브 시 전환 효과 설정
                card.style.transition = 'transform 0.5s ease-out';
                // 원래 상태로 회전 초기화
                card.style.transform = 'rotateY(0deg) rotateX(0deg)';
                card.style.opacity = 1;
                cancelAnimationFrame(frameId.current);
                overlay.style.backgroundPosition = 'initial';
            }
            // 마우스가 벗어났을 때 원래 트랜지션으로 복구
            card.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            glossEffect.style.left = '50%';
            glossEffect.style.top = '50%';
        };

        // 마우스 엔터와 리브 이벤트 리스너 추가
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
            card.removeChild(glossEffect);
            cancelAnimationFrame(frameId.current);
        };
    }, []);

    // 카드 컴포넌트 렌더링
    return (
        <div className={styles["cardWrap"]}>
            <div className={styles["cardContainer"]} ref={cardRef}>
                <div alt="image-title" className={styles["imageOverlay"]}></div>
                <img src={selectedImage} alt="image-title" className={styles["imageTitle"]} />
                <div className={styles["titleWrpa"]}>
                    <span className={styles["titleName"]}>Developer</span><br></br>
                    <span>Jeong-Hyeon Oh</span>
                </div>
            </div>
        </div>
    );
}

export default Card;
