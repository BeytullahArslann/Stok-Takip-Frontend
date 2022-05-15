<!--  eslint-disable -->
<template>
  <validation-observer ref="loginValidation">
    <b-form class="auth-login-form mt-2" @submit.prevent>
      <!-- email -->
      <b-row>
        <b-col md="6">
          <b-form-group label="Email" label-for="login-email">
            <validation-provider
              #default="{ errors }"
              name="Email"
              rules="required|email"
            >
              <b-form-input
                id="login-email"
                v-model="form.email"
                :state="errors.length > 0 ? false : null"
                name="login-email"
                placeholder="john@example.com"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group>
            <div class="d-flex justify-content-between">
              <label for="login-password">Password</label>
            </div>
            <validation-provider
              #default="{ errors }"
              name="Password"
              rules="required"
            >
              <b-input-group
                class="input-group-merge"
                :class="errors.length > 0 ? 'is-invalid' : null"
              >
                <b-form-input
                  id="login-password"
                  v-model="form.password"
                  :state="errors.length > 0 ? false : null"
                  class="form-control-merge"
                  :type="passwordFieldType"
                  name="login-password"
                  placeholder="············"
                />
                <b-input-group-append is-text>
                  <feather-icon
                    class="cursor-pointer"
                    :icon="passwordToggleIcon"
                    @click="togglePasswordVisibility"
                  />
                </b-input-group-append>
              </b-input-group>
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="First Name" label-for="mc-first-name">
            <b-form-input
              id="mc-first-name"
              placeholder="First Name"
              v-model="form.userName"
              required
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Surname" label-for="mc-surname">
            <b-form-input
              id="mc-surname"
              placeholder="Surname"
              v-model="form.userSurname"
              required
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Birthday" label-for="mc-birthday">
            <b-form-datepicker
              id="mc-birthday"
              v-model="form.birthDate"
              class="mb-1"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Role" label-for="mc-role">
            <div class="form-label-group">
              <v-select
                id="mc-role"
                v-model="selectedRole"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="title"
                :options="roles"
                aria-required="true"
              />
            </div>
          </b-form-group>
        </b-col>

        <!-- Create buttons -->
        <b-button type="submit" variant="primary" block @click="validationForm">
          Update User
        </b-button>
      </b-row>
    </b-form>
  </validation-observer>
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

export default {
  mixins: [togglePasswordVisibility],
  data() {
    return {
      currentId: this.$route.params.id,
      roles: [],
      selectedRole: null,
      required,
      email,
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
        userName: "",
        userSurname: "",
        email: "",
        password: "",
        birthDate: "",
        roleId: null,
      },
    };
  },
  async created() {
    await HTTP.get("User/getUser/" + this.currentId)
      .then((result) => {
        this.form = result.data[0];
        console.log(this.form);
      })
      .catch((err) => {});
    HTTP.get("Role/getAllRoles")
      .then((result) => {
        result.data.forEach((element) => {
          if (element.id == this.form.roleId) {
            this.selectedRole = { id: element.id, title: element.roleName };
          }
          this.roles.push({ id: element.id, title: element.roleName });
        });
        console.log(this.roles);
      })
      .catch((err) => {});
  },
  watch: {},
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginValidation.validate().then((success) => {
        if (success) {
          this.form.roleId = this.selectedRole.id;
          HTTP.put("User/updateUser/" + this.currentId, this.form)
            .then((result) => {
              if (result.status == 200) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: "User Updated",
                    icon: "Success",
                    variant: "success",
                  },
                });
              }
            })
            .catch((err) => {});
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
  },
  directives: {
    Ripple,
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>