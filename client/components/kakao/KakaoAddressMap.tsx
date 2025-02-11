"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import useFeedStore from "@states/store/feedStore";
import { AddressState } from "@interfaces/feeds/feed.post";
import { Skeleton } from "@components/common/skeleton/Skeleton";
import { KAKAO_API_KEY } from "@config/processConfig";

export const KakaoAddressMap = (): ReactElement => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { setFeedItem, item } = useFeedStore();
  const [pending, setPending] = useState(true);
  const [address, setAddress] = useState<AddressState>({
    name: "",
    x: "",
    y: "",
    sido: "",
    sigungu: "",
  });

  useEffect(() => {
    setFeedItem({
      ...item,
      address,
    });
  }, [address]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;
    script.type = "text/javascript";
    script.async = true;

    document.head.appendChild(script);

    script.onload = () => {
      const kakao: any = (window as any).kakao;
      kakao.maps.load(() => {
        const imageSrc =
          "https://gofoodie-images.s3.ap-northeast-2.amazonaws.com/assets/marker.svg"; // 마커 이미지 URL
        const imageSize = new kakao.maps.Size(20, 30); // 마커 이미지 크기
        const imageOption = { offset: new kakao.maps.Point(8, 26) }; // 마커 이미지의 좌표 옵션

        const mapElement = document.getElementById("map");

        const markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        const marker = new kakao.maps.Marker({
          image: markerImage, // 마커에 이미지 설정
        });

        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
          const options = {
            center: new kakao.maps.LatLng(lat, lon),
            level: 4,
          };
          const map = new kakao.maps.Map(mapElement, options);
          const geocoder = new kakao.maps.services.Geocoder();

          searchAddrFromCoords(map.getCenter(), () => {});

          kakao.maps.event.addListener(
            map,
            "click",
            function (mouseEvent: any) {
              searchDetailAddrFromCoords(
                mouseEvent.latLng,
                function (result: any, status: any) {
                  const { address } = result[0];
                  const {
                    address_name,
                    region_1depth_name,
                    region_2depth_name,
                  } = address;

                  if (status === kakao.maps.services.Status.OK) {
                    marker.setPosition(mouseEvent.latLng);
                    marker.setMap(map);

                    const x = String(mouseEvent.latLng.getLng());
                    const y = String(mouseEvent.latLng.getLat());
                    const address = {
                      x,
                      y,
                      name: address_name,
                      sido: region_1depth_name,
                      sigungu: region_2depth_name,
                    };
                    setAddress(address);
                  }
                }
              );
            }
          );

          function searchAddrFromCoords(coords: any, callback: any) {
            // 좌표로 행정동 주소 정보를 요청합니다
            geocoder.coord2RegionCode(
              coords.getLng(),
              coords.getLat(),
              callback
            );
          }

          function searchDetailAddrFromCoords(coords: any, callback: any) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
          }
        });
      });
      setPending(false);
    };

    return () => {
      const scripts = document.head.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (
          script.parentNode &&
          script.src &&
          script.src.includes("dapi.kakao.com")
        ) {
          script.parentNode.removeChild(script);
        }
      }
    };
  }, [mapContainer, pending]);

  if (pending) return <Skeleton isLoading={pending} />;

  return (
    <div
      id={"map"}
      ref={mapContainer}
      style={{
        width: "100%",
        height: 300,
      }}
    />
  );
};
