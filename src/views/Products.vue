<!-- eslint-disable -->
<template>
  <div class="row">
    <div class="col-12 mb-1 row">
      <b-form-group class="col-10">
        <div class="d-flex align-items-end col-12">
          <label class="mr-1 col-2"><h4>Search Product</h4> </label>
          <b-form-input
            v-model="searchTerm"
            placeholder="Search Product"
            type="text"
            class="d-inline-block"
          />
        </div>
      </b-form-group>
      <b-link class="col-2 row" :to="{ name: 'createUser' }">
        <b-button class="col-12" variant="primary">Add New Product</b-button>
      </b-link>
    </div>

    <b-table class="col-12" responsive="sm" :items="filtredItems">
      <template #cell(Role)="data">
        <!-- {{ getRole(data).roleName }} -->
        <!-- <b-badge :variant="status[1][data.value]">
          {{ status[0][data.value] }}
        </b-badge> -->
      </template>
      <template #cell(Birthday)="data">
        <!-- {{ data.item.Birthday.slice(0, 10) }} -->
      </template>
      <template #cell(actions)="data">
        <b-dropdown
          variant="link"
          no-caret
          :right="$store.state.appConfig.isRTL"
        >
          <template #button-content>
            <feather-icon
              icon="MoreVerticalIcon"
              size="16"
              class="align-middle text-body"
            />
          </template>
          <b-dropdown-item>
            <router-link
              :to="{
                name: 'updateProduct',
                params: { id: data.item['Product Id'] },
              }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </router-link>
          </b-dropdown-item>

          <b-dropdown-item @click="deleteProduct(data.item['Product Id'])">
            <feather-icon icon="TrashIcon" />
            <span class="align-middle ml-50">Delete</span>
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
  </div>
</template>

<script>
/* eslint-disable*/
import { HTTP } from "@/main-source";
import Swal from 'sweetalert2'
import {
  BCard,
  BCardHeader,
  BRow,
  BCol,
  BCardText,
  BButton,
  BFormGroup,
  BFormInput,
  BTable,
  BDropdown,
  BDropdownItem,
  BLink,
} from "bootstrap-vue";
export default {
  components: {
    BCard,
    BCardHeader,
    BRow,
    BCardText,
    BCol,
    BButton,
    BFormGroup,
    BFormInput,
    BTable,
    BDropdown,
    BDropdownItem,
    BLink,
  },
  data() {
    return {
      filtredItems: null,
      searchTerm: "",
      items: [],
      roles: null,
    };
  },
  created() {
    this.getAllUser();
    this.getAllRole();
  },
  methods: {
    getAllRole() {
      HTTP.get("Role/getAllRoles")
        .then((result) => {
          this.roles = result.data;
        })
        .catch((err) => {});
    },
    getAllUser() {
      HTTP.get("Product")
        .then((result) => {
          result.data.forEach((element) => {
            this.items.push({
              "Product Id": element.id,
              Code: element.code,
              Name: element.name,
              Description: element.description,
              "Unit Price": element.price,
              Actions: null,
            });
          });
          this.filtredItems = this.items;
        })
        .catch((err) => {});
    },
    deleteProduct(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          HTTP.delete("Product/" + id)
            .then((result) => {
              this.items = this.items.filter((z) => z["Product Id"] != id);
              this.filterProduct();
            })
            .catch((err) => {});
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your file has been deleted.",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else if (result.dismiss === "cancel") {
          Swal.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
      });
    },
    getRole(data) {
      //console.log(data.item["User Id"])
      console.log(this.roles.filter((z) => z.id == data.item.Role));
      return this.roles.filter((z) => z.id == data.item.Role)[0];
    },
    filterProduct: function () {
      // console.log("filter")
      this.filtredItems = this.items.filter((e) =>
        this.searchTerm == ""
          ? true
          : e["Name"].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            e.Description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      // console.log(this.filtredMovies , this.movies)
    },
  },
  watch: {
    searchTerm: function () {
      this.filterProduct();
    },
  },
};
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-sweetalert.scss';
</style>
