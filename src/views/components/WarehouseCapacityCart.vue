<!-- eslint-disable -->
<template>
  <b-card no-body>
    <b-card-header>
      <h4 class="mb-0">Depo Adı: {{ warehouse.name }}</h4>
      <b-card-text v-if="roleId == 1" class="font-medium-5 mb-0">
        <router-link
          :to="{
            name: 'updateWarehouse',
            params: { id: warehouse.id },
          }"
        >
          <feather-icon
            icon="EditIcon"
            size="21"
            class="text-muted cursor-pointer"
          />
        </router-link>
        <feather-icon
          icon="Trash2Icon"
          size="21"
          class="text-muted cursor-pointer"
          @click="deleteWarehouse()"
        />
      </b-card-text>
    </b-card-header>
    <router-link
          :to="{
            name: 'warehouseDetails',
            params: { id: warehouse.id },
          }"
        >
          <vue-apex-charts
      type="radialBar"
      height="245"
      class="my-2"
      :options="goalOverviewRadialBar"
      :series="series"
    />
    <b-row class="text-center mx-0">
      <b-col
        cols="6"
        class="
          border-top border-right
          d-flex
          align-items-between
          flex-column
          py-1
        "
      >
        <b-card-text class="text-muted mb-0"> Product Quantity </b-card-text>
        <h3 class="font-weight-bolder mb-0">
          {{ capacity[0] == 0 ? 0 : capacity.quantity }}
        </h3>
      </b-col>

      <b-col
        cols="6"
        class="border-top d-flex align-items-between flex-column py-1"
      >
        <b-card-text class="text-muted mb-0"> Warehouse Capacity </b-card-text>
        <h3 class="font-weight-bolder mb-0">
          {{ warehouse.capacity }}
        </h3>
      </b-col>
    </b-row>
        </router-link>
    <!-- apex chart -->
    
  </b-card>
</template>

<script>
/* eslint-disable*/
import { BCard, BCardHeader, BRow, BCol, BCardText } from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";
import { $themeColors } from "@themeConfig";
import Ripple from 'vue-ripple-directive'
import Swal from 'sweetalert2'
import { HTTP } from "@/main-source"

const $strokeColor = "#ebe9f1";
const $textHeadingColor = "#5e5873";
const $goalStrokeColor2 = "#51e5a8";
export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BRow,
    BCardText,
    BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    warehouse: {
      type: Object,
    },
    capacity: {
      type: Array,
      default: () => [0],
    },
  },
  data() {
    return {
      roleId: JSON.parse(localStorage.getItem("userData")).roleId,
      goalOverviewRadialBar: {
        chart: {
          height: 245,
          type: "radialBar",
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
        colors: [$goalStrokeColor2],
        plotOptions: {
          radialBar: {
            offsetY: -10,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: "77%",
            },
            track: {
              background: $strokeColor,
              strokeWidth: "50%",
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                color: $textHeadingColor,
                fontSize: "2.86rem",
                fontWeight: "600",
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: [$themeColors.success],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        grid: {
          padding: {
            bottom: 30,
          },
        },
      },
      series: null,
    };
  },
  created() {
    console.log(this.capacity);
    if (this.capacity[0] == 0) {
      //console.log("boss");
      this.series = [0];
    } else {
      this.series = [
        ("seris", (this.capacity.quantity / this.warehouse.capacity) * 100).toFixed(2),
      ];
    }
    console.log("newSeries", this.series);
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
  computed: {
    countCart: function () {
      console.log((this.warehouse.capacity / this.capacity.quantity) * 100);
      return (this.warehouse.capacity / this.capacity.quantity) * 100;
    },
  },
};
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-sweetalert.scss';
</style>