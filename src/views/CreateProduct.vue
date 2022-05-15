<!--  eslint-disable -->
<template>
  <b-form @submit.prevent>
    <b-row>
      <b-col md="6">
        <b-form-group label="Product Name" label-for="mc-product-name">
          <b-form-input
            id="mc-product-name"
            placeholder="Product Name"
            v-model="form.name"
            required
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Product Code" label-for="mc-product-code">
          <b-form-input
            id="mc-product-code"
            placeholder="Product Code"
            v-model="form.code"
            required
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Unit Price" label-for="mc-price">
          <cleave
            id="mc-capacity"
            v-model="form.price"
            class="form-control"
            :raw="false"
            :options="numberInput"
            placeholder="10,000"
            aria-required="true"
          />
        </b-form-group>
      </b-col>
      <b-col md="12">
        <b-form-group label="Description" label-for="mc-description">
          <b-form-textarea
            id="mc-description"
            placeholder="Description"
            rows="3"
            v-model="form.description"
            required
          />
        </b-form-group>
      </b-col>

      <!-- submit and reset -->
      <b-col>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          type="submit"
          variant="primary"
          class="mr-1"
          @click="createProduct()"
        >
          Create Product
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
      products: null,
      numberInput: {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
      },
      form: {
        name: "",
        code: "",
        description: null,
        price: null,
      },
    };
  },
  created() {},
  watch: {},
  methods: {
    createProduct: function () {
      this.form.price = parseInt(this.form.price.replace(/,/g, ""));
      HTTP.post("product/addProduct", this.form)
        .then((result) => {
          console.log(result);
          if (result.status == 200) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: "Product Created",
                icon: "Success",
                variant: "success",
              },
            });
            this.form = {
              name: "",
              code: "",
              description: null,
              price: null,
            };
          }
        })
        .catch((err) => {
          console.log(err);
        });
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