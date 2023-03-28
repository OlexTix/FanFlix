<template>
    <div class="new-icon">
      <div class="icons-awansome">
        <fa-icon icon="fa-solid fa-fire-flame-curved" />
        <h2 style="margin-left: 1rem;">What's new</h2>
      </div>
    </div>
    
    <div class="carousel-wid">
    <swiper
      :slidesPerView="1"
      :spaceBetween="8"
      :navigation="true"
      :breakpoints="{
        '640': {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        '768': {
          slidesPerView: 3,
          spaceBetween: 32,
        },
        '980': {
          slidesPerView: 4,
          spaceBetween: 32,
        },
        '1324': {
          slidesPerView: 5,
          spaceBetween: 34,
        },
        '1600': {
          slidesPerView: 6,
          spaceBetween: 34,
        },
      }"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide><img src="https://cdn.gracza.pl/galeria/mdb/f/3448000.jpg" /></swiper-slide>
      <swiper-slide><img src="https://www.bilety24.pl/media/cache/resolve/repertoire_big/https://www.bilety24.pl/public/users/1303/o/kot-plakat2.jpg" /></swiper-slide>
      <swiper-slide><img src="https://i.etsystatic.com/35153613/r/il/83569b/4375657449/il_fullxfull.4375657449_9p7k.jpg" /></swiper-slide>
      <swiper-slide><img src="https://plcw.tmsimg.com/assets/p22179066_v_v12_aa.jpg" /></swiper-slide>
      <swiper-slide><img src="https://res.cloudinary.com/westfielddg/image/upload/q6wjfacmlh40hevewkww" /></swiper-slide>
      <swiper-slide><img src="https://image.tmdb.org/t/p/original/yCvB5fG5aEPqa1St7ihY6KEAsHD.jpg" /></swiper-slide>
      <swiper-slide><img src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2019%2F10%2Flittle-women_3-2000.jpg&q=60" /></swiper-slide>
      <swiper-slide><img src="https://cdn.discordapp.com/attachments/914170768693280768/1088817948573061141/ambulancemovie.jpg" /></swiper-slide>
      <swiper-slide><img src="https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg" /></swiper-slide>
    </swiper>
    </div>
    <div class="test-spacer"></div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'primeicons/primeicons.css';

  export default {
    components: {
      Swiper,
      SwiperSlide,
    },
    setup() {
      return {
        modules: [Pagination, Navigation],
      };
    },
  };

</script>

<style>
.carousel-wid {
  height: 26rem;
  margin-top: 1.3rem;
  margin-bottom: 2rem;    
  user-select: none;  
}
.swiper {
  margin: 0;
  width: 100%;
  height: 100%;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.new-icon {
  margin-left: auto;
  margin-right: auto;
  max-width: 1012px;
  user-select: none;
}
.icons-awansome {
  display: flex;
  margin-top: 1.3rem;
  padding-left: 0.8rem;
}
.icons-awansome .svg-inline--fa {
  height: 2.2rem;
}
.test-spacer {
  height: 900px;
  background-color: #303446;
}
</style>