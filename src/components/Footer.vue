<template>
    <footer>
      <div class="footer-columns">
        <div class="fan-footer">
            <img src="/images/nfanflix3.svg" alt="Vue logo" class="logo-footer"><br>
            <span class="left-text-footer">System Zarządzania Kinami</span>
        </div>
        <div class="fan-footer">
            <span class="center-text-footer">
                <h3>Informacje</h3>
                <ul>
                    <li><a href="/regulations">Regulamin</a></li>
                    <li><a href="/privacy-policy">Polityka prywatności</a></li>
                    <li><a href="/questions">Pytania FAQ</a></li>
                </ul>
            </span>
        </div>
        <div class="fan-footer">
            <span class="right-text-footer">Fantastic Studio</span>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="icons-footer">
            <a href="#"><fa-icon icon="fa-solid fa-film" /></a>  
            <a href="/questions"><fa-icon icon="fa-solid fa-comments" /></a>
            <a href="#"><fa-icon icon="fa-solid fa-hand-holding-heart" /></a>  
        </div>
        <span class="copyright-footer">&copy; {{currentYear}} Fanflix. Wszelkie prawa zastrzeżone.</span>
      </div>    
    </footer>
</template>

<script>
 export default {
    data() {
      return {
        currentYear: new Date().getFullYear(),
      }
    }
 }
</script>

<style>
footer {
  background-color: var(--color-background-foo);
  grid-column: 1 / -1;
  margin-top: auto;
  border-top: 0.15rem solid #5F5F5F;
}
.footer-columns {
  display: flex;
  flex-wrap: wrap;
}
.fan-footer {
  flex: 1;
  padding: 1.8rem 2.2rem 1.8rem 2.2rem;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  font-size: 0.92rem;
}
.logo-footer {
  height: 2.8rem;
}
.left-text-footer {
  padding-left: 0.12rem;
}
.footer-bottom {
  text-align: center;
  padding: 10px 0;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  border-top: 0.2rem solid #5F5F5F;
}
.center-text-footer {
  color: var(--color-heading);
}
.center-text-footer ul {
  list-style: none;
  padding: 0;
}
.center-text-footer ul a {
  color: var(--color-text);
}
.center-text-footer ul a:hover {
  filter: brightness(1.7);
}
.icons-footer {
  margin: 1.3rem 0;
}
.icons-footer a {
  color: var(--color-heading);
}
.icons-footer .svg-inline--fa {
  margin: 0 1rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 0.15rem solid;
  border-color: var(--color-text);
  padding: 0.55rem;
}

</style>