<template>
  <div class="sidemenu">
    <div class="center">
      <router-link to="/"><img src="/images/nfanflix3.svg" alt="Fanflix Logo" class="logos"><br></router-link>
    </div>
    <div class="divider"></div>
    <div class="options">
      <div class="category">
        <div class="title">Użytkownicy</div>
        <router-link to="/users" class="option">Lista użytkowników</router-link>
        <router-link to="/users/edit" class="option">Edycja użytkowników</router-link>
        <router-link to="/users/register" class="option">Zarejesrtuj użytkownika</router-link>
      </div>
      <div class="category">
        <div class="title">Kina</div>
        <router-link to="/cinemas" class="option">Lista kin</router-link>
        <router-link to="/cinemas/halls" class="option">Sale kinowe</router-link>
        <router-link to="/cinemas/nazwa-kina" class="option">Repertuar</router-link>
      </div>
      <div class="category">
        <div class="title">Pracownicy</div>
        <router-link to="/employees" class="option">Lista pracowników</router-link>
        <router-link to="/employees/modify" class="option">Edytuj pracownika</router-link>
      </div>
      <div class="category">
        <div class="title">Inne</div>
        <router-link to="/logs" class="option">Logi</router-link>
        <router-link to="/about" class="option">Informacje</router-link>
        <router-link to="/change-password" class="option">Zmień hasło</router-link>
      </div>
    </div>
    <div class="divider"></div>
    <div class="options">
      <router-link to="/logout" class="option">Wyloguj się</router-link>
      
    </div>
  </div>
</template>
  
<style>
.sidemenu {
  width: 15%;
  float: left;
}

.logo {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.divider {
  height: 1px;
  background-color: black;
  margin: 10px 0;
}

.options {
  margin-bottom: 1vh;
  margin-left: 2vh;
}

.category {
  margin-bottom: 1vh;
}

.title {
  font-size: 1.2rem;
  margin-bottom: 0.2vh;
}

.option {
  display: block;
  padding: 5px;
  color: black;
  text-decoration: none;
}

.option:hover {
  background-color: #ddd;
}

.sidemenu {
  filter: var(--color-logo);
  -webkit-filter: var(--color-logo);
}
</style>

<script>


</script>