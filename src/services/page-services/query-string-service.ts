import { ModelFilter } from "react3l-common";
import React, { Reducer, useRef } from "react";
import { useHistory } from "react-router";
import nameof from "ts-nameof.macro";
import { FilterAction, filterReducer } from "./filter-service";
import { utilService } from "../common-services/util-service";

const qs = require("qs");

function isStringNumber(stringValue: string) {
  var regex = new RegExp("^-?\\d*\\.?\\d*$");
  return typeof stringValue === "string" && stringValue.match(regex);
}

export const queryStringService = {
  /**
   * react hook for control query param url
   * @param: ClassFilter: new () => TFilter
   * @param: defaultFilter?: TFilter
   * @return: [modelFilter, dispatch]
   * */
  useQueryString<TFilter extends ModelFilter>(
    ClassFilter: new () => TFilter,
    defaultFilter?: TFilter
  ): [TFilter, React.Dispatch<FilterAction<TFilter>>] {
    const history = useHistory();

    const firstUpdate = useRef(true);

    const buildFilter = React.useMemo(() => {
      const modelFilter = new ClassFilter();

      const queryFilter: TFilter = qs.parse(
        history.location.search.substring(1)
      );

      if (!utilService.isEmpty(queryFilter)) {
        Object.entries(queryFilter).forEach(
          ([key, value]: [keyof TFilter, any]) => {
            switch (key) {
              case nameof(ModelFilter.prototype.orderBy):
                modelFilter.orderBy = value;
                break;
              case nameof(ModelFilter.prototype.orderType):
                modelFilter.orderType = value;
                break;
              case nameof(ModelFilter.prototype.skip):
                modelFilter.skip = Number(value);
                break;
              case nameof(ModelFilter.prototype.take):
                modelFilter.take = Number(value);
                break;
              default:
                if (
                  typeof value === "object" &&
                  value !== null &&
                  value !== undefined &&
                  !Array.isArray(value)
                ) {
                  for (let prop in value) {
                    if (value[prop] && isStringNumber(value[prop]))
                      value[prop] = Number(value[prop]);
                  }

                  if (
                    modelFilter[key] !== null &&
                    modelFilter[key] !== undefined
                  ) {
                    Object.assign(modelFilter[key], { ...value });
                  } else {
                    modelFilter[key] = { ...value };
                  }
                } else {
                  modelFilter[key] = value;
                }
                break;
            }
          }
        );
      } else {
        if (typeof defaultFilter !== "undefined") {
          Object.assign(modelFilter, defaultFilter);
        }
      }
      return modelFilter;
    }, [ClassFilter, history.location.search, defaultFilter]);

    const [modelFilter, dispatch] = React.useReducer<
      Reducer<TFilter, FilterAction<TFilter>>
    >(filterReducer, buildFilter);

    React.useLayoutEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }

      const queryFilter = qs.stringify(JSON.parse(JSON.stringify(modelFilter)));
      history.push({
        pathname: history.location.pathname,
        search: queryFilter,
      });

      return function cleanup() {};
    }, [modelFilter, history]);

    return [modelFilter, dispatch];
  },

  /**
   * react hook get value from query url
   * @param: queryValue: string
   * @return: { queryObject, queryValue }
   * */
  useGetQueryString(queryValue: string) {
    const history = useHistory();
    const queryObject = React.useMemo(() => {
      return qs.parse(history.location.search.substring(1));
    }, [history]);

    return {
      queryObject,
      [queryValue]: queryObject[queryValue] ? queryObject[queryValue] : null,
    };
  },
};
