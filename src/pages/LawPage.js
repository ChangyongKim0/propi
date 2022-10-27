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
import formatLawData from "../util/formatLawData";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');

const sample_data = formatLawData();
// var map = new naver.maps.Map(mapDiv);

const LawPage = () => {
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-content")}>
        <List align="left" gap="3">
          <div className={cx("text-section")}>주요 법의 하위 법령 체계</div>
          <List align="left" gap={3}>
            {sample_data.map((e, idx) => {
              return (
                <List align="left" gap="2">
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
