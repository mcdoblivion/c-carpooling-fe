import React, { RefObject } from "react";
import mapSearchBoxStyle from "./MapSearchBox.module.scss";
import { MapSearchBoxService } from "./MapSearchBoxService";
import { List } from "antd";
import Search16 from "@carbon/icons-react/es/search/16";
import { InputText } from "react3l-ui-library";
import { utilService } from "services/common-services/util-service";
export interface SuggestLocationInterface {
  category?: string;
  categoryTitle?: string;
  highlightedTitle?: string;
  highlightedVicinity?: string;
  href?: string;
  id?: string;
  position?: number[];
  resultType?: string;
  title?: string;
  type?: string;
  vicinity?: string;
}
export interface MapSearchBoxProps {
  map?: H.Map;
  placeholder?: string;
  className?: string;
  defaultAddress?: string;
  disabled?: boolean;
  onPlacesChanged: any;
  value?: string;
  handleChangeAddress?: (fieldName: any) => void;
}

export function MapSearchBox(props: MapSearchBoxProps) {
  const mapSearchBoxService = React.useRef<MapSearchBoxService>(null);
  const { onPlacesChanged, disabled, value, handleChangeAddress } = props;
  const [suggest, setSuggest] = React.useState<SuggestLocationInterface[]>([]);
  const wrapperRef: RefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    mapSearchBoxService.current = new MapSearchBoxService();
  }, []);

  const handleChoosePlace = React.useCallback(
    (selectedPlace: SuggestLocationInterface) => {
      handleChangeAddress(selectedPlace);
      onPlacesChanged([selectedPlace]);
      setSuggest([]);
    },
    [handleChangeAddress, onPlacesChanged]
  );
  const renderSuggest = React.useMemo(() => {
    return (
      <div>
        {suggest && suggest.length > 0 && (
          <List
            bordered
            dataSource={suggest}
            renderItem={(item) => (
              <List.Item onClick={() => handleChoosePlace(item)}>
                {item.title}
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }, [handleChoosePlace, suggest]);
  const handleChangePlaces = React.useCallback((value: string) => {
    mapSearchBoxService.current
      .useSuggest(value)
      .then((res: any) => {
        if (res && res?.length > 0) {
          setSuggest(res);
        }
      })
      .catch(() => setSuggest([]));
  }, []);

  utilService.useClickOutside(wrapperRef, () => {
    setSuggest([]);
  });
  return (
    <div
      className={`${mapSearchBoxStyle["input-container"]} ${props.className}`}
      ref={wrapperRef}
    >
      <InputText
        value={value}
        placeHolder={props.placeholder}
        className={"tio-account_square_outlined"}
        onEnter={handleChangePlaces}
        disabled={disabled}
        suffix={<Search16 />}
      />
      {suggest.length > 0 ? (
        <div className={mapSearchBoxStyle["list-suggestion__container"]}>
          {renderSuggest}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
