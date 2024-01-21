export const toast = (str: string) => {
  const div = document.createElement('div');
  div.className = 'loading';
  div.innerHTML = `${str}<style>
    .toast{
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
    </style>`;

  const body = document.querySelector('body');
  body?.appendChild(div);
  setTimeout(() => {
    body?.removeChild(div);
  }, 1500);
};
