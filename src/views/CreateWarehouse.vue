<!--  eslint-disable -->
<template>
  <b-form @submit.prevent>
    <b-row>
      <b-col md="6">
        <b-form-group label="Warehouse Name" label-for="mc-warehouse-name">
          <b-form-input
            id="mc-warehouse-name"
            placeholder="Warehouse Name"
            v-model="form.name"
            required
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Warehouse Code" label-for="mc-warehouse-code">
          <b-form-input
            id="mc-warehouse-code"
            placeholder="Warehouse Code"
            v-model="form.code"
            required
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Capacity" label-for="mc-capacity">
          <cleave
            id="mc-capacity"
            v-model="form.capacity"
            class="form-control"
            :raw="false"
            :options="numberInput"
            placeholder="10,000"
            aria-required="true"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Admin" label-for="mc-admin">
          <div class="form-label-group">
            <v-select
              id="mc-admin"
              v-model="form.adminId"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :options="option"
              aria-required="true"
            />
          </div>
        </b-form-group>
      </b-col>
      <b-col md="12">
        <b-form-group label="Address" label-for="mc-address">
          <b-form-textarea
            id="mc-address"
            placeholder="Address"
            rows="3"
            v-model="form.address"
            required
          />
        </b-form-group>
      </b-col>

      <!-- submit and reset -->
      <b-col>
        <b-button
          v-if="!sameCode && !sameName"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          type="submit"
          variant="primary"
          class="mr-1"
          @click="createWarehouse()"
        >
          Create Warehouse
        </b-button>
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="reset"
          variant="outline-secondary"
        >
          Reset
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
/* eslint-disable*/
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BFormTextarea,
  BCardText,
  BInputGroupPrepend,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import Cleave from "vue-cleave-component";
import vSelect from "vue-select";
import { HTTP } from "@/main-source";
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'


export default {
  data() {
    return {
      sameName: false,
      sameCode: false,
      option: [],
      users: null,
      warehouses: null,
      numberInput: {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
      },
      form: {
        name: "",
        dode: "",
        adminId: null,
        capacity: null,
        address: "",
      },
    };
  },
  created() {
    HTTP.get("Warehouse/getAll")
      .then((result) => {
        console.log(result.data);
        this.warehouses = result.data;
      })
      .catch((err) => {
        console.log(err);
      });
    HTTP.get("User/getAllUser")
      .then((result) => {
        console.log(result.data);
        this.users = result.data;
        result.data.forEach((element) => {
          this.option.push({ id: element.userId, title: element.userName });
        });
        console.log(this.option);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  watch: {
  },
  methods: {
    createWarehouse: function () {
        if (this.form.capacity != null && this.form.adminId != null){
            this.form.adminId = this.form.adminId.id
            this.form.capacity = parseInt(this.form.capacity.replace(/,/g,""))
            HTTP.post("Warehouse/addWarehouse",this.form).then((result) => {
                console.log(result)
            }).catch((err) => {
                console.log(err)
            });
        }
    },
  },
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    BCardText,
    BFormTextarea,
    BInputGroupPrepend,
    Cleave,
    vSelect,
  },
  directives: {
    Ripple,
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>