import React from "react";
import { info } from "@randajan/simple-app/fe";
import jet from "@randajan/jet-core";

import { LandingPage } from "./LandingPage/LandingPage";
import { createRouter } from "@randajan/jet-react/dom/router";

import page from "@randajan/jet-react/base/page";
import tab from "@randajan/jet-react/base/tab";

const pages = [
  { title:"", path:"/", content:<LandingPage/>, titleMenu:"" },
  { title:"", path:"/*any", content:<LandingPage/> },
];


export const Router = createRouter(pages);


let _int;
tab.fitType("slept", "Number");

tab.fit((next, v)=>{
  v = Object.jet.tap(v);

  v.title = jet.melt([v.h1, "QRB"], " | ");

  clearTimeout(_int);

  if (v.visible !== false) { v.slept = 0; v.title += " 😊"; }
  else {
    v.title += (" 😴" + "z".repeat(v.slept%4));
    _int = setTimeout(_=>tab.set("slept", v.slept + 1), 2000);
  }

  return v;
});

page.watch(_=>tab.set("title"));