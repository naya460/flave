<div class="top">
  <nav>
    <a href="/manager">^ manager</a>
    <div>ADMIN</div>
    <a href="/manager/admin/users">users</a><br />
    <a href="/manager/admin/sessions">sessions</a>
  </nav>
  <div><slot /></div>
</div>

<style>
  .top {
    display: grid;
    grid-template-columns: 10rem 1fr;
  }
</style>
