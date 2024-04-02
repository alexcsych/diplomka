import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './Banner.module.sass'
import './Banner.css'
import Banner1 from './Banner1.png'
import Banner2 from './Banner2.png'
import Banner3 from './Banner3.png'
import Banner4 from './Banner4.png'

const slideContent = [
  {
    title: 'Потужні ігрові системи',
    description:
      'Зануртеся у світ ігор із нашими потужними ігровими комп’ютерами. Неймовірна продуктивність і захоплююча графіка чекають на вас!',
    image: Banner1
  },
  {
    title: 'Кращі ноутбуки для роботи та навчання',
    description:
      'У нас ви знайдете широкий вибір ноутбуків для роботи та навчання. Від потужних професійних моделей до легких та компактних ультрабуків.',
    image: Banner2
  },
  {
    title: 'Аксесуари для комп’ютера',
    description:
      'Розкрийте повний потенціал вашого комп’ютера із нашими аксесуарами. Клавіатури, миші, монітори та багато іншого для покращення вашого робочого простору.',
    image: Banner3
  },
  {
    title: 'Надійні комплектуючі для оновлення',
    description:
      'Оновіть свій комп’ютер із нашими надійними комплектуючими. Процесори, відеокарти, жорсткі диски та інші деталі для підвищення продуктивності.',
    image: Banner4
  }
]

const settings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000
}

function Banner () {
  return (
    <div className={styles.page}>
      <Slider {...settings}>
        {slideContent.map((slide, index) => (
          <div key={index} className={styles.sliderItem}>
            <img
              src={slide.image}
              alt={`slide-${index}`}
              className={styles.img}
            />
            <div className={styles.slideContent}>
              <p className={styles.title}>{slide.title}</p>
              <p className={styles.description}>{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Banner
