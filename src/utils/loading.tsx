export const loading = (str: string, threshold = 30000) => {
  let div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = `<span class="icon"></span>${str}<style>
    .loading{
        width:300px;
        min-height:80px;
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
        transform: translate(-50%, -50%) rotate(0deg);
      }

      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
    </style>`;

  const body = document.querySelector('body');
  body?.appendChild(div);

  const remove = () => {
    if (!div) return;
    body?.removeChild(div);
    div = null;
  };

  const timer = setTimeout(() => {
    remove();
  }, threshold);

  const close = () => {
    clearTimeout(timer);
    remove();
  };

  return close;
};
