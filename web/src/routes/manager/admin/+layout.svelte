<div class="top">
  <nav>
    <a href="/manager">^ manager</a>
    <div>ADMIN</div>
  </nav>
  <div><slot /></div>
</div>

<style>
  .top {
    display: grid;
    grid-template-columns: 10rem 1fr;
  }
</style>
