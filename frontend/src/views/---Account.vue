<template>
  <div>
    <v-btn rounded text id="logout" @click="logout()"> log out </v-btn>
    <v-card id="card" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            {{ user.username }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.email }}
            <br />
            id: {{ user.id }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions> </v-card-actions>
    </v-card>

    <v-card id="card" outlined>
      <h3>Publish lesson</h3>
      <form>
        <v-text-field label="Header" hide-details="auto"></v-text-field>
        <v-text-field label="Preview description"></v-text-field>
        <v-textarea color="teal">
          <template v-slot:label>
            <div>Description</div>
          </template>
        </v-textarea>

        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="form.dates"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-combobox
              v-model="form.dates"
              multiple
              chips
              small-chips
              label="Multiple picker in menu"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-combobox>
          </template>
          <v-date-picker v-model="dates" multiple no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(dates)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>

        <v-text-field
          label="Label Text"
          value="12:30:00"
          type="time"
          suffix="UTC -5"
        ></v-text-field>
        <v-text-field label="Amount" value="2.00" prefix="€"></v-text-field>
        <v-btn class="mr-4" @click="submit"> submit </v-btn>
      </form>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: mapActions(["isAuth", "logout"]),
  data() {
    return {
      user: {},
      form: { dates: [] },
    };
  },
  async mounted() {
    if (!(await this.isAuth())) this.$router.push("/signin");
    else this.user = JSON.parse(localStorage.getItem("user"));
  },
};
</script>

<style scoped>
#logout {
  color: var(--v-secondary-base);

  background-color: var(--v-primary-base);
  width: 10%;
  border: 4px solid var(--v-secondary-base);
  padding: 20px;
  margin: 5px;
  margin-left: 90%;
}
#card {
  background-color: var(--v-accent);
  margin: auto;
  margin-top: 5%;
  width: 70%;
  padding: 10px;
}
</style>

