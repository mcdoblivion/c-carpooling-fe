import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import H from "@here/maps-api-for-javascript";
import "./HereMap.scss";
import {
  MapSearchBox,
  SuggestLocationInterface,
} from "./MapSearchBox/MapSearchBox";
import { useTranslation } from "react-i18next";

export interface HereMapProps {
  styles?: React.CSSProperties;
  classNames?: any;
  handleChangeHomeAddress?: (fieldName: any) => void;
  handleChangeWorkAddress?: (fieldName: any) => void;
  viewModel?: MutableRefObject<boolean>;
  currentHomeAddress?: any;
  currentWorkAddress?: any;
}
export function HereMap(props: HereMapProps) {
  const [translate] = useTranslation();
  const {
    styles,
    classNames,
    handleChangeHomeAddress,
    handleChangeWorkAddress,
    viewModel,
    currentHomeAddress,
    currentWorkAddress,
  } = props;
  const mapRef = useRef<HTMLElement>();
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const renderingParamsRef = useRef<H.map.render.RenderingParams>();
  const [map, setMap] = useState<H.Map>();
  const [ui, setUI] = useState<any>();
  const platform = useMemo(() => {
    return new H.service.Platform({
      apikey: "ohvnoVs8d_Eb17BxASziYhuKsTMXHIZJzgh96NID5pw",
    });
  }, []);

  const fullScreenButton = useRef<HTMLButtonElement>(null);

  const initMap = useCallback(
    (lat: number, lng: number) => {
      if (mapRef.current) {
        const layers = platform.createDefaultLayers();
        const mapObj = new H.Map(mapRef.current, layers.vector.normal.map, {
          pixelRatio: window.devicePixelRatio,
          center: { lat, lng },
          zoom: -50,
        });
        mapObj.addLayer(
          new H.map.layer.CanvasLayer(function (
            ctx: CanvasRenderingContext2D | WebGLRenderingContext,
            renderingParams
          ) {
            if (ctx instanceof WebGLRenderingContext)
              return H.map.render.RenderState.PENDING;
            ctxRef.current = ctx;
            renderingParamsRef.current = renderingParams;
            return H.map.render.RenderState.DONE;
          })
        );
        window.addEventListener("resize", () => mapObj.getViewPort().resize());
        const behavior = new H.mapevents.Behavior(
          new H.mapevents.MapEvents(mapObj)
        );
        // Chặn cho map zoom lên khi click vào map
        behavior.disable(H.mapevents.Behavior.Feature.DBL_TAP_ZOOM);
        const uiH = H.ui.UI.createDefault(mapObj, layers);
        /** config lại position cho ui control trên map */
        const mapSettings = uiH.getControl("mapsettings");
        const zoom = uiH.getControl("zoom");
        const scalebar = uiH.getControl("scalebar");
        mapSettings.setAlignment(H.ui.LayoutAlignment.TOP_RIGHT);
        zoom.setAlignment(H.ui.LayoutAlignment.TOP_RIGHT);
        scalebar
          .setAlignment(H.ui.LayoutAlignment.TOP_RIGHT)
          .setVisibility(false);
        /** */
        setUI(uiH);
        setMap(mapObj);
      }
    },
    [platform]
  );

  useEffect(() => {
    initMap(21.03679, 105.78215);
  }, [initMap]);

  // Hiện thị bubble tương ứng với vị trí đã search
  const addMarkerToGroup = useCallback((group, coordinate, html) => {
    var marker = new H.map.Marker(coordinate);
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
  }, []);
  const addInfoBubble = useCallback(
    (lat: any, lng: any, address: string) => {
      var group = new H.map.Group();
      map.setCenter({ lat, lng });
      map.addObject(group);
      group.addEventListener(
        "tap",
        function (evt: any) {
          var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
            content: evt.target.getData(),
          });
          ui.addBubble(bubble);
        },
        false
      );
      addMarkerToGroup(group, { lat: lat, lng: lng }, `<div>${address}</div>`);
    },
    [addMarkerToGroup, map, ui]
  );

  const routingParameters = useCallback(
    (origin: { lat: any; lng: any }, destination: { lat: any; lng: any }) => {
      return {
        routingMode: "fast",
        transportMode: "car",
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        return: "polyline",
      };
    },
    []
  );
  const handleRemoveBubbles = useCallback(() => {
    map?.getObjects().forEach((o: any) => map.removeObject(o));
  }, [map]);

  const drawRoutingBetweenTwoPoint = useCallback(
    (result) => {
      if (result.routes.length) {
        handleRemoveBubbles();
        result.routes[0].sections.forEach((section: any) => {
          let linestring = H.geo.LineString.fromFlexiblePolyline(
            section.polyline
          );
          let routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: "red", lineWidth: 3 },
            data: undefined,
          });
          let startMarker = new H.map.Marker(section.departure.place.location);
          let endMarker = new H.map.Marker(section.arrival.place.location);
          map.addObjects([routeLine, startMarker, endMarker]);
          map
            .getViewModel()
            .setLookAtData({ bounds: routeLine.getBoundingBox() });
        });
      }
    },
    [handleRemoveBubbles, map]
  );

  var router = platform.getRoutingService(null, 8);

  const toggleFullScreen = useCallback((fullScreen: any) => {
    if (!document.fullscreenElement) {
      fullScreen.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);
  // Hiển thị các quỹ đất lên map
  const handleGetViewModel = useCallback(
    (address, latitude, longitude) => {
      map.getViewModel().setLookAtData({
        position: { lat: latitude, lng: longitude },
        zoom: 18,
      });
      addInfoBubble(latitude, longitude, address);
    },
    [addInfoBubble, map]
  );

  useEffect(() => {
    if (viewModel) {
      router.calculateRoute(
        routingParameters(
          {
            lat: currentHomeAddress?.latitude,
            lng: currentHomeAddress?.longitude,
          },
          {
            lat: currentWorkAddress?.latitude,
            lng: currentWorkAddress?.longitude,
          }
        ),
        drawRoutingBetweenTwoPoint,
        function (error) {
          // alert(error.message);
        }
      );

      viewModel.current = false;
    }
  }, [
    currentHomeAddress?.latitude,
    currentHomeAddress?.longitude,
    currentWorkAddress?.latitude,
    currentWorkAddress?.longitude,
    drawRoutingBetweenTwoPoint,
    handleGetViewModel,
    router,
    routingParameters,
    viewModel,
  ]);

  const handlePlacesChanged = useCallback(
    (places: SuggestLocationInterface[]) => {
      if (places !== undefined) {
        const { 0: place } = places;
        if (!place || !place.position) return;
        const address = place.title;
        const latitude = place.position[0];
        const longitude = place.position[1];
        handleGetViewModel(address, latitude, longitude);
      }
    },
    [handleGetViewModel]
  );

  useEffect(() => {
    if (mapRef.current) {
      fullScreenButton.current.addEventListener("click", () =>
        toggleFullScreen(mapRef.current)
      );
    }
    if (currentHomeAddress && currentWorkAddress) {
      router.calculateRoute(
        routingParameters(
          {
            lat: currentHomeAddress?.latitude,
            lng: currentHomeAddress?.longitude,
          },
          {
            lat: currentWorkAddress?.latitude,
            lng: currentWorkAddress?.longitude,
          }
        ),
        drawRoutingBetweenTwoPoint,
        function (error) {
          alert(error.message);
        }
      );
    }
  }, [
    currentHomeAddress,
    currentWorkAddress,
    drawRoutingBetweenTwoPoint,
    router,
    routingParameters,
    toggleFullScreen,
  ]);

  return (
    <div
      className={`d-flex flex-column here_map-container ${classNames} `}
      ref={mapRef as RefObject<HTMLDivElement>}
      style={styles}
    >
      <MapSearchBox
        className="map-search-box-1"
        onPlacesChanged={handlePlacesChanged}
        handleChangeAddress={handleChangeHomeAddress}
        value={currentHomeAddress?.fullAddress}
        placeholder={"Nhập địa chỉ nhà..."}
      />

      <MapSearchBox
        className="map-search-box-2"
        onPlacesChanged={handlePlacesChanged}
        handleChangeAddress={handleChangeWorkAddress}
        value={currentWorkAddress?.fullAddress}
        placeholder={"Nhập địa chỉ công ty..."}
      />
      <button
        className="full_screen_button"
        ref={fullScreenButton}
        title={translate("heremap.zoom")}
      >
        <i className="bx bx-fullscreen" />
      </button>
    </div>
  );
}
