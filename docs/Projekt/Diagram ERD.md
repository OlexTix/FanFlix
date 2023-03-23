---
sidebar_position: 2
---

Poniższy diagram ERD przedstawia system FanFlix. System składa się z kilku modułów, które pozwalają na zarządzanie użytkownikami, filmami, kinami i salami kinowymi oraz rezerwacją biletów. Każdy z tych modułów posiada oddzielny diagram ERD, a ten diagram podsumowuje relacje między nimi.

<div style={{textAlign: 'center'}}>

!["Diagram ERD"](http://www.plantuml.com/plantuml/dsvg/dPCxQ-j048Nx_HLxNTrRgBW1Dy4OGo1DI9D7BIQxasZmFiJio8wnyzyZBOeHaeqWZHvdXZEVpeusIO2byKxzaGezwhH5CTL1OH2IWrwy9kIqq4UboEfRJK7qQlM10Ha4xNgjYaAX1t9jSGTiAk2_DylbFrL3Ill8Tgo_4oSf0tWSLnnSANoTQPwYmpcQImuMas6gXMAuRluOTpJhBYHknbxmKvHj6F9xzb6C3Y5XQK6mbRhROF8T1VJmcmy3QnbJceHVnO1bQFmRyg3sVnHcz7CpJIOh1mtt3stb4eg16andd3i7Svwhk1Voiz7wBl_9A6uf9sBUsh8pxSFi7XK6Ez5g9fC5DEJ13R1Uo6nHvg1I3pz1Q1BoPLYE-r4sMJyVHnzF_hFqwLGKHzsp3BJJKUTbLtahV_hEKQf-PNez7wNArqcdsc2mZNVV)

</div>

### Diagram modułu zarządzania użytkownikami

<div style={{textAlign: 'center'}}>

!["Diagram modułu zarządzania użytkownikami"](http://www.plantuml.com/plantuml/dsvg/jP4nImD148Nx-HLZgWXU8wIH45BPf0c2THXkHszmT--OcIWXyRzxAn9ryR1ATxpltNmFTcrEwliKuSexJepsmjvs1m3EBdx0sQEnsWoF01Bm3YKxBfVFd5d9EQnMq3J0YIIEy9MqxKZdjul5DGnazjPhgFCdKVDTfiGrYJG1tizh7lh8_wtvwq9WQrK6bpvF7z-o9Z4REnTJbFsxsgCb_26xtuoMuLogKHcmtSo__hh1NyqY-tmoF9sQveYr44em2R-_9okmvXpsANu0)

</div>

Ten diagram ERD przedstawia zależności między trzema encjami: użytkownikami (Users), rolami (Roles) oraz uprawnieniami (Permissions). Encja Users zawiera informacje o użytkownikach, takie jak adres e-mail, hasło i imię oraz nazwisko. Encja Roles reprezentuje role, które użytkownicy mogą pełnić w systemie, takie jak "administrator" lub "użytkownik". Encja Permissions zawiera informacje o uprawnieniach, które mogą być przypisane do ról, takie jak "dodawanie nowych użytkowników" lub "edytowanie informacji o użytkownikach". W celu połączenia ról z uprawnieniami, w diagramie znajduje się również encja pośrednicząca Role_Permissions, która ma klucze obce do tabel Roles i Permissions, umożliwiając przypisywanie uprawnień do ról.

### Diagram modułu zarządzania filmami

<div style={{textAlign: 'center'}}>

!["Diagram modułu zarządzania filmami"](http://www.plantuml.com/plantuml/dsvg/jPB1IiGm48RlynHnJtheHTYBBCiMH0_YCvIX6MqmIMKoNLnsVNUpPYc1HYA2fsdxpTyF_cGN15acP-5A1dAamXj9Fno0l1WvgDNpk3SKLke8OBIwKyQBscnUoHEZaDvkeMaWhbgAS8_S3yZNj-lr3MWAFPjtCQEFIEX3G4-CbtVZ1PWiOQ1EevpJvm6Vi_cHF5VD7br5dAFix_U6gPUHQu8Nmq6waiPY1igIzhyDwNYwNrNblbSp_l0KGLpYnTU5eD9MnQ4lwQgc_Ri3Vn2a-wjEfwOvghmjIAD0Ifcv09YVYhmORXD9eqHsvFNax1S0)

</div>

W tym module encja "Movies" reprezentuje filmy, a kolejno encje "Genres", "Directors" i "Actors" odpowiadają za gatunki, reżyserów i aktorów. Aby zamodelować relacje między tymi encjami, wykorzystano trzy dodatkowe encje pośredniczące: "Movie_Genres", "Movie_Directors" i "Movie_Actors".

### Diagram modułu zarządzania kinami i salami kinowymi

<div style={{textAlign: 'center'}}>

!["Diagram modułu zarządzania filmami"](http://www.plantuml.com/plantuml/dsvg/bP31IWCn443l-Ogn9nLoKEX5IYa88dZp1yAOZ2QOJ4eoAvJMVpUEXUv1eLxsC6-MzoQRBjXaAjbSIAH2qDz9VDmPGon9Th2uJqm5-mBs1k0QKe0xI2omMhqHKqEXi5uFPArona9ZumERZzWkRvVBAvrZ28rw_mrjOsLoF9KNQZD-C_3dgUEvrd9sXTTeDrjxU5B-Tw37BVfla_unDpzYpcURsyZyb_VdRbTVNIUKVj8V7nuE1slteESR_HudccNCXZXC9Ny1)

</div>

W tym module mamy dwie encje - Cinemas (kina) i Rooms (sale kinowe), które są połączone relacją jeden-do-wielu (jedno kino może mieć wiele sal kinowych). Dodatkowo, Rooms są połączone z encją Halls (sale), również relacją jeden-do-wielu (jedna sala kinowa może mieć wiele sal).

### Diagram modułu rezerwacji biletów

<div style={{textAlign: 'center'}}>

!["Diagram modułu zarządzania filmami"](http://www.plantuml.com/plantuml/dsvg/ZPCzQyCm48Pt_merKrlmq4AM4aoWqALqwSTihjAr5jM7ESb9GzB_NkMS64Day6BC-qYwnxhpEaIWs5bJNCK6BOhmWr4skm9Tr74d5Xy1AIp4lX3YLcWb7eHsKQnMt-YG8AAggeJAaZbQq2OjsG391kZwVhcyOT1225jFAiU-D8LOEx2OemOcu5ynEBvhcQndMuR6RwEsM8yMFZrN5SCk86K1UMzhyjkS93FNsK-aVkFOxkrKRhQVzHkDqmuvm5siZrKIKn3n-Ce4dShcBMd98KfjmOo5NrBz-RPfZybsJc6GfDkelKiuuc_iuuw0CpwL8qA34B1EWcVFiSzh-khPEb8xj92zfAaHaz22J9KkM_V8XyskFLK0b28C8OVQnZiSHcVWT_s0yyyd3eUot8lJa1VSdNCup5RHgvvplhA2dnShr-XKPyq_)

</div>

Ten moduł korzysta z encji Users, Tickets, Showtimes, Movies, Rooms i Cinemas. Tickets przechowuje informacje o biletach, które są rezerwowane przez użytkowników (Users) na konkretne seanse (Showtimes). Showtimes z kolei odwołuje się do konkretnego filmu (Movies) oraz konkretnej sali kinowej (Rooms) w konkretnym kinie (Cinemas).