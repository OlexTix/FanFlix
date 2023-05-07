<template>
    <div class="container">
      <img class="image" :src="poster_url" alt="Movie Image" />
      <div class="content">
        <h1 class="title">JOHN WICK: CHAPTER 4</h1>
        <p class="date">Poniedziałek 27 marca godz. 10:10</p>
        <div class="info-container">
          <div class="left-info">
            <p class="city">Łódź</p>
            <p class="screen">Ekran 10</p>
            <p class="format">Film 2D</p>
          </div>
            <div class="right-info">
              <div class="info-item">
                <img class="icon" src="../../assets/calendar.svg" alt="Icon" />
                <div>
                  <span>Data premiery:</span>
                  <span>24 marca 2023</span>
                </div>
              </div>
              <div class="info-item">
                <img class="icon" src="../../assets/clock.svg" alt="Icon" />
                <div>
                  <span>Czas trwania:</span>
                  <span>99 minut</span>
                </div>
              </div>
            </div>
        </div>
        <div class="description-container">
          <p class="description">Keanu Reeves powraca, by stanąć do decydującej walki z błyskotliwym i bezlitosnym Billem Skarsgardem, który pokazał już swoje mroczne oblicze w przerażającym „TO”. O wolność na ubitej ziemi Nowego Jorku, Paryża, Tokio i Berlina. Ceny idą w górę, więc także stawka za głowę legendarnego zabójcy, Johna Wicka przebiła już sufit...</p>
          <button class="go-to-movie">Przejdź do filmu</button>
        </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: 'WizardMoviePreviewComponent',
    props: {
    poster_url: {
      type: String,
      required: true,
    },
  },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    height: 320px;
  }
  
  .image {
    max-height: 320px;
    height: 100%;
    object-fit: cover;
  }
  
  .content {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    word-wrap: break-word;
  }
  
  .date {
    font-size: 18px;
  }
  
  .info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
  
  .left-info,
  .right-info {
    display: flex;
    flex-direction: column;
  }
  
  .city,
  .screen,
  .format {
    font-size: 18px;
  }
  
  .right-info .info-item {
    display: flex;
    align-items: center;
  }

  .info-item {
    margin-bottom: 10px;
  }

  .right-info .info-item div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .icon {
    width: 30px;
    height: 30px;
    margin-right: 15px;
    filter: var(--color-logo);
  }

  .description-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
  }
  
  .go-to-movie {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    text-decoration: underline;
    font-size: 16px;
  }

  @media (max-width: 767px) {
    .left-info {
      flex-direction: row;
    }

    .right-info {
      flex-direction: row;
      gap: 20px;
    }

    .info-container {
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
    }

    .city,
    .screen,
    .format {
      margin-right: 10px;
    }

    .break {
      display: inline;
    }

    .image {
        flex-shrink: 1;
        max-width: 20%;
    }
  }
</style>