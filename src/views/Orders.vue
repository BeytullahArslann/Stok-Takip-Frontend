<!-- eslint-disable -->
<template>
  <div class="row">
    <div class="col-12 mb-1 row">
      <b-form-group class="col-10">
        <div class="d-flex align-items-end col-12">
          <label class="mr-1 col-2"><h4>SEARCH ORDER</h4> </label>
          <b-form-input
            v-model="searchTerm"
            placeholder="First Name / Surname"
            type="text"
            class="d-inline-block"
          />
        </div>
      </b-form-group>
      <b-link class="col-2 row" :to="{ name: 'createOrder' }">
        <b-button class="col-12" variant="primary">Add New Order</b-button>
      </b-link>
    </div>

    <b-table class="col-12" responsive="sm" :items="filtredItems">
      <!-- <template #cell(Birthday)="data">
        {{ data.item.Birthday.slice(0, 10) }}
      </template> -->
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
                name: 'updateUser',
                params: { id: data.item['User Id'] },
              }"
            >
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </router-link>
          </b-dropdown-item>
          <b-dropdown-item @click="completeOrder(data.item['Order Id'])">
            <feather-icon icon="TrashIcon" />
            <span class="align-middle ml-50">Complete</span>
          </b-dropdown-item>
          <b-dropdown-item @click="deleteOrder(data.item['Order Id'])">
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
import Swal from "sweetalert2";
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
      products: null,
      filtredItems: null,
      searchTerm: "",
      items: [],
      roles: null,
      user: JSON.parse(localStorage.getItem("userData")),
      users: [],
      data: null
    };
  },
  async created() {
    this.getOrders();
  },
  methods: {
    dataFiller(data) {
      console.log(this.data)
      data.forEach((element) => {
        this.items.push({
          "Order Id": element.orderId,
          "User Name": element.userName,
          "Total Price": element.price,
          Date: element.date.slice(0, 18),
          Type: element.type == true ? "Buy" : "Sel",
          Actions: null,
        });
      });
      this.filtredItems = this.items;
      console.log(this.filtredItems);
    },
    getOrders() {
      if (this.user.roleId == 1) {
        HTTP.get("Order/getOrderTable")
          .then((result) => {
            this.data = result.data
            this.dataFiller(result.data)
          })
          .catch((err) => {});
      } else {
        HTTP.get("Order/getOrderTableByUserId/" + this.user.userId)
          .then((result) => {
            this.data = result.data
            this.dataFiller(result.data)
          })
          .catch((err) => {});
      }
    },
    completeOrder(id){
      HTTP.put("Order/completeOrder/"+id).then((result) => {
        this.items.forEach(z => {
          if(z["Order Id"] == id) {
          z.Completed = true
        }})
        console.log(this.items)
        this.filterOrder()
      }).catch((err) => {
        
      });
    },
    deleteOrder(id) {
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
          HTTP.delete("Order/deleteOrder/" + id)
            .then((result) => {
              this.items = this.items.filter((z) => z["User Id"] != id);
              this.filterOrder();
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
    filterOrder: function () {
      // console.log("filter")
      this.filtredItems = this.items.filter((e) =>
        this.searchTerm == ""
          ? true
          : e["User Name"]
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())
      );
      // console.log(this.filtredMovies , this.movies)
    },
  },
  watch: {
    searchTerm: function () {
      this.filterOrder();
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>