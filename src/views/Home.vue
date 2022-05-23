<template>
  <div class="row">
    <div class="col-12 mb-1 row">
      <b-form-group class="col-10">
        <div class="d-flex align-items-end col-12">
          <label class="mr-1 col-2"><h3>Search Warehouse</h3> </label>
          <b-form-input
            v-model="searchTerm"
            placeholder="Search Warehouse"
            type="text"
            class="d-inline-block"
          />
        </div>
      </b-form-group>
      <b-link class="col-2 row" :to="{ name: 'createWarehouse' }">
        <b-button class="col-12" variant="primary">Add New Warehouse</b-button>
      </b-link>
    </div>
    <div
      class="col-4"
      v-for="warehouse in filtredWarehouses"
      :key="warehouse.id"
    >
      <warehouse-capacity-cart
        :warehouse="warehouse"
        :capacity="capacity(warehouse.id)[0]"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable*/
import {
  BCard,
  BCardText,
  BLink,
  BButton,
  BFormGroup,
  BFormInput,
} from "bootstrap-vue";
import WarehouseCapacityCart from "@/views/components/WarehouseCapacityCart.vue";
import { HTTP } from "@/main-source";

export default {
  data() {
    return {
      searchTerm: "",
      filtredWarehouses: null,
      warehouses: null,
      warehouseCapacity: null,
    };
  },
  components: {
    BCard,
    BCardText,
    BLink,
    WarehouseCapacityCart,
    BButton,
    BFormGroup,
    BFormInput,
  },
  created() {
    this.getWarehouse();
    HTTP.get("Warehouse/warehouseCapacity")
      .then((result) => {
        this.warehouseCapacity = result.data;
      })
      .catch((err) => {});
  },
  methods: {
    getWarehouse: function () {
      HTTP.get("Warehouse/getAll")
        .then((result) => {
          this.warehouses = result.data;
          this.filtredWarehouses = result.data;
        })
        .catch((err) => {});
    },
    filterWarehouse: function () {
      this.filtredWarehouses = this.warehouses.filter((e) =>
        this.searchTerm == ""
          ? true
          : e.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    capacity: function (id) {
      return this.warehouseCapacity.filter((e) => e.warehouseId == id);
    },
  },
  watch: {
    searchTerm: function () {
      this.filterWarehouse();
    },
  },
};
</script>

<style>
</style>
