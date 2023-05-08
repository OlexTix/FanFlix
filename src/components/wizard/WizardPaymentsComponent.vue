<template>
    <div class="container">
      <h2 class="summary-title">Podsumowanie:</h2>
  
      <div class="summary-line">
        <p class="summary-item">Uczeń x2</p>
        <p class="summary-item summary-price">49.80zł</p>
      </div>
  
      <Divider />
  
      <h2 class="payment-methods-title">Metody płatności:</h2>
  
      <div class="payment-cards-container">
        <img src="../../assets/payments/card-biedronka.png" class="payment-card" />
        <img src="../../assets/payments/card-kaufland.png" class="payment-card" />
      </div>
      
      <div class="payment-methods">
    <h2 class="payment-methods-title">Metody płatności:</h2>
    <stripe-pricing-table
      pricing-table-id="prctbl_1N5X95CXQDPyzexLr9Ywf4ZJ"
      publishable-key="pk_test_51N5X1YCXQDPyzexL9wKsClOPubD0UpbnyeWJh3ouxJyiIrrJOXtXjaGIwmsPbUlBvzHd8G8mwf5OLLULDhmHV3Rc00jpjjnov7"
    ></stripe-pricing-table>
      </div>
  
      <Divider />
  
      <h2 class="confirmation-title">Potwierdzenie zamówienia:</h2>
  
      <p class="confirmation-text">
        Na podany adres email zostanie wysłane potwierdzenie zakupu wraz z numerem biletu. Numer biletu należy podać w kasie kina.
      </p>
  
      <div class="email-input">
        <label for="email">Adres e-mail</label>
        <input type="email" id="email" />
      </div>
  
      <div class="acceptance">
        <input type="checkbox" id="acceptance" />
        <label for="acceptance" class="acceptance-text">*Akceptuję Regulamin i Politykę prywatności.</label>
      </div>
  
      <button class="confirm-button">Potwierdź zamówienie</button>
    </div>
  </template>
  
  <script>
  import Divider from '../../components/Divider.vue';
  
  export default {
    name: 'OrderSummaryComponent',
    components: {
      Divider,
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .summary-title,
  .payment-methods-title,
  .confirmation-title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 100px;
  }
  
  .summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .payment-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-gap: 10px;
    height: 120px;
    border-radius: 10px;
    overflow-wrap: break-word;
  }

  .payments-card {
    height: 80px;
    margin-right: 20px;
    border-radius: 7px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  .payments-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  
  .confirmation-text {
    font-weight: thin;
    font-size: 20px;
  }
  
  .email-input {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  
  .acceptance {
    display: flex;
    align-items: center;
  }
  
  .acceptance-text {
    margin-left: 5px;
  }
  
  .confirm-button {
    background-color: #00a877;
    color: #ffffff;
    font-weight: 500;
    font-size: 18px;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    margin-top: 20px;
  }

  .confirm-button:hover {
  background-color: #008660;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>