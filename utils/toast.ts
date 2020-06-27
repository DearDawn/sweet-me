const toast = (str: string) => {
    const div = document.createElement('div');
    div.className='toast';
    div.innerHTML = `${str}<style>
    .toast{
        width:300px;
        height:130px;
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
        background-color:white;
        font-size:24px;
        box-shadow: 0px 0px 30px rgba(0,0,0,0.5);
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
  
  export default toast;
  
