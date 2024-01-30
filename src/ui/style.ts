import { conf } from "../config";

export function loadStyleSheel() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
  const style = document.createElement('style');
  const css = `
.full-view-grid {
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0);
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 1000;
  overflow: hidden scroll;
  transition: height 0.4s ease 0s;
  display: grid;
  align-content: start;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(${conf.colCount}, 1fr);
}
.full-view-grid input, .full-view-grid select {
  color: #f1f1f1;
  background-color: #34353b !important;
  color-scheme: dark;
  outline: none;
  border: 1px solid #000000;
  border-radius: 4px;
  margin: 0px;
  padding: 0px;
  text-align: center;
  position: unset !important;
  top: unset !important;
  vertical-align: middle;
}
.p-label {
  cursor: pointer;
}
.full-view-grid .img-node {
  position: relative;
}
.full-view-grid .img-node img {
  position: relative;
  width: 100%;
  height: auto;
  border: 3px solid #fff;
  box-sizing: border-box;
}
.img-fetched img {
  border: 3px solid #602a5c !important;
}
.img-fetch-failed img {
  border: 3px solid red !important;
}
.img-fetching img {
  border: 3px solid #00000000 !important;
}
.img-fetching div::after {
	content: '';
	position: absolute;
	z-index: -1;
  top: 0%;
  left: 0%;
	width: 30%;
	height: 30%;
	background-color: #ff0000;
	animation: img-loading 1s linear infinite;
}
@keyframes img-loading {
	25% {
    background-color: #ff00ff;
    top: 0%;
    left: 70%;
	}
	50% {
    background-color: #00ffff;
    top: 70%;
    left: 70%;
	}
	75% {
    background-color: #ffff00;
    top: 70%;
    left: 0%;
	}
}
.full-view-grid-collapse {
  height: 0;
  transition: height 0.4s;
}
.big-img-frame::-webkit-scrollbar {
  display: none;
}
.big-img-frame {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  /*overflow: hidden scroll;*/
  overflow: auto;
  z-index: 1001;
  background-color: #000000d6;
  transition: width 0.4s;
  scrollbar-width: none;
}
.big-img-frame > img, .big-img-frame > video {
  object-fit: contain;
  /* border-bottom: 1px solid #ffffff; */
  display: block;
  margin: 0 auto;
}
.p-helper {
  position: fixed;
  display: flex !important;
  justify-content: space-between;
  background-color: #4a4a4ae6;
  z-index: 2011 !important;
  box-sizing: border-box;
  font-weight: bold;
  color: #fff;
  transition: min-width 0.4s ease;
  min-width: 0px;
}
.p-helper .p-panel {
  z-index: 2012 !important;
  background-color: rgba(38, 20, 25, 0.8);
  box-sizing: border-box;
  position: absolute;
  color: rgb(200, 222, 200);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: width 0.4s ease 0s, height 0.4s ease 0s;
  padding: 3px;
}
@media (min-width: ${isMobile ? "1440px" : "720px"}) {
  .p-helper.p-helper-extend {
    min-width: 24rem;
    transition: min-width 0.4s ease, color 0.5s ease-in-out, background-color 0.3s ease-in-out;
    font-size: 1rem;
    line-height: 1.2rem;
  }
  .p-helper {
    top: ${conf.pageHelperAbTop};
    left: ${conf.pageHelperAbLeft};
    bottom: ${conf.pageHelperAbBottom};
    right: ${conf.pageHelperAbRight};
    font-size: 1rem;
    line-height: 1.2rem;
  }
  .p-helper .p-panel {
    width: 24rem;
    height: 30rem;
    bottom: 1.3rem;
  }
  .p-helper .p-btn {
    height: 1.5rem;
    width: 1.5rem;
    border: 1px solid #000000;
    border-radius: 4px;
  }
  .p-helper-extend .b-main {
    max-width: 24rem !important;
  }
  .full-view-grid input[type="checkbox"] {
    width: 1rem;
    height: unset !important;
  }
  .full-view-grid select {
    width: 7rem !important;
  }
  .full-view-grid input, .full-view-grid select {
    width: 2rem;
    height: 1.5rem;
  }
  .p-helper .p-config {
    line-height: 2rem;
  }
  #imgScaleResetBTN {
    width: 4rem;
  }
}
@media (max-width: ${isMobile ? "1440px" : "720px"}) {
  .p-helper.p-helper-extend {
    min-width: 100vw;
    transition: min-width 0.4s ease;
    font-size: 4.2cqw;
    line-height: 5cqw;
  }
  .p-helper {
    bottom: 0px;
    left: 0px;
    font-size: 8cqw;
    line-height: 8.1cqw;
  }
  .p-helper .p-panel {
    width: 100vw;
    height: 60vh;
    bottom: 5.7cqw;
  }
  .p-helper .p-btn {
    height: 6cqw;
    width: 6cqw;
    border: 0.4cqw solid #000000;
    border-radius: 1cqw;
  }
  .p-helper-extend .b-main {
    max-width: 100vw !important;
  }
  .full-view-grid input[type="checkbox"] {
    width: 4cqw;
    height: unset !important;
  }
  .full-view-grid select {
    width: 25cqw !important;
  }
  .full-view-grid input, .full-view-grid select {
    width: 9cqw;
    height: 6cqw;
    font-size: 3cqw;
  }
  .p-helper .p-config {
    line-height: 9cqw;
  }
  #imgScaleResetBTN {
    width: 14cqw;
  }
}
.p-helper:hover {
  background-color: #3a3a3ae6;
}
.p-helper .clickable {
  text-decoration-line: underline;
  z-index: 1111;
  user-select: none;
  text-align: center;
}
.clickable:hover {
  color: #90ea90 !important;
}
.p-helper .p-img-scale {
  display: flex;
}
.p-img-scale .scale-btn {
  width: 2rem;
  text-align: center;
  user-select: none;
}
.p-img-scale .scale-btn:hover {
  color: white;
  background-color: rgb(255, 200, 200);
}
.p-img-scale .scale-status {
  width: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
}
.p-img-scale .scale-progress {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.scale-progress .scale-progress-inner {
  height: 50%;
  background-color: #ffffffa0;
}
.p-collapse {
  height: 0px !important;
  transition: height 0.4s;
  padding: 0px !important;
}
.p-helper .b-main {
  max-width: 0px;
  overflow: hidden !important;
  display: flex;
  justify-content: space-between;
  white-space: nowrap !important;
  transition: flex-grow 0.6s ease, max-width 0.5s ease;
}
.p-helper-extend .b-main {
  flex-grow: 1;
  transition: flex-grow 0.6s ease, max-width 0.5s ease;
}
.p-helper .p-config {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-content: start;
}
.p-helper .p-config label {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}
.p-helper .p-config input {
  cursor: ns-resize;
}
.p-helper .p-downloader {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.p-downloader canvas {
  /* border: 1px solid greenyellow; */
}
.p-downloader .download-notice {
  font-size: small;
  text-align: center;
  width: 100%;
}
.p-downloader .downloader-btn-group {
  align-items: center;
  text-align: right;
  width: 100%;
}
.p-helper .p-btn {
  color: rgb(255, 255, 255);
  cursor: pointer;
  font-weight: 900;
  background: rgb(81, 81, 81);
  vertical-align: middle;
}
.p-helper-fetching {
  border: none !important;
  box-sizing: border-box;
}
.p-helper-fetching::after {
	content: '';
	position: absolute;
	z-index: -1;
  top: 0%;
  left: 0%;
	width: 2%;
	height: 100%;
	background-color: #ff0000;
	animation: img-loading-page 1s linear infinite;
}
@keyframes img-loading-page {
	15% {
    background-color: #fff303;
	}
	50% {
    background-color: #ff0000;
    left: 98%;
	}
	85% {
    background-color: #fff303;
	}
}
@keyframes main-progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
.big-img-frame-collapse {
  width: 0px !important;
  transition: width 0.4s;
}
.big-img-frame-collapse .img-land-left,
.big-img-frame-collapse .img-land-right,
.big-img-frame-collapse .img-land-top,
.big-img-frame-collapse .img-land-bottom {
  display: none !important;
}
.download-bar {
  background-color: rgba(100, 100, 100, 0.8);
  height: 0.5rem;
  width: 100%;
  position: absolute;
  bottom: 0;
}
.img-land-left, .img-land-right {
  width: 20%;
  height: 50%;
  position: fixed;
  z-index: 1004;
  top: 25%;
}
.img-land-top, .img-land-bottom {
  width: 50%;
  height: 10%;
  left: 25%;
  position: fixed;
  z-index: 1005;
}
.img-land-left {
  left: 0;
  cursor: url("https://exhentai.org/img/p.png"), auto;
}
.img-land-right {
  right: 0;
  cursor: url("https://exhentai.org/img/n.png"), auto;
}
.img-land-top {
  top: 0;
  cursor: url("https://exhentai.org/img/p.png"), auto;
}
.img-land-bottom {
  bottom: 0;
  cursor: url("https://exhentai.org/img/b.png"), auto;
}
.p-tooltip {
  border-bottom: 1px dotted black;
}
.p-tooltip .p-tooltiptext {
  visibility: hidden;
  width: 100%;
  top: 0px;
  right: 0px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  font-size: small;
  white-space: normal;
}
.p-tooltip:hover .p-tooltiptext {
  visibility: visible;
}
.page-loading {
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #333333a6;
}
.page-loading-text {
  color: #ffffff;
  font-size: 6rem;
}
@keyframes rotate {
	100% {
		transform: rotate(1turn);
	}
}
.border-ani {
	position: relative;
	z-index: 0;
	overflow: hidden;
	padding: 2rem;
}
.border-ani::before {
	content: '';
	position: absolute;
	z-index: -2;
	left: -50%;
	top: -50%;
	width: 200%;
	height: 200%;
	background-color: #fff;
	animation: rotate 4s linear infinite;
}
.border-ani::after {
	content: '';
	position: absolute;
	z-index: -1;
	left: 6px;
	top: 6px;
	width: calc(100% - 16px);
	height: calc(100% - 16px);
	background: #333;
}
.overlay-tip {
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 10;
  width: 2rem;
  height: 1rem;
  border-radius: 10%;
  border: 1px solid #333;
  color: white;
  background-color: #959595d1;
  line-height: 1rem;
  font-size: 1rem;
  text-align: center;
  font-weight: bold;
}
.lightgreen { color: #90ea90; }
.p-minify:not(:hover),
.p-minify:not(:hover) .lightgreen {
  color: #00000000 !important;
  background-color: #00000000 !important;
  transition: color 0.5s ease-in-out, background-color 0.3s ease-in-out;
}
.p-minify:not(:hover) .b-main .b-m-page {
  order: ${conf.pageHelperAbLeft !== "unset" ? -2 : 1};
}
.p-minify:not(:hover) #p-curr-page,
.p-minify:not(:hover) #p-total,
.p-minify:not(:hover) #p-slash-1 {
  color: #fff !important;
  background-color: #333333aa !important;
}
.p-minify:not(:hover) #p-curr-page {
  color: #ffc005 !important;
}
.p-minify:not(:hover) #auto-page-btn {
  border: 1px solid #00000000 !important;
}
`
  style.textContent = css;
  document.head.appendChild(style);
  return style;
}
