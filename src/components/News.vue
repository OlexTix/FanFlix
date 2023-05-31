<template>
  <div class="news-com">
    <!-- <div class="selectCinema">
      <p>Sprawdź repertuar filmów</p>
      <Dropdown v-model="selectedCinema" :options="cinemas" optionLabel="name" placeholder="Wybierz kino" class="rep-dropdown-custom" />
      <Button label="Sprawdź" severity="success" />
    </div> -->
    
    <TabView>
      <TabPanel header="Wiadomości">
        <p>
          <div class="post">
            <img src="https://planetagracza.pl/wp-content/uploads/2022/08/projekt-bez-tytulu-1-14.jpg" alt="News">
            <div class="content">
              <h2>Zwiększamy ilość miejsc</h2>
              <p>Ze względu na spore zainteresowanie naszymi najnowszymi tytułami, przekazujemy dobrą wiadomość. D0 każdej sali kinowej, zwiększamy o 10% miejsc. </p>
            </div>
          </div>

          <div class="post">
            <img src="https://www.simplyrecipes.com/thmb/Xzggu-Md45HKhhYSw4DK8tGlZ_I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Perfect-Popcorn-LEAD-41-4a75a18443ae45aa96053f30a3ed0a6b.JPG" alt="News">
            <div class="content">
              <h2>Kup popcorn a drugi dostań gratis</h2>
              <p>Ogłaszamy ofertę ograniczoną czasowo. Przez następne 2 tygodnie, w naszym sklepie możecie dostać drugie opakowanie popcornu za darmo </p>
            </div>
          </div>

          <div class="post">
            <img src="https://media.nbcchicago.com/2022/09/GettyImages-535640865.jpg?quality=85&strip=all&resize=1200,675" alt="News">
            <div class="content">
              <h2>Wygraj 2 bilety</h2>
              <p>Chcesz wygrać dwa bilety na film Avatar: Istota wody i przeżyć niesamowite emocje. Oto co trzeba spełnić.   </p>
            </div>
          </div>
        </p>
      </TabPanel>
      <TabPanel header="Promocje">
        <p>
          <div class="grid-container">
            <div class="tile">
              <a href="#">
                <div class="tile-overlay">
                  <h2 class="tile-title">Zgarnij bilety</h2>
                </div>
                <img src="https://www.identityiq.com/wp-content/uploads/2022/07/TicketScam_pic.jpg" alt="Prom">
              </a>
            </div>

            <div class="tile">
              <a href="#">
                <div class="tile-overlay">
                  <h2 class="tile-title">Zaproś znajomych</h2>
                </div>
                <img src="https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80" alt="Prom">
              </a>
            </div>

            <div class="tile">
              <a href="#">
                <div class="tile-overlay">
                  <h2 class="tile-title">Złap zniżkę</h2>
                </div>
                <img src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80" alt="Prom">
              </a>
            </div>

            <div class="tile">
              <a href="#">
                <div class="tile-overlay">
                  <h2 class="tile-title">Wykup sale</h2>
                </div>
                <img src="https://images.unsplash.com/photo-1640127249305-793865c2efe1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1103&q=80" alt="Prom">
              </a>
            </div>
          </div>
        </p>
      </TabPanel>
      <TabPanel header="Fan Klub">
        <p>
          <div class="grid-container">
            <div class="tile">
              <a href="#">
                <div class="tile-overlay">
                  <h2 class="tile-title">Karta stałego klienta</h2>
                </div>
                <img src="https://lowcyrabatow.pl/wp-content/uploads/2019/07/mojabiedronka-karta.png" alt="Card">
              </a>
            </div>
          </div>
        </p>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';

export default {
  name: 'News',
  data() {
    return {
      selectedCinema: null,
    };
  },
  components: {
    TabView,
    TabPanel,
    Dropdown,
    Button,
  },
  methods: {
    async fetchCinemas() {
      try {
        const response = await this.$http.get('/api/cinemas');
        this.cinemas = response.data;
      } catch (error) {
        console.error('Błąd podczas pobierania kin:', error.message, error.response);
      }
    },
  },
}
</script>

<style>
.selectCinema {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.p-component, .p-component * {
  background-color: var(--color-background-pres) !important;
  color: var(--color-text) !important;
  font-family: Inter,'primeicons', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}
.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {
  box-shadow: none !important;
}
.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border-color: #32c061 !important;
}
.p-tabview .p-tabview-panels {
  min-height: 550px;
}
.rep-dropdown-custom {
  width: 16rem;
  height: 3.2rem;
  margin-right: 2rem;
}
.selectCinema p {
  font-family: Inter;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
}
/* news */
.post {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.post img {
  width: 12rem;
  height: 8rem;
  object-fit: cover;
  margin-right: 20px;
}

.post .content {
  flex: 1;
}

.post h2 {
  font-size: 20px;
  margin-top: 0;
}

.post p {
  font-size: 16px;
  margin-bottom: 0;
}
/* prom */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1.2rem;
}

.tile {
  position: relative;
}

.tile a {
  display: block;
  position: relative;
}

.tile img {
  display: block;
  width: 100%;
  object-fit: cover;
  height: 15rem;
  transition: opacity 0.3s ease;
}

.tile .tile-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.tile:hover img {
  opacity: 0.3;
}

.tile:hover .tile-overlay {
  opacity: 0.9;
}

.tile .tile-overlay .tile-title {
  color: #fff;
  font-size: 1.5rem;
}
.tile:hover .tile-overlay .tile-title {
  color: #fff;
  opacity: 1;
}
</style>