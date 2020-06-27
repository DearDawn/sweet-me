"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toast = function (str) {
    var div = document.createElement('div');
    div.className = 'toast';
    div.innerHTML = str + "<style>\n  .toast{\n      width:300px;\n      height:130px;\n      position:fixed;\n      top:0;\n      bottom:0;\n      left:0;\n      right:0;\n      margin:auto;\n      background-color:white;\n      font-size:24px;\n      box-shadow: 0px 0px 30px rgba(0,0,0,0.5);\n      border-radius: 10px;\n      display:flex;\n      justify-content:center;\n      align-items:center;\n  }\n  </style>";
    var body = document.querySelector('body');
    body === null || body === void 0 ? void 0 : body.appendChild(div);
    setTimeout(function () {
        body === null || body === void 0 ? void 0 : body.removeChild(div);
    }, 1500);
};
exports.default = toast;
