<template>
  <div id="app" :class="['app-container', containerCSS]">
    <Banner v-if="showBanner" @close="showBanner = false" ref="banner" />
    <TopBar></TopBar>
    <GlobalNotifications class="container" />
    <RouterView class="container" />
    <Footer></Footer>
    <OnboardingModal v-if="showOnboarding"></OnboardingModal>
    <TourTooltip v-if="showTooltipTour" />
  </div>
</template>

<script>
import Banner from '@/components/ui/Banner.vue';
import TopBar from '@/components/ui/TopBar.vue';
import Footer from '@/components/ui/Footer.vue';
import GlobalNotifications from '@/components/ui/GlobalNotifications.vue';

export default {
  name: 'PageHome',
  components: {
    Banner,
    TopBar,
    Footer,
    GlobalNotifications,
    OnboardingModal: () => import('@/components/guide/OnboardingModal.vue'),
    TourTooltip: () => import('@/components/guide/TourTooltip.vue'),
  },
  computed: {
    containerCSS() {
      return `${this.$route.meta.key}-container`;
    },
    showOnboarding() {
      return this.$store.state.onboarding.modal;
    },
    showTooltipTour() {
      return this.$store.state.onboarding.tooltipTour;
    },
  },
  methods: {
    awaitTabbing() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('focus-styles');
        }
      });
    },
  },
  mounted() {
    this.awaitTabbing();
  },
  data() {
    return {
      showBanner: false,
    };
  },
};
</script>

<style>
:root {
  --gray-10: #f9f9fa;
  --gray-20: #ededf0;
  --gray-30: #d7d7db;
  --gray-40: #b1b1b3;
  --gray-50: #737373;
  --gray-60: #4a4a4f;
  --blue-60: #0060df;
  --green-80: #006504;
  --white: #fff;
  --black: #000;
  --light-red: #f5d8e1;
  --neon-red: #ff0039;

  --lightBlue: #f2fcfd;
  --darkBlue: #073072;
  --transparentBlue: rgba(69, 161, 255, 0.54);
  --transparentWhite: rgba(255, 255, 255, 0.54);

  --layerOne: 1;
  --layerTwo: 2;
  --layerThree: 3;
  --layerProfileNav: 4;
  --layerContactMe: 5;
  --layerAboveNav: 6;
  --layerUnderPopover: 7;
  --layerPopover: 8;
  --layerTopBar: 9;
  --layerUserMenu: 10;
  --layerModal: 11;

  --shadowCard: 0 0.25em 0.25em 0 rgba(210, 210, 210, 0.5);
  --focusOutlineShadow: 0px 0 0 1px var(--blue-60),
    0 0 0 3px var(--transparentBlue);

  --imageRadius: 0.25em;
  --formElementRadius: 0.25em;
  --keyRadius: 0.25em;
  --cardRadius: 0.125em;
}

* {
  box-sizing: border-box;
}

html {
  overflow-y: scroll;
}

body {
  background: var(--gray-20);
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  font-size: 87.5%;
  letter-spacing: 0.04em;
  height: 100vh;
  height: -webkit-fill-available;
  min-height: 50em;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
}

h1 {
  font-family: 'Zilla Slab', sans-serif;
  font-weight: 400;
  font-size: 2.5em;
}
@media (min-width: 57.5em) {
  h1 {
    font-size: 3.5em;
  }
}

h2 {
  font-weight: 400;
  font-size: 1.5em;
  margin-bottom: 0.5em;
}

h3 {
  font-weight: 700;
  font-size: 1em;
  color: var(--black);
}

h4,
h5 {
  font-size: 1em;
}

img,
pre,
audio,
video,
section {
  max-width: 100%;
  overflow: auto;
}

hr {
  border: 0;
  height: 1px;
  background-color: var(--gray-30);
  margin: 2em 0;
}

a {
  color: var(--blue-60);
}
a:hover {
  color: var(--black);
}

button {
  cursor: pointer; /* as per issue #50 :'( */
}

abbr {
  text-decoration: none;
}

.container {
  margin-top: 2em;
  padding: 0 1em;
  width: 100%;
}

@media (min-width: 57.5em) {
  .container {
    margin: 2em auto 0 auto;
    max-width: 74em;
  }
}

.app-container {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
.app-container > .container {
  flex: 1;
}

.app-container > .container.global-notifications-container {
  flex: 0;
}

.visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
}

/* best only use these classes on their own, and use a
   wrapping container to not interfere with an element's
   existing display value */
@media not screen and (min-width: 57.5em) {
  .hide-mobile {
    display: none;
  }
}
@media (min-width: 57.5em) {
  .hide-desktop {
    display: none;
  }
}

:focus {
  outline: 1px solid transparent;
}
::-moz-focus-inner {
  border: 0;
}
.focus-styles :focus {
  outline: 1px solid transparent;
  box-shadow: var(--focusOutlineShadow);
}
.focus-styles ::-moz-focus-inner {
  border: 0;
}
.focus-styles :focus:not(:focus-visible) /* don't show focus if element didn't gain focus by means of keyboard  */ {
  box-shadow: none;
}

[tabindex='-1']:focus,
.focus-styles [tabindex='-1']:focus {
  outline: none; /* if tabindex is -1, focus was
    set programmatically to something that is usually
    not focused (ie not an interactive element), in
    order to improve reading order in widgets; no
    outline seems sensible as it usually concerns
    large elements that people would not expect to
    have focus. */
  box-shadow: none;
}

.focus {
  font-weight: bold;
}

.actions ul {
  display: grid;
  grid-gap: 1em;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 0;
  margin: 0;
}
.actions li {
  list-style: none;
}
.actions button {
  display: block;
  width: 100%;
}
</style>
