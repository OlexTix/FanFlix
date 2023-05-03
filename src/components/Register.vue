<template>
  <div class="justify-content-center" id="register">
    <div class="content-container">
      <div class="form-container">
        <h2 class="title">Zarejestruj się</h2>
        <hr class="divider" />
        <Form :validation-schema="schema" @submit="onSubmit">
          <div class="card">
            <div class="field-row">
              <div class="field" style="margin-right: 1vh;">
                <label for="email" class="input-label">E-MAIL</label>
                <Field name="email" v-slot="{ field, errorMessage }">
                  <InputText v-bind="field" aria-describedby="email-help" :class="{ 'p-invalid': errorMessage }" />
                  <small id="email-help" class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
              <div class="field">
                <label for="confirmemail" class="input-label">POTWIERDŹ ADRES E-MAIL</label>
                <Field name="confirmemail" v-slot="{ field, errorMessage }">
                  <InputText v-bind="field" aria-describedby="email-help" :class="{ 'p-invalid': errorMessage }" />
                  <small id="email-help" class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
            </div>
            <div class="field-row">
              <div class="field" style="margin-right: 1vh;">
                <label for="name" class="input-label">IMIĘ</label>
                <Field name="name" v-slot="{ field, errorMessage }">
                  <InputText v-bind="field" aria-describedby="email-help" :class="{ 'p-invalid': errorMessage }" />
                  <small id="email-help" class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
              <div class="field">
                <label for="lastname" class="input-label">NAZWISKO</label>
                <Field name="lastname" v-slot="{ field, errorMessage }">
                  <InputText v-bind="field" aria-describedby="email-help" :class="{ 'p-invalid': errorMessage }" />
                  <small id="email-help" class="p-error">{{ errorMessage }}</small>
                </Field>
              </div>
            </div>

            <div class="field">
              <label for="phonenumber" class="input-label">NUMER TELEFONU</label>
              <Field name="phonenumber" v-slot="{ field, errorMessage }" v-model.number="phonenumber" type="number">
                <InputText v-bind="field" aria-describedby="email-help" :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="field">
              <label for="password" class="input-label">HASŁO</label>
              <Field name="password" v-slot="{ field, errorMessage }" v-model="password" type="password">
                <InputText v-bind="field" aria-describedby="email-help" type="password"
                  :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="field">
              <label for="confirmpassword" class="input-label">POTWIERDŹ HASŁO</label>
              <Field name="confirmpassword" v-slot="{ field, errorMessage }" v-model="confirmpassword" type="password">
                <InputText v-bind="field" aria-describedby="email-help" type="password"
                  :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="field-checkbox">
              <Checkbox v-model="accept" name="accept" :binary="true" /> <label for="accept">I agree to the terms and
                conditions*</label>
              <p class="accept-error" v-if="!accept" style="color: red; margin-bottom: 1vh;">Musisz zaakceptować warunki.
              </p>
            </div>
            <div class="card flex justify-content-center">
              <Button label="ZAREJESTRUJ SIE" type="submit" severity="primary" rounded id="signupbutton" />
            </div>
          </div>
        </Form>
      </div>

    </div>

  </div>
</template>
<style>
#register {
  background-color: #1e1e1e;
  border-radius: 20px;
  box-shadow: 0 0 50px 1px rgba(0, 0, 0, 0.25);
  margin-top: 2vh;
  margin-bottom: 2vh;
  padding: 5vh;
  justify-content: center;
  align-items: center;
  display: flex;
  max-width: 500px;
}

#signupbutton {
  width: 250px;
  height: 40px;
  border-radius: 6px;
  background-image: linear-gradient(to bottom, #00a877, #007d59);
  border-color: #007d59;
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  margin: auto;
  display: flex;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

#signupbutton:hover {
  background-image: linear-gradient(to bottom, #008660, #005a41);
  border-color: #005f44;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.field {
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  margin-bottom: 20px;
}

.input-label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.field-checkbox {
  color: white;
}

.title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 2vh;
  text-align: center;
  margin-top: 2vh;
  color: white;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #ffffff;
  margin-bottom: 20px;
}

.p-error {
  color: red;
  font-weight: bold;
  font-size: 12px;
  margin-top: 1vh;
  word-wrap: break-word;
  word-break: break-all;
}

.accept-error {
  color: red;
  font-weight: bold;
  font-size: 12px;
  margin-top: 1vh;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
<script setup>
import { ref } from "vue";
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';


const name = ref();
const email = ref();
const password = ref();
const accept = ref(false);

const schema = yup.object({
  email: yup.string().required().email().label('E-mail address'),
  confirmemail: yup.string().required().email().label('Confirm E-mail'),
  name: yup.string().required().label('Name'),
  lastname: yup.string().required().label('Lastname'),
  phonenumber: yup.number().required().label('Phone number'),
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmpassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),


});


function onSubmit(values, actions) {
  console.log(JSON.stringify(values, null, 2));
  actions.resetForm();
}


</script>


