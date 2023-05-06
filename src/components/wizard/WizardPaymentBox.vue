<template>
    <div class="justify-content-center" id="wizard-payment">
        <div class="wizard-payment-box">
            <h2 class="title" style="text-align: left;">Podsumowanie:</h2>
            <div class="ticket-info">
                <div class="row"><p class="input-label">Uczen x2</p> </div>
                <div class="row"><p class="price">100 zł</p></div>
            </div>
            <div class="ticket-info">
                <div class="row"><p class="input-label">Emeryt x2</p> </div>
                <div class="row"><p class="price">100 zł</p></div>
            </div>
            <div class="ticket-info">
                <div class="row"><p class="input-label">Dorosły x2</p> </div>
                <div class="row"><p class="price">100 zł</p></div>
            </div>
            <hr class="divider" />
            <h2 class="title" style="text-align: left;">Metody płatności:</h2>
            <div class="center">
                <div class="payment-methods" >
                        <div class="payment-method">
                        </div>
                        <div class="payment-method">
                        </div>
                        <div class="payment-method">
                        </div>
                        <div class="payment-method">
                        </div>
                        <div class="payment-method">
                        </div>

            </div>
            </div>
            <hr class="divider" />
            <div class="order-confirmation">
                <h2 class="title" style="text-align: left; margin-bottom: 1.2vh;">Potwierdzenie zamówienia:</h2>
                <p>Na podany adres email zostanie wysłane potwierdzenie zakupu wraz z numerem biletu. Numer biletu należy
                    podać w kasie kina.</p>
                    <div class="field">
                        <label for="email" style="text-align: left; margin-bottom: 1vh; font-size: 16px;" class="input-label">Adres e-mail</label>
                        <InputText v-model="email" id="emailinput" :class="{ 'p-invalid': errorMessage }" />
            <small class="p-error">{{ errorMessage }}</small>
          </div>
                
            </div>
            <div class="terms">
                <label>
                    <input type="checkbox" v-model="termsAccepted">
                    Akceptuję regulamin i politykę prywatności
                </label>
            </div>
            <div class="card flex justify-content-center">
                <Button label="POTWIERDZ ZAMOWIENIE" type="submit" severity="primary" rounded id="confirmorderbutton"
                    @click="confirmOrder" :disabled="!termsAccepted" />
                <small class="p-error">{{ errorMessage }}</small>
            </div>

        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
export default {
    name: 'WizardPaymentBox',
    components: {
        Button,
        Checkbox
    },
    data() {
        return {
            selectedPaymentMethod: null,
            email: '',
            termsAccepted: false,
        }
    },
    methods: {
        confirmOrder() {
            if (this.selectedPaymentMethod && this.email && this.termsAccepted) {
                // Do something with the selected payment method, email, and tickets
                console.log('Zamówienie potwierdzone')
            } else {
                console.log('Nie udało się potwierdzić zamówienia')
            }
        },
    },
}
</script>

<style>
#wizard-payment {
    background-color: #1e1e1e;
    border-radius: 20px;
    box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
    margin-top: 2vh;
    margin-bottom: 2vh;
    padding: 5vh;
    justify-content: center;
    align-items: center;
    display: flex;
    max-width: 1020px;
}

.ticket-info {
  display: flex;
  justify-content: space-between;
}

.divider {
    width: 100%;
    height: 1px;
    background-color: #ffffff;
    margin-bottom: 20px;
}

.payment-method {
    display: flex;
    text-align: center;
    width: 200px;
    height: 120px;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #fff;
}

.payment-methods {
    display: flex;
    flex-wrap: wrap;
    margin: auto;
    width: 880px;
    margin-bottom: 2vh;
}

.payment-method {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    margin-top: 1rem;
}

.field-row {
    justify-content: space-between;
    align-items: center;
}

.payment-method img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    margin-right: 0.5rem;
}

#emailfield {
    display: flex;
    flex-direction: column;
    color: white;
    width: 100%;
    margin-bottom: 20px;

}


.image-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 180px;
    height: 120px;
}

.row {
  display: flex;
  align-items: center;
}
.input-label {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 5px;
    color: white;
}

.price {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 5px;
    color: white;
}

#confirmorderbutton {
    width: 250px;
    height: 40px;
    border-radius: 6px;
    background-image: linear-gradient(to bottom, #00a877, #007d59);
    border-color: #007d59;
    font-weight: 500;
    font-size: 15px;
    color: #ffffff;
    margin: auto;
    display: flex;
    justify-content: center;
    text-align: center;
    cursor: pointer;
}

#confirmorderbutton:hover {
    background-image: linear-gradient(to bottom, #008660, #005a41);
    border-color: #005f44;
}

.title {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 2vh;
    text-align: center;
    margin-top: 2vh;
    color: white;
}

.title2 {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 2vh;
    text-align: center;
    margin-top: 2vh;
    color: white;
}

.field {
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  margin-bottom: 20px;
}
</style>