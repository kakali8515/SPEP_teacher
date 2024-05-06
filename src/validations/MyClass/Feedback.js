import validator from "validator";


function check(value) {
  if (value === undefined || value === null) {
      return true;
  } else if (!String(value).trim()) {
      return true;
  } else if (String(value).length < 1) {
      return true;
  } else if (validator.isEmpty(String(value))) {
      return true;
  } else return false;
}

function editorCheck(myHTML) {
  const docs = new DOMParser().parseFromString(myHTML, 'text/html');
  const img = docs.getElementsByTagName('img');
  const iframe = docs.getElementsByTagName('iframe');
  const video = docs.getElementsByTagName('video');

  if (img.length > 0 || iframe.length > 0 || video.length > 0) {
    return check(myHTML);
  }
  const editor = myHTML.replace(/<[^>]+>/g, '');
  return check(editor);
}


const validate = formData => {
  let errors = {};
  const { response } = formData;
if (validator.isEmpty(response) || editorCheck(response)) {
    errors.response = "This is mandatory field";
  }
  return {
    isInvalid: Object.keys(errors).length > 0,
    error: errors,
  };
};

export {validate};
