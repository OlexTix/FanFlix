<template>
  <div class="justify-content-center" id="register">
    <div class="content-container">
      <div class="form-container">
        <h2 class="title">Zarejestruj się</h2>
        <hr class="divider" />
        <Form :validation-schema="schema" @submit="onSubmit">
          <div class="card">
            <div class="field">
              <label for="email" class="input-label">E-MAIL</label>
              <Field name="email" v-slot="{ field, errorMessage }">
                <InputText v-bind="field"  aria-describedby="email-help"
                  :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="field">
              <label for="email" class="input-label">POTWIERDŹ ADRES E-MAIL</label>
              <Field name="confirmemail" v-slot="{ field, errorMessage }">
                <InputText v-bind="field" aria-describedby="email-help"
                  :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="field">
              <label for="email" class="input-label">IMIĘ</label>
              <Field name="name" v-slot="{ field, errorMessage }">
                <InputText v-bind="field" aria-describedby="email-help"
                  :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>
            <div class="field">
              <label for="email" class="input-label">NAZWISKO</label>
              <Field name="lastname" v-slot="{ field, errorMessage }">
                <InputText v-bind="field" aria-describedby="email-help"
                  :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>

            <div class="field">
              <label for="email" class="input-label">NUMER TELEFONU</label>
              <Field name="phonenumber" v-slot="{ field, errorMessage }" v-model.number="phonenumber" type="number">
                <InputText v-bind="field"  aria-describedby="email-help"
                  :class="{ 'p-invalid': errorMessage }" />
                <small id="email-help" class="p-error">{{ errorMessage }}</small>
              </Field>
            </div>

            <div class="field">
              <div class="p-float-label">
                <Password id="password" v-model="password" toggleMask>
                  <template #header>
                    <h6>Pick a password</h6>
                  </template>
                  <template #footer>
                    <p class="mt-2">Suggestions</p>
                    <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                      <li>At least one lowercase</li>
                      <li>At least one uppercase</li>
                      <li>At least one numeric</li>
                      <li>Minimum 8 characters</li>
                    </ul>
                  </template>
                  <small id="email-help" class="p-error">{{ errorMessage }}</small>
                </Password>
                <label for="password">Password</label>
              </div>

            </div>
            <div class="field">
              <div class="p-float-label">
                <Password id="confirmpassword" v-model="confirmpassword" :feedback="false" toggleMask>
                </Password>
                <label for="confirmpassword">Confirm Password</label>
              </div>

            </div>
            <div class="field-checkbox">
              <Checkbox v-model="accept" name="accept" :binary="true" /> <label for="accept">I agree to the terms and
                conditions*</label>

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
  padding: 2vh;
  justify-content: center;
  align-items: center;
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
  margin-top: 20px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

#signupbutton:hover {
  background-image: linear-gradient(to bottom, #008660, #005a41);
  border-color: #005f44;
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
  margin-top: 10px;
  margin-left: 1vh;
  margin-right: 1vh;
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
    .oneOf([yup.ref('password'), null], 'Passwords must match')

});


function onSubmit(values, actions) {
  console.log(JSON.stringify(values, null, 2));
  actions.resetForm();
}


</script>


