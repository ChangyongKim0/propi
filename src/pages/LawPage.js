import React, { useEffect, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./LawPage.module.scss";
import InfoText from "../atoms/InfoText";
import Card from "../atoms/Card";
import Banner from "../atoms/Banner";
import Button from "../atoms/Button";
import Chip from "../atoms/Chip";
import DataTable from "../atoms/DataTable";
import Dialog from "../atoms/Dialog";
import List from "../atoms/List";
import Navigation from "../atoms/Navigation";
import Search from "../atoms/Search";
import Sheet from "../atoms/Sheet";
import Snackbar from "../atoms/Snackbar";
import Switch from "../atoms/Switch";
import TextField from "../atoms/TextField";
import Divider from "../atoms/Divider";
import NavigationBar from "../component/NavigationBar";
import LawSheet from "../component/LawSheet";
import LawCard from "../component/LawCard";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');

const sample_data = [
  {
    title: "건축법",
    data: {
      type: "법",
      title: "건축법",
      sub_title: "건축과 관련된 일반적인 규제등 사항",
      depth: 0,
      onClick: () => {
        window.open("https://www.law.go.kr/법령/건축법");
      },
    },
    children: [
      {
        data: {
          type: "영",
          title: "건축법 시행령",
          sub_title: "건축과 관련된 일반적인 규제등 세부 사항",
          depth: 1,
          onClick: () => {
            window.open("https://www.law.go.kr/법령/건축법시행령");
          },
        },
        children: [
          {
            data: {
              type: "규",
              title: "건축물의 구조기준 등에 관한 규칙",
              sub_title: "내력벽 두께, 가새의 두께 등 사항(구조업체 협력)",
              depth: 2,
              onClick: () => {
                window.open(
                  "https://www.law.go.kr/법령/건축물의구조기준등에관한규칙"
                );
              },
            },
            children: [
              {
                data: {
                  type: "고",
                  title: "건축구조기준",
                  sub_title: "구조설계기준 사항(구조업체 협력)",
                  depth: 2,
                  onClick: () => {
                    window.open("https://www.law.go.kr/행정규칙/건축구조기준");
                  },
                },
                children: [],
              },
              {
                data: {
                  type: "고",
                  title: "소규모건축구조기준(KDS 41 90 00)",
                  sub_title: "구조설계기준 사항(구조업체 협력)",
                  depth: 2,
                  onClick: () => {
                    window.open(
                      "https://www.law.go.kr/행정규칙/소규모건축구조기준(KDS419000)"
                    );
                  },
                },
                children: [],
              },
            ],
          },
          {
            data: {
              type: "규",
              title: "건축물의 설비기준 등에 관한 규칙",
              sub_title:
                "승강기, 환기구, 온돌, 난방, 배연, 배관, 피뢰, 전기, 냉방설비등의 사항(설비업체 협력)",
              depth: 1,
              onClick: () => {
                window.open(
                  "https://www.law.go.kr/법령/건축물의설비기준등에관한규칙"
                );
              },
            },
            children: [],
          },
          {
            data: {
              type: "규",
              title: "건축물의 피난·방화구조 등의 기준에 관한 규칙",
              sub_title:
                "직통·피난계단, 피난안전구역, 피난용승강기, 출구, 방화구획등의 사항(소방업체 협력)",
              onClick: () => {
                window.open(
                  "https://www.law.go.kr/법령/건축물의피난방화구조등의기준에관한규칙"
                );
              },
            },
            children: [
              {
                data: {
                  type: "고",
                  title: "건축물의 에너지절약설계기준",
                  sub_title: "녹색건축법상에 따른 인증을 위한 사항",
                  onClick: () => {
                    window.open(
                      "https://www.law.go.kr/행정규칙/건축물의에너지절약설계기준"
                    );
                  },
                },
                children: [],
              },
              {
                data: {
                  type: "고",
                  title: "소음방지를 위한 층간 바닥충격음 차단 구조기준",
                  sub_title: "주거용 건축물의 표준바닥구조 제한사항",
                  onClick: () => {
                    window.open(
                      "https://www.law.go.kr/행정규칙/소음방지를위한층간바닥충격음차단구조기준"
                    );
                  },
                },
                children: [],
              },
            ],
          },
          {
            data: {
              type: "규",
              title: "건축법 시행규칙",
              sub_title: "건축 일반에 대한 세부 규정 사항",
              onClick: () => {
                window.open("https://www.law.go.kr/법령/건축법시행규칙");
              },
            },
            children: [
              {
                data: {
                  type: "고",
                  title: "실내건축의 구조·시공방법 등에 관한 기준",
                  sub_title: "실내의 구체적인 요소의 설계에 대한 사항",
                  onClick: () => {
                    window.open(
                      "https://www.law.go.kr/행정규칙/실내건축의구조시공방법등에관한기준"
                    );
                  },
                },
                children: [],
              },
              {
                data: {
                  type: "고",
                  title: "엔지니어링사업대가의 기준",
                  sub_title: "표준품셈, 대가산정 등에 관한 사항",
                  onClick: () => {
                    window.open(
                      "https://www.law.go.kr/행정규칙/엔지니어링사업대가의기준"
                    );
                  },
                },
                children: [],
              },
            ],
          },
          {
            data: {
              type: "조",
              title: "건축 조례",
              sub_title: "건축과 관련된 지역별 규제등 세부 사항",
              // onClick: () => {
              //   window.open("https://www.law.go.kr/법령/건축법시행령");
              // },
            },
            children: [],
          },
          {
            data: {
              type: "조",
              title: "건축 조례 시행규칙",
              sub_title: "경산시, 안산시 등 일부 행정구역에서의 세부 규제사항",
              // onClick: () => {
              //   window.open("https://www.law.go.kr/법령/건축법시행령");
              // },
            },
            children: [],
          },
        ],
      },
    ],
  },
];
// var map = new naver.maps.Map(mapDiv);

const LawPage = () => {
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-content")}>
        <List align="left" gap="2">
          <div className={cx("text-section")}>주요 법의 하위 법령 체계</div>
          <List align="left">
            {sample_data.map((e, idx) => {
              return (
                <List align="left" gap="1">
                  <div className={cx("text-subsection")}>{e.title}</div>
                  <LawCard key={idx} {...e.data}>
                    {e.children.map((e2, idx2) => {
                      return (
                        <LawCard key={idx2} {...e2.data}>
                          {e2.children.map((e3, idx3) => {
                            return (
                              <LawCard key={idx3} {...e3.data}>
                                {e3.children.map((e4, idx4) => {
                                  return (
                                    <LawCard key={idx4} {...e4.data}></LawCard>
                                  );
                                })}
                              </LawCard>
                            );
                          })}
                        </LawCard>
                      );
                    })}
                  </LawCard>
                </List>
              );
            })}
          </List>
        </List>
      </div>
      <LawSheet></LawSheet>
      <NavigationBar emph="law"></NavigationBar>
    </div>
  );
};

export default LawPage;
