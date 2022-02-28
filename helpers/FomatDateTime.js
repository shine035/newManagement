import moment from "moment";
import locale from "antd/es/date-picker/locale/vi_VN";

export const localeVN = {
  ...locale,
  lang: {
    ...locale.lang,
    placeholder: "Chọn Thời gian",
  },
};
export const dateFormat = "DD/MM/YYYY";

export const formatDateVN = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

export const formatDateType1 = (date) => {
  return moment(date).format("yyyy-MM-DD");
};

export const formatDateAndTime = (date) => {
  return moment(date).format("hh:mm:ss DD/MM/YYYY");
};
