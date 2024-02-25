export const toast = (str: string) => {
  const div = document.createElement('div');
  div.className = 'toast';
  div.innerText = str;
  const style = document.createElement('style');
  style.innerHTML = `.toast{
    width:300px;
    min-height:80px;
    height: fit-content;
    position:absolute;
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
    padding: 5px 10px;
    box-sizing: border-box;
    z-index: 100000;
  }`;
  div.appendChild(style);
  const body = document.querySelector('body');
  body?.appendChild(div);
  setTimeout(() => {
    body?.removeChild(div);
  }, 1500);
};
