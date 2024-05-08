export const loading = (
  str: string,
  threshold = 30000,
  mask = true,
  minThreshold = 300,
  root = document.body
) => {
  let div = document.createElement('div');
  let lock = true;
  div.className = 'loading' + (mask ? ' mask' : '');
  div.innerHTML = `<span class="icon"></span>${str}<style>
    .loading{
        width: fit-content;
        max-width: 300px;
        min-width: 100px;
        min-height: 60px;
        height: fit-content;
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        font-size:18px;
        box-shadow: 0px 0px 30px rgba(0,0,0,0.3);
        color: #fff;
        background-color: rgb(0 0 0 / 70%);
        backdrop-filter: blur(5px);
        border-radius: 10px;
        display:flex;
        justify-content:center;
        align-items:center;
        z-index: 100000;
        padding: 10px 20px;
    }

    .loading.mask {
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.3);
          z-index: -1;
          width: 100vw;
          height: 100vh;
        }
    }

    .loading .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        animation: spin 1.5s linear infinite;
        z-index: 2;
        margin-right: 8px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
    </style>`;

  root?.appendChild(div);

  setTimeout(() => {
    lock = false;
  }, minThreshold);

  const remove = () => {
    if (!div) return;
    root?.removeChild(div);
    div = null;
  };

  const timer = setTimeout(() => {
    remove();
  }, threshold);

  const close = () => {
    if (lock) {
      setTimeout(close, minThreshold);
    } else {
      clearTimeout(timer);
      remove();
    }
  };

  return close;
};
