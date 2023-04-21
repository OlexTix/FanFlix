<template>
    <div id="movie-section" class="flex justify-content-center">
        <h1 style="font-weight: 500;">JOHN WICK: CHAPTER 4</h1>
        <div id="trailer-iframe">
            <iframe width="700" height="300" src="https://www.youtube.com/embed/jFsWkFnZfXk"
                title="JOHN WICK: Chapter 4 Polski Zwiastun 2023 Napisy PL" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
        </div>
        <div id="movie-releasebox">
            
                <div id="box1"><img id="img1" class="logo" src="https://www.svgrepo.com/show/490607/calendar-event.svg" width="30px"
                        style="padding: 3px">
                    <p style="margin-right: 2vh;">Data premiery: 24 marca 2023</p>
                    <img id="img2" class="logo" src="https://www.svgrepo.com/show/513817/clock.svg" width="30px" style="padding: 3px">
                    <p>Czas trwania: 99 minut</p>
                </div>
              
           
        </div>
        <div id="moviepreviewbox">
            <p id="movie-description">
                Keanu Reeves powraca, by stanąć do decydującej walki z błyskotliwym i bezlitosnym Billem Skarsgardem, który
                pokazał już swoje mroczne oblicze w przerażającym „TO”. O wolność na ubitej ziemi Nowego Jorku, Paryża,
                Tokio i Berlina. Ceny idą w górę, więc także stawka za głowę legendarnego zabójcy, Johna Wicka przebiła już
                sufit. Stając do ostatecznego pojedynku, który może dać mu upragnioną wolność i zasłużoną emeryturę, John
                wie, że może liczyć tylko na siebie. Dla niego, to nic nowego. To co zmieniło się tym razem, to fakt, że
                przeciwko sobie ma całą międzynarodową organizację najlepszych płatnych zabójców, a jej nowy szef Markiz de
                Gramond jest równie wyrafinowany, co bezlitosny. Zanim John stanie z nim oko w oko, będzie musiał odwiedzić
                kilka kontynentów mierząc się z całą plejadą twardzieli, którzy wiedzą wszystko o zabijaniu. Tuż przed
                wielkim finałem tej morderczej symfonii, John Wick trafi na trop swojej dalekiej rodziny, której członkowie
                mogą mieć decydujący wpływ na wynik całej rozgrywki.
            </p>
            <img src="https://cdn.gracza.pl/galeria/mdb/f/3448000.jpg">
        </div>
    </div>
</template>

<script>

</script>

<style>
#movie-section {
    margin: 2vh;
}

#trailer-iframe {
    clear: both;
    margin: 2vh;
    text-align: center;

}

#moviepreviewbox {
    display: flex;
    margin-top: 5vh;
    margin-left: 10vh;
    margin-right: 10vh;
    
}

#movie-releasebox {
   text-align: center;
    padding: 1rem;
    margin-left: 10rem;
    margin-right: 10rem;

}

#box1 {
    display: flex;
    width:300px;
    margin-left: auto;
    margin-right: auto;
    
}

#img1, #img2
{
    filter: var(--color-logo);
  -webkit-filter:  var(--color-logo);
}




</style>