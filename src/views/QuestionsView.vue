<template>
    <main>
        <Navbar />
        <BaseTemplate>
            <div>
                <h3 class="mainRegulation">Często zadawane pytania: </h3>
                <p class="neo">
                    1. Jak mogę zakupić bilety na film? <br>
                    Możesz zakupić bilety na film poprzez naszą stronę internetową. Wybierz film, datę, godzinę oraz ilość
                    biletów, a następnie postępuj zgodnie z instrukcjami, aby dokonać płatności.
                </p>
                <p class="neo">
                    2. Czy mogę zarezerwować miejsca w kinie? <br>
                    Tak, oferujemy możliwość rezerwacji miejsc w kinie. Podczas procesu zakupu biletów będziesz mógł wybrać
                    preferowane miejsca z dostępnej mapy sali kinowej.
                </p>
                <p class="neo">
                    3. Jakie są dostępne metody płatności? <br>
                    Akceptujemy różne metody płatności, takie jak karty kredytowe, karty debetowe oraz płatności
                    elektroniczne. Wszystkie dostępne opcje płatności są widoczne podczas procesu zakupu biletów.
                </p>
                <p class="neo">
                    4. Czy istnieje możliwość zwrotu biletów? <br>
                    Zwroty biletów są możliwe tylko w przypadku anulowania lub zmiany seansu przez kina. Prosimy o
                    zapoznanie się z naszymi zasadami zwrotów, które są dostępne na stronie.
                </p>
                <p class="neo">
                    5. Jak mogę anulować lub zmienić moją rezerwację? <br>
                    Jeśli chcesz anulować lub dokonać zmiany w swojej rezerwacji, skontaktuj się z naszym działem obsługi
                    klienta podając szczegóły rezerwacji. Postaramy się pomóc w realizacji twojej prośby.
                </p>
                <p class="neo">
                    6. Czy mogę otrzymać potwierdzenie mojej rezerwacji? <br>
                    Tak, po złożeniu rezerwacji otrzymasz potwierdzenie na podany adres e-mail. Potwierdzenie zawiera
                    szczegóły dotyczące zamówienia oraz informacje niezbędne do odbioru biletów w kinie.
                </p>
                <p class="neo">
                    7. Czy mogę korzystać z kodów promocyjnych lub kuponów rabatowych? <br>
                    Oferujemy czasami kody promocyjne lub kuponów rabatowe, które można wykorzystać podczas zakupu biletów.
                    Informacje na temat dostępnych promocji są ogłaszane na stronie lub wysyłane w wiadomościach e-mail.
                </p>
            </div>
        </BaseTemplate>
    </main>
</template>

<script>
import { defineComponent } from "vue"
import Navbar from "../components/Navbar.vue"
import BaseTemplate from "../components/templates/BaseTemplate.vue"

export default defineComponent({
    name: 'Regulations',
    components: {
        Navbar,
        BaseTemplate,
    }
})
</script>

<style>
.mainRegulation {
    margin-top: 3rem;
    margin-bottom: 2rem;
}

.neo {
    margin-bottom: 1.2rem;
}
</style>
