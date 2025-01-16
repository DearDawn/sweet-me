import { useEffect, useRef } from "react";
import { sweetMeConfig } from "../utils/config";

/** 返回时拦截并执行操作 */
export const useBackIntercept = ({ disabled = false, interceptStart = false, onBack }: {
  /** 是否禁用 */
  disabled?: boolean,
  /** 是否开始拦截, 如弹窗弹出时 */
  interceptStart?: boolean,
  /** 返回时拦截并执行操作 */
  onBack?: () => void;
}) => {
  const pushedRef = useRef(false);
  const { disableBackIntercept } = sweetMeConfig.globalConfig;

  useEffect(() => {
    if (disabled || disableBackIntercept) return;

    if (interceptStart) {
      // 弹窗打开时，添加一条历史记录
      window.history.pushState({}, '', window.location.href);
      pushedRef.current = true;

      // 监听返回操作
      const handlePopstate = () => {
        if (interceptStart) {
          onBack?.(); // 关闭弹窗
        } else if (pushedRef.current) {
          window.history.back(); // 返回上一页
        }

        pushedRef.current = false;
      };

      window.addEventListener('popstate', handlePopstate);

      // 清理函数
      return () => {
        window.removeEventListener('popstate', handlePopstate);
      };
    } else {
      if (pushedRef.current) {
        window.history.back();
        pushedRef.current = false;
      }
    }
  }, [disableBackIntercept, disabled, interceptStart, onBack]);

};