<!--  eslint-disable -->
<template>
  <div class="">
    <validation-observer ref="loginValidation">
      <b-form class="auth-login-form mt-2" @submit.prevent>
        <!-- email -->
        <b-row>
          <b-col md="6">
            <b-form-group label="Warehouse" label-for="mc-warehouse">
              <div class="form-label-group">
                <v-select
                  id="mc-warehouse"
                  v-model="selectedWarehouse"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="warehouseOptions"
                  aria-required="true"
                />
              </div>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Product" label-for="mc-products">
              <div class="form-label-group">
                <v-select
                  id="mc-products"
                  v-model="selectedProduct"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="productOptions"
                  aria-required="true"
                />
              </div>
            </b-form-group>
          </b-col>
          <b-col md="6" v-if="roleId == 1">
            <b-form-group label="Order Type" label-for="mc-type">
              <div class="form-label-group">
                <v-select
                  id="mc-type"
                  v-model="selectedType"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="typeOption"
                  aria-required="true"
                />
              </div>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Quantity" label-for="mc-quantity">
              <cleave
                id="mc-quantity"
                v-model="quantityHolder"
                class="form-control"
                :raw="false"
                :options="numberInput"
                placeholder="10,000"
                aria-required="true"
              />
            </b-form-group>
          </b-col>

          <!-- Create buttons -->
          <b-button
            type="submit"
            variant="primary"
            block
            @click="validationForm"
          >
            Create Order
          </b-button>
        </b-row>
      </b-form>
    </validation-observer>
    <vue-html2pdf
      v-show="false"
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="800px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <!-- PDF Content Here -->
        <div class="">
          <h4>Tutar {{ form.quantity }}</h4>
        </div>
      </section>
    </vue-html2pdf>
  </div>
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
  BFormDatepicker,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import Cleave from "vue-cleave-component";
import vSelect from "vue-select";
import { HTTP } from "@/main-source";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import VueHtml2pdf from "vue-html2pdf";

export default {
  mixins: [togglePasswordVisibility],
  data() {
    return {
      roleId: JSON.parse(localStorage.getItem("userData")).roleId,
      typeOption: [
        { id: 1, title: "Buy" },
        { id: 2, title: "Sell" },
      ],
      selectedType:
        JSON.parse(localStorage.getItem("userData")).roleId == 3
          ? { id: 1, title: "Buy" }
          : { id: 2, title: "Sell" },
      roles: [],
      selectedWarehouse: null,
      warehouses: null,
      warehouseOptions: [],
      selectedProduct: null,
      products: null,
      productOptions: [],
      option: [],
      users: null,
      quantityHolder: null,
      warehouses: null,
      numberInput: {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
      },
      form: {
        userId: JSON.parse(localStorage.getItem("userData")).userId,
        warehouseId: null,
        productId: null,
        quantity: 0,
        type: false,
      },
    };
  },
  created() {
    HTTP.get("Warehouse/getAll")
      .then((result) => {
        this.warehouses = result.data;
        result.data.forEach((e) =>
          this.warehouseOptions.push({ id: e.id, title: e.name })
        );
      })
      .catch((err) => {});
  },
  watch: {
    selectedWarehouse: function () {
      this.getProducts();
    },
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
  methods: {
    getProducts() {
      HTTP.get("Product/getProductsByWarehouse/" + this.selectedWarehouse.id)
        .then((result) => {
          this.products = result.data;
          this.productOptions = [];
          result.data.forEach((e) =>
            this.productOptions.push({ id: e.id, title: e.name })
          );
        })
        .catch((err) => {});
    },
    validationForm() {
      this.$refs.loginValidation.validate().then((success) => {
        if (
          success &&
          this.selectedProduct != null &&
          this.selectedWarehouse != null &&
          this.form.quantity != null &&
          this.form.day != "" &&
          this.selectedType != null
        ) {
          this.form.quantity = parseInt(this.quantityHolder.replace(/,/g, ""));
          this.form.type = this.selectedType.id == 1 ? true : false;
          this.form.warehouseId = this.selectedWarehouse.id;
          this.form.productId = this.selectedProduct.id;

          HTTP.post("OrderProduct/addProduct", this.form)
            .then((result) => {
              if (result.status == 200) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: "Order Created",
                    icon: "Success",
                    variant: "success",
                  },
                });
                this.$refs.html2Pdf.generatePdf();
                this.form = {
                  userName: "",
                  userSurname: "",
                  email: "",
                  password: "",
                  birthDate: "",
                  roleId: null,
                };
              } else if (result.status == 500) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: "The order could not be created.",
                    icon: "warning",
                    variant: "warning",
                  },
                });
                this.quantityHolder = 0;
              }
            })
            .catch((err) => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "The order could not be created.",
                  icon: "warning",
                  variant: "warning",
                },
              });
              this.quantityHolder = 0;
            });
        }
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
    ValidationProvider,
    ValidationObserver,
    BFormDatepicker,
    VueHtml2pdf,
  },
  directives: {
    Ripple,
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>