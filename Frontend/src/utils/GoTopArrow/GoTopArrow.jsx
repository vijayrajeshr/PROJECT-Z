import { useState, useEffect } from 'react';
import css from './GoTopArrow.module.css';
import topArrow from '/icons/up-arrow.png';

const GoTopArrow = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div
            className={`${css.outerDiv} ${isVisible ? css.visible : css.hidden}`}
            onClick={scrollToTop}
        >
            <div className={css.innerDiv}>
                <img className={css.topArrow} src={topArrow} alt="up arrow" />
            </div>
        </div>
    );
};

export default GoTopArrow;