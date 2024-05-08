import containerValidator from "container-validator";
import { validateRut } from "rutlib";
import * as Yup from "yup";

function configureValidations() {
  Yup.addMethod(Yup.string, "validRut", function () {
    return this.test("valid-rut", "Rut es inválido", (value) => {
      return validateRut(value);
    });
  });

  Yup.addMethod(Yup.string, "validContainer", function () {
    return this.test(
      "valid-container",
      "El contenedor es inválido",
      (value) => {
        let validator = new containerValidator();
        if (value == undefined) return false;
        return validator.isValid(value.replace("-", ""));
      }
    );
  });
}

Yup.addMethod(Yup.string, "noWhiteSpaces", function (message) {
  return this.matches(/^(\S+$)/g, message);
});

export default configureValidations;
