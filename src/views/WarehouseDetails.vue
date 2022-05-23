<!--  eslint-disable -->
<template>
  <div class="div">
    <warehouse-detail-top-bar
      :warehouse="warehouse[0]"
      :warehouseCapacity="warehouseCapacity"
      :warehouseAdmin="user[0]"
    />
    <b-card v-if="roleId == 1">
      <b-row>
        <b-col offset="4" md="6">
          <b-form-group label="Add Product" label-for="mc-product">
            <div class="form-label-group">
              <v-select
                id="mc-product"
                v-model="selectedProduct"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="title"
                :options="productsOption"
                aria-required="true"
              />
            </div>
          </b-form-group> </b-col
        ><b-col md="2">
          <b-button class="mt-1" variant="primary" @click="addNewProduct()"
            >Add New Product</b-button
          >
        </b-col>
      </b-row>
    </b-card>
    <b-card>
      <b-table responsive="sm" :items="items" />
    </b-card>
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
  BTable,
  BCard,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import Cleave from "vue-cleave-component";
import vSelect from "vue-select";
import { HTTP } from "@/main-source";
import warehouseDetailTopBar from "@/views/components/WarehouseDetailsTopBar.vue";

export default {
  data() {
    return {
      roleId: JSON.parse(localStorage.getItem("userData")).roleId,
      selectedProduct: null,
      products: null,
      productsOption: [],
      items: null,
      warehouseAdmin: null,
      warehouseCapacity: null,
      currentId: this.$route.params.id,
      warehouse: null,
      option: [],
      user: null,
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
  async created() {
    this.getWarehouseDetails();
    HTTP.get("Warehouse/warehouseCapacity")
      .then((result) => {
        this.warehouseCapacity = result.data.filter(
          (z) => z.warehouseId == this.currentId
        )[0];
      })
      .catch((err) => {});
    await HTTP.get("Warehouse/getWarehouseById/" + this.currentId).then(
      (result) => {
        this.warehouse = result.data;
        HTTP.get("User/getUser/" + result.data[0].adminId)
          .then((result) => {
            this.user = result.data;
          })
          .catch((err) => {});
      }
    );
  },
  watch: {},
  methods: {
    getWarehouseDetails: function () {
      HTTP.get("Warehouse/warehouseProductsDetail/" + this.currentId)
        .then((result) => {
          this.items = result.data;
          HTTP.get("Product").then((product) => {
            let productsId = [];
            result.data.forEach((element) => {
              productsId.push(element.productId);
            });
            this.products = product.data.forEach((e) => {
              if (!productsId.includes(e.id)) {
                this.productsOption.push({ id: e.id, title: e.name });
              }
            });
          });
        })
        .catch((err) => {});
    },
    addNewProduct: function () {
      HTTP.post("WarehouseProduct", {
        productId: this.selectedProduct.id,
        warehouseId: this.currentId,
        quantity: 0,
      })
        .then((result) => {
          this.productsOption = [];
          this.selectedProduct = null;
          this.getWarehouseDetails();
        })
        .catch((err) => {});
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
    warehouseDetailTopBar,
    BTable,
    BCard,
  },
  directives: {
    Ripple,
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>