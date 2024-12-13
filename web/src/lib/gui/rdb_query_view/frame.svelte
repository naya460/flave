<div class="frame">
  <div>
    <slot name="heading" />
  </div>
  <div>
    <slot name="contents" />
  </div>
</div>

<style>
  .frame {
    display: grid;
    grid-template-rows: 2rem auto;
    box-shadow: 0px 0px 2px 0px #888888;
    margin: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #f8f8f8;
  }

  .frame > :first-child {
    font-size: 1.2rem;
  }

  .frame > :nth-child(2) {
    background-color: #ffffff;
    min-height: 2rem;
    border-radius: 0.5rem;
    padding: 0.5rem;
    overflow-x: hidden;
  }
</style>
