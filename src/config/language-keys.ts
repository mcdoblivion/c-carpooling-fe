import { translate } from "i18n/i18n";

export interface LanguageKeys {
  [name: string]: any;
}

export const generalLanguageKeys: LanguageKeys = {
  actions: {
    view: translate("general.actions.view"),
    edit: translate("general.actions.edit"),
    delete: translate("general.actions.delete"),
    create: translate("general.actions.create"),
    label: translate("general.actions.label"),
  },
  titles: {
    edit: translate("general.titles.edit"),
    create: translate("general.titles.create"),
  },
  toasts: {
    error: translate("general.toasts.error"),
    success: translate("general.toasts.success"),
  },
  deletes: {
    label: translate("general.deletes.title"),
    content: translate("general.deletes.content"),
  },
  errors: {
    validation: {
      typeError: translate("general.errors.validations.typeError"),
      required: translate("general.errors.validations.required"),
    },
  },
};
