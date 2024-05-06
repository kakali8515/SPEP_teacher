import { CUAPI, API, CAPI, errCheck } from "@/services/API";
import { Token } from "@/services/Token";
import { defineStore } from "pinia";

export const useGlobalDropdown = defineStore("globalDropdown", {
  state: () => ({
    teacher_company_dropdown: [],
    teacher_course_dropdown: [],
    teacher_class_type_dropdown: [],
    teacher_session_dropdown: [],
    teacher_class_dropdown: [],
    class_dropdown: [],
    company_dropdown: [],
    year_dropdown: [],
    common_year_dropdown: [],
    session_dropdown_by_year: [],
    course_dropdown_by_year: [],
    type_dropdown: [],
    cp_list: [],
    month_dropdown: [
      { month: "Jan", value: 1 },
      { month: "Feb", value: 2 },
      { month: "Mar", value: 3 },
      { month: "Apr", value: 4 },
      { month: "May", value: 5 },
      { month: "Jun", value: 6 },
      { month: "Jul", value: 7 },
      { month: "Aug", value: 8 },
      { month: "Sep", value: 9 },
      { month: "Oct", value: 10 },
      { month: "Nov", value: 11 },
      { month: "Dec", value: 12 },
    ],

    // ...
  }),

  actions: {
    async getToken() {
      const local = new Token();
      return await local.getWithExpiry("accessTokenT").then((r) => r.token);
    },
    async fetchTeacherCompanyDropdown() {
      try {
        const res = await CUAPI.post("manager/company_list_all", {
          lgCode: "kr",
        });
        this.teacher_company_dropdown = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },

    async fetchCompanyDropdown(data) {
      try {
        const res = await CUAPI.post("teacher/company_list", data);
        this.company_dropdown = res.data.list;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchTeacherSessionDropdown(data) {
      try {
        this.teacher_session_dropdown = [];
        const res = await CUAPI.post(
          "/manager/company_ordernum_list_only_company",
          data
        );
        this.teacher_session_dropdown = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchSessionDropdownByYear(data) {
      try {
        this.session_dropdown_by_year = [];
        const res = await CUAPI.post("/manager/company_ordernum_list", data);
        this.session_dropdown_by_year = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },

    async fetchTeacherCourseDropdown(data) {
      try {
        this.teacher_course_dropdown = [];
        const res = await CUAPI.post("manager/company_all_program1_list", data);
        this.teacher_course_dropdown = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchCourseDropdownByYear(data) {
      try {
        this.course_dropdown_by_year = [];
        const res = await CUAPI.post("manager/company_program1_list", data);
        this.course_dropdown_by_year = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchTeacherClassTypeDropdown(data) {
      try {
        const res = await CUAPI.post("manager/company_program3_list2", data);
        this.teacher_class_type_dropdown = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchYearDropdown(data) {
      this.year_dropdown = [];
      try {
        const res = await CUAPI.post("manager/company_year_list", data);
        this.year_dropdown = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchCommonYearDropdown() {
      this.common_year_dropdown = [];
      try {
        const res = await API(await this.getToken()).get("/common/year-list");
        this.common_year_dropdown = res.data.list;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchTeacherClassDropdown(data) {
      try {
        const res = await CUAPI.post(
          "manager/course_class_list_no_paging",
          data
        );
        this.teacher_class_dropdown = res.data.data;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchClassDropdown(data) {
      this.class_dropdown = [];
      try {
        const res = await API(await this.getToken()).post(
          "teacher/myclass/class-dropdown",
          data
        );
        this.class_dropdown = res.data.list;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchTypeDropdown(data) {
      try {
        const res = await API(await this.getToken()).get(
          "common/class-types",
          data
        );
        this.type_dropdown = res.data.list;
      } catch (error) {
        return errCheck(error);
      }
    },
    async fetchCPListDropdown(data) {
      this.cp_list = [];
      try {
        const res = await CAPI(await this.getToken()).post(
          "manager/student_list",
          data
        );
        this.cp_list = res.data.data;
      } catch (e) {
        return errCheck(e);
      }
    },
  },
});
