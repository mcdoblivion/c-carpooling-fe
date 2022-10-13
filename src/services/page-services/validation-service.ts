import React from "react";
import { Model } from "react3l-common";
import { utilService } from "services/common-services/util-service";
import * as yup from "yup";

export type ValidationError = { [x: string]: any };
export type ValidationField = {
  isValidator: boolean;
  path?: string;
  schema?: yup.InferType<any>;
};

export const validationService = {
  /**
   *
   * react hook for validation form field
   * @param: model: Model
   * @param: modelSchema: yup.InferType<any>
   *
   * @return: { isValidModel,
      validateModel,
      mappingErrors }
   *
   * */
  useValidation: (model: Model, modelSchema: yup.InferType<any>) => {
    const isValidModel: boolean = React.useMemo(() => {
      const modelValue = { ...model };
      return modelSchema.isValidSync(modelValue);
    }, [model, modelSchema]);

    const mappingErrors = React.useCallback(
      (yupErrors: yup.ValidationError): { [name: string]: string } => {
        const errors = yupErrors.inner.reduce(
          (acc: { [name: string]: string }, error: yup.ValidationError) => {
            if (/\[(\w+)\]./g.test(error.path)) {
              return utilService.convertPathString(
                error.path,
                { ...acc },
                error.errors.join(", ")
              );
            }
            return {
              ...acc,
              [error.path]: error.errors.join(", "),
            };
          },
          {}
        );
        return errors;
      },
      []
    );

    const validateModel: (model: Model) => Promise<any> = React.useCallback(
      (model: Model) => {
        const promise = new Promise((resolve, reject) => {
          modelSchema
            .validate(model)
            .then((res: Model) => {
              if (res) resolve(res);
            })
            .catch((yupErrors: yup.ValidationError) => {
              const errors = mappingErrors(yupErrors);
              reject(errors);
            });
        });
        return promise;
      },
      [mappingErrors, modelSchema]
    );

    return {
      isValidModel,
      validateModel,
      mappingErrors,
    };
  },
};
