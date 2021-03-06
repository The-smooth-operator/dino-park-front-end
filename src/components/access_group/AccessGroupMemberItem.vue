<template>
  <div
    :class="{ 'list-item': true, primary: isCurator, expanded: showExpandable }"
  >
    <article class="list-item__main">
      <RouterLink
        :to="{
          name: 'Profile',
          params: {
            username: member.username,
          },
        }"
        class="member-view"
      >
        <UserPicture
          :avatar="{ picture: member.picture, username: member.username }"
          class="member-view__image"
          :size="40"
          :showLabel="member.isStaff"
        />
        <div class="member-view__info">
          <p class="info-header">{{ member.displayName }}</p>
          <p class="info-sub">
            <Icon v-if="isCurator" id="crown-fill" :width="16" :height="16" />
            {{ member.role }}
          </p>
        </div>
      </RouterLink>
      <button
        :class="{ 'member-action': true, expanded: showExpandable }"
        v-on:click="toggleExpandable"
        :title="fluent('access-group_members', 'member-action')"
      >
        <Icon id="info" :width="24" :height="24" />
      </button>
    </article>
    <aside class="list-item__expandable" v-if="showExpandable">
      <p class="expandable-row" v-if="member.since">
        <span class="expandable-row__label">{{
          fluent('access-group_members', 'member-expandable_member-since')
        }}</span>
        <span class="expandable-row__content">
          {{ member.since }}
        </span>
      </p>
      <p class="expandable-row" v-if="!member.added_by.isAnonymous()">
        <span class="expandable-row__label">{{
          fluent('access-group_members', 'member-expandable_added-by')
        }}</span>
        <RouterLink
          class="expandable-row__content"
          :to="{
            name: 'Profile',
            params: {
              username: member.added_by.username,
            },
          }"
          >{{ member.added_by.displayName }}</RouterLink
        >
      </p>
    </aside>
  </div>
</template>

<script>
import UserPicture from '@/components/ui/UserPicture.vue';
import EditButton from '@/components/ui/EditButton.vue';
import Icon from '@/components/ui/Icon.vue';
import {
  DISPLAY_MEMBER_ROLES,
  MEMBER_IDEX,
} from '@/view_models/AccessGroupViewModel';
import { formatDate, isDateValid } from '@/assets/js/component-utils';

export default {
  name: 'AccessGroupMemberItem',
  components: { UserPicture, EditButton, Icon },
  props: {
    member: Object,
  },
  methods: {
    toggleExpandable() {
      this.showExpandable = !this.showExpandable;
    },
  },
  computed: {
    isCurator() {
      return this.member.role === DISPLAY_MEMBER_ROLES[MEMBER_IDEX.Curator];
    },
  },
  data() {
    return {
      showExpandable: false,
    };
  },
};
</script>

<style scoped>
.list-item {
  width: 100%;
  box-shadow: var(--shadowCard);
  border: none;
  border-radius: var(--cardRadius);
  background: var(--white);
  height: auto;
  max-height: 5.5em;
  display: flex;
  flex-direction: column;
  position: relative;
}

.list-item.expanded {
  max-height: 12em;
}

.list-item .list-item__main {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.list-item__main .member-view {
  display: flex;
  flex: 6;
  text-decoration: none;
  background: transparent;
}

.list-item__main .member-view::before {
  content: '';
  display: block;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background-color 0.2s ease-in-out;
  border: 1px solid transparent;
}

.list-item__main .member-view:hover::before {
  border-color: var(--blue-60);
  background-color: var(--lightBlue);
}

.member-view .member-view__image {
  margin: 1em;
}

.member-view .member-view__info {
  margin-top: 1em;
}
.member-view .member-view__info p {
  margin: 0 0 0.25em 0;
}

.member-view__info .info-header {
  font-weight: bold;
  color: var(--black);
  position: relative;
}

.member-view__info .info-sub {
  margin-top: 0;
  position: relative;
}

.list-item.primary .member-view__info .info-sub {
  color: #006504;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.list-item.primary .member-view__info .info-sub svg {
  margin-right: 0.25em;
}

.list-item__main .member-action {
  width: 3.5em;
  margin: 0.25em 0;
  background: transparent;
  border-left: 2px solid var(--gray-20);
  border-right: none;
  border-top: none;
  border-bottom: none;
  display: block;
  position: relative;
}

.list-item__main .member-action svg {
  width: 1.425em;
  height: 1.425em;
}

.list-item__main .member-action-container:hover .member-action {
  border-left: 2px solid transparent;
}

.list-item__main .member-action:hover svg {
  color: var(--blue-60);
}

.list-item__expandable {
  margin: 0 1em 1em;
  position: relative;
}
.expandable-row {
  display: block;
  width: 100%;
  margin-bottom: 0.5em;
}

.expandable-row:last-child {
  margin-top: 0;
}

.expandable-row__label {
  font-weight: bold;
  color: var(--black);
  margin-right: 0.5em;
}

span.expandable-row__content {
  color: var(--gray-50);
}
</style>
