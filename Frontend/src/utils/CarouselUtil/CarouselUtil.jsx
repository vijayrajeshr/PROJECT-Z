import Slider from "react-slick";
import css from './CarouselUtil.module.css'

import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

import PrevArrow from './Arrows/PrevArrow'
import NextArrow from './Arrows/NextArrow'


const CarouselUtil = (props) => {
  const { children, slidesToShow = 5, slidesToScroll = 5, dots = false, infinite = true, autoplay = false, autoplaySpeed = 3000, pauseOnHover = true } = props;

  const settings = {
    dots: dots,
    infinite: infinite,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    pauseOnHover: pauseOnHover,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return <>
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <Slider {...settings}>
          {children}
        </Slider>
      </div>
    </div>
  </>;
}

export default CarouselUtil;