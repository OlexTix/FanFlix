<template>
    <div class="new-icon">
      <div class="icons-awansome">
        <fa-icon icon="fa-solid fa-fire-flame-curved" />
        <p style="margin-left: 1rem;">Co nowego</p>
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
        '1930': {
          slidesPerView: 7,
          spaceBetween: 41,
        },
        '2290': {
          slidesPerView: 8,
          spaceBetween: 44,
        },
      }"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide v-for="movie in movies" :key="movie.id">
        <RouterLink :to="`/movies/${movie.title}`">
          <img class="poster-view" :src="movie.poster_url" />
        </RouterLink>
      </swiper-slide>
    </swiper>

    </div>
    
</template>

<script>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper';
import axiosInstance from "../service/apiService.js";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'primeicons/primeicons.css';


  export default {
    name: 'Homepage',
    components: {
      Swiper,
      SwiperSlide,
    },
    setup() {
      return {
        modules: [Pagination, Navigation],
      };
    },
    data() {
    return {
      movies: [],
      errorMessage: "",
      };
    },
    mounted(){
      this.fetchMovies();
    },
    methods: {
      async getMoviePosterUrl(movie_title) {
      try {
        const response = await axiosInstance.get(`/api/movies/${movie_title}`);
        const movie = response.data;
        return movie.poster_url;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async fetchMovies() {
      try {
        const response = await axiosInstance.get("/api/panel/movies");
        const movies = response.data.map(movie => {
          const genres = movie.genres.join(", ");

          const releaseDate = new Date(movie.release_date).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
            .split(".")
            .join(".");

          return { ...movie, genres, release_date: releaseDate };
        });
        this.movies = movies;
      } catch (error) {
        console.error(error);
      }
    },
    }
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
  font-size: 2rem;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.swiper-slide a img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.new-icon {
  margin-left: auto;
  margin-right: auto;
  max-width: 1024px;
  user-select: none;
}
.icons-awansome {
  display: flex;
  margin-top: 1.2rem;
  padding-left: 0.8rem;
}
.icons-awansome p {
  font-size: 1.2rem;
  margin: 0.3rem 0;
}
.icons-awansome .svg-inline--fa {
  height: 2.1rem;
}
.swiper-button-next, .swiper-button-prev {
  color: var(--color-nav);
  background-color: var(--color-heading);
  width: 3rem;
  height: 3rem;
  margin-top: calc(0px - (3rem / 2));
  border-radius: 50%;
}
.swiper-button-next {
  padding-left: 0.2rem;
}
.swiper-button-prev {
  padding-right: 0.2rem;
}
.swiper-button-next:after, .swiper-button-prev:after{
  font-size: 1.6rem;
}
.poster-view {
  cursor: pointer;
  transition: all 0.8s ease-in-out; 
}
.poster-view:hover {
  transform: scale(1.1);
}
.swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled {
  pointer-events: fill;
}
</style>