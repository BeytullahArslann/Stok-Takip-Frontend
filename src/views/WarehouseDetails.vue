<!--  eslint-disable -->
<template>
  <div class="div">
    <warehouse-detail-top-bar :warehouse="warehouse[0]" :warehouseCapacity="warehouseCapacity" :warehouseAdmin="user[0]"/>
    <b-table responsive="sm" :items="items"/>
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
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import Cleave from "vue-cleave-component";
import vSelect from "vue-select";
import { HTTP } from "@/main-source";
import warehouseDetailTopBar from '@/views/components/WarehouseDetailsTopBar.vue'

export default {
  data() {
    return {
      items: null,
      warehouseAdmin: null,
      warehouseCapacity: null,
      currentId : this.$route.params.id,
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
    
    HTTP.get("Warehouse/warehouseProductsDetail/"+this.currentId)
      .then((result) => {
        this.items = result.data
        console.log(this.items)
      })
      .catch((err) => {
        console.log(err);
      });
    HTTP.get("Warehouse/warehouseCapacity")
      .then((result) => {
        console.log(result);
        this.warehouseCapacity = result.data.filter(z => z.warehouseId == this.currentId)[0];
      })
      .catch((err) => {
        console.log(err);
      });
    await HTTP.get("Warehouse/getWarehouseById/"+this.currentId)
      .then((result) => {
        console.log(result.data);
        this.warehouse = result.data;
        HTTP.get("User/getUser/" + result.data[0].adminId)
      .then((result) => {
        console.log(result.data);
        this.user = result.data;
      })
      .catch((err) => {
        console.log(err);
      });
      });
    
  },
  watch: {
  },
  methods: {

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
    BTable
  },
  directives: {
    Ripple,
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>