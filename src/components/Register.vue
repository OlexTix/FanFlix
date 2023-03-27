<template>
    <div class="flex justify-content-center" style="max-width: 300px" id="register">
        <h1>Sign Up</h1>
        <Form
        :initial-values="initialValues"
        :validation-schema="schema"
        @submit="onSubmit"
      >
        <div class="card">

            <div class="field">
            <Field name="name" v-slot="{ field, errorMessage }">
            <InputText
              v-bind="field"  placeholder="Name"
              aria-describedby="email-help"
              :class="{ 'p-invalid': errorMessage }"
            />
            <small id="email-help" class="p-error">{{ errorMessage }}</small>
        </Field>
          </div>
          <div class="field">
            <Field name="lastname" v-slot="{ field, errorMessage }">
            <InputText
              v-bind="field"  placeholder="Lastname"
              aria-describedby="email-help"
              :class="{ 'p-invalid': errorMessage }"
            />
            <small id="email-help" class="p-error">{{ errorMessage }}</small>
        </Field>
          </div>
            
          <div class="field">
            <Field name="email" v-slot="{ field, errorMessage }">
            <InputText
              v-bind="field"  placeholder="E-mail"
              aria-describedby="email-help"
              :class="{ 'p-invalid': errorMessage }"
            />
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
                <Button label="Sign Up"  type="submit" severity="primary" rounded />
            </div>
        </div>
    </Form>
    </div>
</template>
<style>
#register > form > .card >.field
{
    margin-top: 1.3vh;
}


#register> form> .card>.field-checkbox {
    margin-top: 1.3vh;
}

#register> form> .card>.card.flex.justify-content-center{
    margin-top: 1.3vh;
}

.p-error {
  display: block;
}
</style>
<script setup>
import { ref } from "vue";
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import {Field, Form } from 'vee-validate';
import * as yup from 'yup';


const name = ref();
const email = ref();
const password = ref();
const accept = ref(false);




const schema = yup.object({
  email: yup.string().required().email().label('Email address'),
  name: yup.string().required().label('Name'),
  lastname: yup.string().required().label('Lastname'),
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


