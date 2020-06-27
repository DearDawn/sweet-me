"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var TabBar = function (_a) {
    var tablist = _a.tablist, activeTab = _a.activeTab, _b = _a.onTabChange, onTabChange = _b === void 0 ? function () { } : _b, style = _a.style;
    var _c = react_1.useState(0), active = _c[0], setActive = _c[1];
    react_1.useEffect(function () {
        setActive(activeTab);
    }, [activeTab]);
    return (<div className='tab-bar' style={style}>
      {tablist.map(function (item, index) {
        return (<div className={classnames_1.default({ 'tab-item': true, active: active === index })} key={index} onClick={function () {
            setActive(index);
            onTabChange(index);
        }}>
            {item}
          </div>);
    })}
      <style jsx>{"\n        .tab-bar {\n          width: 100%;\n          height: 50px;\n          background-color: #fff;\n          display: flex;\n          color: #000;\n          border: 1px solid #000;\n          cursor:pointer;\n        }\n        .tab-item {\n          height: 100%;\n          flex: 1;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          border-right: 1px solid black;\n        }\n        .tab-item:nth-last-child(2) {\n          border: none;\n        }\n        .tab-item:not(.active):hover{\n            background-color:#eee;\n        }\n        .tab-item:not(.active):active{\n            background-color:#aaa;\n        }\n        .active {\n          background-color: #000000;\n          color: #ffffff;\n        }\n      "}</style>
    </div>);
};
exports.default = TabBar;
