<template>
  <section class="x-list x-padding--07 x-list--gap-05">
    <div>
      <h1 class="row1">WAI-ARIA compliance - test pages</h1>
      <ul class="menu">
        <li>
          <router-link to="/accessibility-check/wai-base-event-button">
            Base Event Button
          </router-link>
        </li>
        <li>
          <router-link to="/accessibility-check/wai-base-dropdown-and-base-switch">
            Base Dropdown and Base Switch
          </router-link>
        </li>
      </ul>
      <router-view />
    </div>
  </section>
</template>
