---
sidebar_position: 1
---

### ***Wymagania***:
Aby móc korzystać z systemu FanFlix, należy spełnić następujące wymagania:

1. **Node.js**: Wersja 14.x lub nowsza.
2. **Yarn**: Wersja 1.x lub nowsza.
3. **PostgreSQL**: Wersja 12.x lub nowsza.
4. **Git**: Wersja 2.x lub nowsza.

### ***Instalacja***:
Przed przystąpieniem do instalacji upewnij się, że spełnione są wszystkie wymagania. Następnie postępuj zgodnie z poniższymi krokami:

1. Sklonuj repozytorium projektu:

```bash
git clone -b main --single-branch https://github.com/OlexTix/FanFlix.git main
git clone -b api --single-branch https://github.com/OlexTix/FanFlix.git api
git clone -b docs --single-branch https://github.com/OlexTix/FanFlix.git docs
```

2. Przejdź do folderu z projektem frontend i zainstaluj zależności:

```bash
cd main
npm install
```
3. Przejdź do folderu z projektem backend i zainstaluj zależności:

```bash
cd api
npm install
```

4. Utwórz plik konfiguracyjny .env w folderze backendu, korzystając z pliku przykładowego .env.example. Wypełnij wymagane informacje, takie jak dane dostępowe do bazy danych.

5. Uruchom migracje bazy danych:

```bash
npm run migrate
```
6. Uruchom serwer backendowy:

```bash
npm run start
```
W nowym terminalu, przejdź do folderu frontendu i uruchom aplikację frontendową:

```bash
cd ../main
npm run dev
```

W kolejnym terminalu, przejdź do folderu z dokumentacją i zainstaluj zależności:

```bash
cd ../fanflix-docs
npm install
```
Uruchom serwer dokumentacji:

```bash
npm run docusaurus start
```

Po wykonaniu powyższych kroków, aplikacja frontendowa powinna być dostępna pod adresem http://localhost:3000, API backendowe pod adresem http://localhost:4000, a dokumentacja pod adresem http://localhost:5000.