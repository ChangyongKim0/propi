import React, { Children, useEffect, useState } from "react";
// { useEffect }

import styles from "./LawCard.module.scss";
import classNames from "classnames/bind";
import Card from "../atoms/Card";
import List from "../atoms/List";
import Icon from "../atoms/Icon";

const cx = classNames.bind(styles);

const LawCard = ({
  children,
  title,
  sub_title,
  links,
  type,
  depth,
  onClick,
}) => {
  const getColor = (type) => {
    switch (type) {
      case "법":
        return "#5566bb";
      case "영":
        return "#55aa77";
      case "규":
        return "#998855";
      case "례":
        return "#998855";
      case "고":
        return "#998855";
      case "공":
        return "#998855";
      case "훈":
        return "#998855";
      default:
        return "#bb6655";
    }
  };

  const [mobile, setMobile] = useState(false);
  let media = window.matchMedia("(max-width: 600px)");

  useEffect(() => {
    Array.from(
      document.getElementsByClassName(
        "law_card_frame_guidbar_" + title.replaceAll(" ", "_")
      )
    ).map((e) => {
      e.style.height =
        document.getElementById(
          "law_card_frame_content_" + title.replaceAll(" ", "_")
        ).clientHeight -
        16 +
        "px";
    });
    if (media.matches !== mobile) {
      setMobile(media.matches);
      // console.log(media.matches, mobile);
    }
    // document.getElementById("frame-button"+title).addEventListener("mouseover", (e)=>{e.stopPropagation();});
    window.addEventListener("resize", () => {
      Array.from(
        document.getElementsByClassName(
          "law_card_frame_guidbar_" + title.replaceAll(" ", "_")
        )
      ).map((e) => {
        e.style.height =
          document.getElementById(
            "law_card_frame_content_" + title.replaceAll(" ", "_")
          ).clientHeight -
          16 +
          "px";
      });
      if (media.matches !== mobile) {
        setMobile(media.matches);
        // console.log(media.matches, mobile);
      }
    });
  }, [mobile]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-guidebar-list")}>
        {(mobile ? Array(parseInt(depth) + 1).fill(0) : [0]).map((_, idx) => {
          return (
            <div
              key={idx}
              className={
                cx("frame-guidebar") +
                " law_card_frame_guidbar_" +
                title.replaceAll(" ", "_")
              }
            ></div>
          );
        })}
      </div>
      <div
        id={"law_card_frame_content_" + title.replaceAll(" ", "_")}
        className={cx("frame-content")}
      >
        <Card transparent={true} onClick={onClick}>
          <List type="row" align="left">
            <List type="column" align="left" gap="0.2">
              {mobile ? (
                <List type="row" gap="0.2">
                  {Array(parseInt(depth))
                    .fill(0)
                    .map((_, idx) => {
                      return <div key={idx} className={cx("frame-dots")}></div>;
                    })}
                </List>
              ) : (
                <></>
              )}
              <div
                className={cx("frame-icon")}
                style={{ color: getColor(type) }}
              >
                {type}
              </div>
            </List>
            <List type="column" align="left">
              <List type="row" align="left">
                <h2 className={cx("title")}>{title}</h2>
                <List type="row" height="1.125">
                  <Icon
                    type="external_link"
                    use_tooltip={true}
                    tooltip={["법령정보 열기"]}
                  />
                  <Icon
                    type="three_bay"
                    use_tooltip={true}
                    tooltip={["삼단비교 열기"]}
                  />
                  <Icon
                    type="pick_range"
                    use_tooltip={true}
                    tooltip={["체계도 보기"]}
                  />
                  <Icon
                    type="detail"
                    use_tooltip={true}
                    tooltip={["세부 내용 보기"]}
                  />
                </List>
              </List>
              <h3 className={cx("sub-title")}>{sub_title}</h3>
            </List>
          </List>
        </Card>
        {children}
      </div>
    </div>
  );
};

LawCard.defaultProps = {
  title: "title",
  sub_title: "sub_title",
  links: ["external", "hierarchy", "detail"],
  type: "type",
  depth: "2",
};

export default LawCard;

// ### LawCard

// - children : any
// - title : any
// - sub_title : any
// - links : [external / hierarchy / detail]
// - type : 법 / 영 / 규칙 / 조례 / 고시 / 공고 / 기타
