<template>
    <main>
        <Navbar />
        <BaseTemplate>
            <div>
                <h3 class="mainRegulation">Regulamin użytkowania strony FanFlix</h3>
                <p class="neo">
                    1. Przedmiot regulaminu <br>
                    Niniejszy regulamin określa zasady korzystania z serwisu internetowego zajmującego się sprzedażą biletów
                    kinowych.
                </p>
                <p class="neo">
                    2. Akceptacja regulaminu <br>
                    Korzystając z naszej strony www oraz dokonując zakupu biletów, akceptujesz niniejszy regulamin w
                    całości.
                </p>
                <p class="neo">
                    3. Rejestracja użytkownika <br>
                    Aby dokonać zakupu biletów, wymagana jest rejestracja konta użytkownika. Wszystkie podane dane powinny
                    być prawdziwe i aktualne.
                </p>
                <p class="neo">
                    4. Zakup biletów <br>
                    Serwis umożliwia zakup biletów kinowych online. Po dokonaniu wyboru seansu, należy podać niezbędne dane
                    oraz dokonać płatności.
                </p>
                <p class="neo">
                    5. Ceny biletów <br>
                    Ceny biletów są widoczne na stronie w momencie dokonywania zakupu i mogą być zmieniane bez
                    wcześniejszego powiadomienia.
                </p>
                <p class="neo">
                    6. Potwierdzenie zakupu <br>
                    Po złożeniu zamówienia otrzymasz potwierdzenie na podany adres e-mail. Potwierdzenie stanowi podstawę do
                    odbioru biletów w kinie.
                </p>
                <p class="neo">
                    7. Zwroty i reklamacje <br>
                    Zwroty biletów oraz reklamacje są możliwe tylko w przypadku anulowania lub zmiany seansu przez kina.
                    Szczegółowe informacje dostępne są na stronie.
                </p>
                <p class="neo">
                    8. Ochrona danych osobowych <br>
                    Przechowujemy i przetwarzamy Twoje dane osobowe zgodnie z obowiązującymi przepisami dotyczącymi ochrony
                    prywatności. Więcej informacji znajdziesz w naszej polityce prywatności.
                </p>
                <p class="neo">
                    9. Ograniczenia odpowiedzialności <br>
                    Strona www sprzedająca bilety kinowe nie ponosi odpowiedzialności za jakiekolwiek szkody, utraty lub
                    problemy wynikające z korzystania z serwisu, w tym błędów technicznych, przerw w dostępności strony,
                    opóźnień w przetwarzaniu płatności, nieprawidłowości w wydruku biletów czy zmian w repertuarze kin.
                    Użytkownik korzysta z serwisu na własne ryzyko.
                </p>
                <p class="neo">
                    10. Zabronione działania użytkowników <br>
                    a) Użytkownicy zobowiązują się do niepodejmowania żadnych działań, które mogą naruszać bezpieczeństwo,
                    stabilność lub integralność serwisu sprzedaży biletów kinowych. <br>
                    b) Zabrania się korzystania z serwisu w celach nielegalnych, obraźliwych, szkalujących, oszukańczych lub
                    naruszających prawa innych osób. <br>
                    c) Użytkownicy nie mają prawa dokonywania jakiejkolwiek próby nieautoryzowanego dostępu do danych,
                    systemów czy kont innych użytkowników. <br>
                    d) Zabrania się wykorzystywania automatycznych skryptów, robotów czy innych narzędzi mających na celu
                    manipulację działaniem serwisu lub tworzenie obciążenia na serwerze. <br>
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
}</style>
