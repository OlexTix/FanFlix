---
sidebar_position: 2
---

Poniższy diagram ilustruje strukturę bazy danych, w tym tabele, relacje między nimi oraz klucze główne i obce w systemie FanFlix.

<div style={{
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '56.25%',
}}>
  <iframe style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  }} src='https://dbdiagram.io/embed/6440e29a6b31947051e6403f'>
  </iframe>
</div>

W naszym diagramie ERD systemu kinowego skupiamy się na następujących aspektach:

1. <b>Obsługa kin</b>: W bazie danych przechowujemy informacje o kinach, ich adresach oraz salach kinowych. Obejmuje to strukturę taką jak Cinema, Address oraz Cinema_Hall.

2. <b>Zarządzanie filmami</b>: System zawiera informacje o filmach, reżyserach, gatunkach oraz związanych z nimi proiekcjach. Encje takie jak Movie, Director, Genre, Movie_Genre oraz Screening odzwierciedlają te informacje w bazie danych.

3. <b>Użytkownicy i role</b>: W systemie mamy trzy rodzaje użytkowników: klientów, pracowników i administratorów. Encja User przechowuje informacje o użytkownikach, a encje Security_Question oraz User_Security_Answer dotyczą pytań zabezpieczających.

4. <b>Rezerwacja i sprzedaż biletów</b>: Użytkownicy mogą rezerwować i kupować bilety na różne rodzaje projekcji. Encje Ticket, Ticket_Type oraz Reservation odzwierciedlają te informacje.

5. <b>Historia akcji użytkowników</b>: W celu monitorowania działań użytkowników w systemie, wprowadziliśmy encję User_Action_Log, która przechowuje informacje o różnych akcjach, takich jak rezerwacja biletów, płatności czy zarządzanie seansami.

## Opis poszczególnych tabel:

1. Address:

   * ``id_address`` (PK): Unikalny identyfikator dla adresu.
   * ``street``: Nazwa ulicy.
   * ``building_number``: Numer budynku.
   * ``apartment_number`` (opcjonalny): Numer mieszkania.
   * ``postal_code``: Kod pocztowy.
   * ``city``: Nazwa miasta.
   * ``country``: Nazwa kraju.
2. Cinema:

   * ``id_cinema`` (PK): Unikalny identyfikator dla kina.
   * ``name``: Nazwa kina.
   * ``id_address`` (FK): Klucz obcy odnoszący się do tabeli Address.
   * ``phone``: Numer telefonu kina.
3. Cinema_Hall:

   * ``id_cinema_hall`` (PK): Unikalny identyfikator dla sali kinowej.
   * ``id_cinema`` (FK): Klucz obcy odnoszący się do tabeli Cinema.
   * ``hall_number``: Numer sali kinowej.
   * ``number_of_seats``: Liczba miejsc w sali kinowej.
4. Movie:

   * ``id_movie`` (PK): Unikalny identyfikator dla filmu.
   * ``title``: Tytuł filmu.
   * ``id_director`` (FK): Klucz obcy odnoszący się do tabeli Director.
   * ``duration``: Czas trwania filmu w minutach.
   * ``description``: Opis filmu.
   * ``poster_url``: URL plakatu filmu.
   * ``youtube_link``: Link do filmu na YouTube.
   * ``release_date``: Data premiery filmu.
5. Director:

   * ``id_director`` (PK): Unikalny identyfikator dla reżysera.
   * ``first_name``: Imię reżysera.
   * ``last_name``: Nazwisko reżysera.
   * ``nationality`` (opcjonalny): Narodowość reżysera.
6. Genre:

   * ``id_genre`` (PK): Unikalny identyfikator dla gatunku filmu.
   * ``name``: Nazwa gatunku filmu.
7. Movie_Genre:

   * ``id_movie`` (FK): Klucz obcy odnoszący się do tabeli Movie.
   * ``id_genre`` (FK): Klucz obcy odnoszący się do tabeli Genre.
8. Screening:

   * ``id_screening`` (PK): Unikalny identyfikator dla seansu.
   * ``id_movie`` (FK): Klucz obcy odnoszący się do tabeli Movie.
   * ``id_cinema_hall`` (FK): Klucz obcy odnoszący się do tabeli Cinema_Hall.
   * ``id_screening_type`` (FK): Klucz obcy odnoszący się do tabeli Screening_Type.
   * ``date``: Data seansu.
   * ``time``: Godzina seansu.
9. Screening_Type:

   * ``id_screening_type`` (PK): Unikalny identyfikator dla rodzaju seansu.
   * ``language``: Język audio seansu.
   * ``subtitle`` (opcjonalny): Napisy seansu.
10. Ticket:

     * ``id_ticket`` (PK): Unikalny identyfikator dla biletu.
     * ``id_screening`` (FK): Klucz obcy odnoszący się do