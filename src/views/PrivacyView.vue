<template>
    <main>
        <Navbar />
        <BaseTemplate>
            <div>
                <h3 class="mainRegulation">Polityka prywatności</h3>
                <p class="neo">
                    Niniejsza Polityka prywatności określa, w jaki sposób gromadzimy, używamy, udostępniamy i chronimy
                    informacje osobiste użytkowników naszej strony internetowej sprzedającej bilety kinowe. Zależy nam na
                    ochronie Twojej prywatności i dbamy o poufność Twoich danych. Prosimy o zapoznanie się z poniższymi
                    informacjami.
                </p>
                <p class="neo">
                    1. Rodzaj gromadzonych danych <br>
                    Gromadzimy pewne dane osobowe, które są niezbędne do świadczenia usług związanych z zakupem biletów
                    kinowych. Mogą to obejmować: imię i nazwisko, adres e-mail, numer telefonu, dane płatności oraz
                    informacje dotyczące zakupionych biletów.
                </p>
                <p class="neo">
                    2. Cel gromadzenia danych <br>
                    Gromadzone dane osobowe wykorzystujemy w celu:
                    a) Przetwarzania i realizacji zamówień na bilety kinowe. <br>
                    b) Komunikacji z użytkownikami w sprawie zakupionych biletów, zmian w repertuarze kin oraz innych
                    istotnych informacji. <br>
                    c) Zapewnienia wsparcia technicznego i obsługi klienta. <br>
                    d) Analizy statystyk i ulepszania jakości naszych usług. <br>
                    e) Przestrzegania obowiązujących przepisów prawnych. <br>
                </p>
                <p class="neo">
                    3. Udostępnianie danych <br>
                    W ramach świadczenia usług, możemy udostępniać niektóre dane osobowe podmiotom trzecim, takim jak kina
                    partnerskie lub dostawcy płatności. Jednak udostępniane dane są ograniczone do minimum niezbędnego do
                    wykonania tych usług.
                </p>
                <p class="neo">
                    4. Bezpieczeństwo danych <br>
                    Podjęliśmy odpowiednie środki techniczne i organizacyjne, aby chronić dane osobowe przed nieuprawnionym
                    dostępem, utratą, zmianą czy nieautoryzowanym ujawnieniem. Stosujemy standardowe procedury
                    bezpieczeństwa w celu zapewnienia poufności danych.
                </p>
                <p class="neo">
                    5. Pliki cookie <br>
                    Nasza strona internetowa może używać plików cookie w celu ułatwienia nawigacji, personalizacji treści
                    oraz analizy ruchu na stronie. Pliki cookie są bezpieczne dla Twojego urządzenia i nie zawierają żadnych
                    danych osobowych, chyba że wyrazisz na to zgodę.
                </p>
                <p class="neo">
                    6. Prawa użytkowników <br>
                    Użytkownicy mają prawo do dostępu do swoich danych osobowych, poprawiania ich, ograniczania
                    przetwarzania, usunięcia lub przenoszenia danych. W przypadku pytań lub żądań dotyczących danych
                    osobowych, prosimy o kontakt z nami za pomocą informacji podanych na naszej stronie.
                </p>
                <p class="neo">
                    7. Okres przechowywania danych <br>
                    Przechowujemy dane osobowe tylko przez okres niezbędny do realizacji celów, dla których zostały zebrane,
                    chyba że obowiązują nas dłuższe okresy przechowywania wymagane przez prawo.
                </p>
                <p class="neo">
                    8. Zmiany w polityce prywatności <br>
                    Możemy okresowo aktualizować naszą Politykę prywatności. Każda istotna zmiana będzie publikowana na
                    naszej stronie internetowej, a użytkownicy zostaną poinformowani o istotnych zmianach za pomocą środków
                    komunikacji dostępnych na stronie.
                </p>
                <p class="neo">
                    Jeżeli masz jakiekolwiek pytania lub wątpliwości dotyczące naszej Polityki prywatności, prosimy o kontakt z nami za pomocą podanych informacji kontaktowych na stronie.
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
    name: 'Privacy',
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
