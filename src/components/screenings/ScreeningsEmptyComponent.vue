<template>
    <div class="empty-screenings">
      <h2>Brak seansów</h2>
      <p>Przepraszamy, ale nie znaleziono żadnych seansów na ten dzień.</p>
      <img class="empty-screenings-svg" src="../../assets/sad-cinema.svg" alt="Brak seansów" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'EmptyScreenings',
  };
  </script>
  
  <style scoped>
  .empty-screenings {
    text-align: center;
    font-size: 18px;
    color: #ccc;
  }
  
  .empty-screenings-svg {
    width: 200px;
    height: 200px;
    margin-bottom: 16px;
    margin-top: 16px;
  }
  </style>