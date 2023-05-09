<template>
    <div class="outer-container">
      <div class="inner-container">
        <h2 class="thank-you-title">Dziękujemy za zakupienie biletu!</h2>
        <div class="ticket-number-card">
          <h3 class="ticket-number-label">Numer biletu:</h3>
          <p class="ticket-number">{{ ticketNumber }}</p>
        </div>
        <p class="instruction-text">Proszę pokazać ten numer biletu przy kasie.</p>
        <div class="back-to-home-container">
          <button @click="goToHome" class="back-to-home-btn">Powrót</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ThankYou",
    data() {
      return {
        ticketNumber: this.generateTicketNumber(),
      };
    },
    methods: {
      generateTicketNumber() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let result = "#";
  
        for (let i = 0; i < 14; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
  
        return result;
      },
      goToHome() {
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style scoped>
  .outer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #181818;
  }
  
  .inner-container {
    background-color: #292929;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  .thank-you-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .ticket-number-card {
    background-color: #00855e;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .ticket-number-label {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .ticket-number {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  
  .instruction-text {
    font-size: 16px;
    text-align: center;
  }
  
  .back-to-home-container {
    display: flex;
    justify-content: center;
  }
  
  .back-to-home-btn {
    margin: 20px;
    background-color: #00855e;
    border: none;
    color: #fff;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.2s;
  }
  
  .back-to-home-btn:hover {
    background-color: #006c4c;
  }
  </style>