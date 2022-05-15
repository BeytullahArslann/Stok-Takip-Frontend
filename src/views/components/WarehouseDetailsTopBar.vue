<!-- eslint-disable -->
<template>
  <b-card>
    <b-row>
      <!-- User Info: Left col -->
      <b-col
        cols="21"
        xl="6"
        class="d-flex justify-content-between flex-column"
      >
        <!-- User Avatar & Action Buttons -->
        <div class="d-flex justify-content-start">
          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h4 class="mb-0">
                {{ warehouse.name }}
              </h4>
               <span class="card-text">{{ warehouse.code }}</span> 
            </div>
            <div class="d-flex flex-wrap">
              <b-button
                :to="{ name: 'updateWarehouse', params: { id: warehouse.id } }"
                variant="primary"
              >
                Edit
              </b-button>
              <b-button
                variant="outline-danger"
                class="ml-1"
                @click="deleteWarehouse()"
              >
                Delete
              </b-button>
            </div>
          </div>
        </div>

        <!-- User Stats -->
        <div class="d-flex align-items-center mt-2">
          <div class="d-flex align-items-center mr-2">
            <b-avatar
              variant="light-danger"
              rounded
            >
              <feather-icon
                icon="PackageIcon"
                size="18"
              />
            </b-avatar>
            <div class="ml-1">
              <h5 class="mb-0">
                {{ warehouseCapacity.quantity }}
              </h5>
              <small>Used Capacity</small>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <b-avatar
              variant="light-success"
              rounded
            >
              <feather-icon
                icon="PackageIcon"
                size="18"
              />
            </b-avatar>
            <div class="ml-1">
              <h5 class="mb-0">
                {{ warehouse.capacity - warehouseCapacity.quantity }}
              </h5>
              <small>Available Capacity</small>
            </div>
          </div>
        </div>
      </b-col>

      <!-- Right Col: Table -->
      <b-col
        cols="12"
        xl="6"
      >
        <table class="mt-2 mt-xl-0 w-100">
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="UserIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Director Name</span>
            </th>
            <td class="pb-50">
              {{ warehouseAdmin.userName }}  {{ warehouseAdmin.userSurname }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="CheckIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Status</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ warehouse.isActive }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="StarIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Capacity</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ warehouse.capacity }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="FlagIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Address</span>
            </th>
            <td class="pb-50">
              {{ warehouse.address }}
            </td>
          </tr>
          <!-- <tr>
            <th>
              <feather-icon
                icon="PhoneIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Contact</span>
            </th>
            <td>
              {{ userData.contact }}
            </td>
          </tr> -->
        </table>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BCard, BButton, BAvatar, BRow, BCol,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      adminName:"asd",
    }
  },
  methods: {
    deleteWarehouse() {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          HTTP.delete("warehouse/deleteWarehouse/"+this.warehouse.id).then((result) => {
            console.log(result)
            this.$parent.getWarehouse();
          }).catch((err) => {
            
          });
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
        } else if (result.dismiss === 'cancel') {
          Swal.fire({
            title: 'Cancelled',
            text: 'Your imaginary file is safe :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
        }
      })
    },
  },
  components: {
    BCard, BButton, BRow, BCol, BAvatar,
  },
  created() {
    
    console.log(this.warehouse)
  },
  props: {
    warehouse: {
      type:Object
    },
    warehouseAdmin:{
      type:Object
    },
  warehouseCapacity: {
    type : Object,
    default(rawProps) {
        return {quantity: 0}
        }
  }
  },
  // setup() {
  //   const { resolveUserRoleVariant } = useUsersList()
  //   return {
  //     avatarText,
  //     resolveUserRoleVariant,
  //   }
  // },
}
</script>

<style>

</style>
