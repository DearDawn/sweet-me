import './index.less';

interface NoticeItem {
  title?: string
  duration?: number
  type?: 'info' | 'success' | 'error'
  id: number
  dom: HTMLDivElement
}

class Notice {
  root: HTMLElement;
  noticeList: NoticeItem[];
  counter: number;
  constructor () {
    this.root = document.body;
    this.noticeList = [];
    this.counter = 0;
  }

  init (config?: Pick<NoticeItem, 'title' | 'duration' | 'type'>) {
    const { title = '这是一个提示', type = 'info', duration = 1500, ...rest } = config ?? {};

    const dom = document.createElement('div');
    dom.className = 'dodo-notice ' + type;
    dom.innerHTML = `<div class="dodo-notice-title">${type}${title}</div>`;

    this.addNotice({ dom, title, type, duration, ...rest });
  }

  refactor () {
    this.noticeList.forEach((notice, id) => {
      notice.dom.style.top = `${id * 80 + 20}px`;
    });
  }

  addNotice (noticeItem: Omit<NoticeItem, 'id'>) {
    const { dom, duration } = noticeItem;
    const id = this.counter;
    this.counter += 1;
    dom.style.top = `${this.noticeList.length * 80 + 20}px`;
    this.noticeList.push({ ...noticeItem, id });
    this.root.appendChild(dom);
    setTimeout(() => {
      this.removeNotice(id);
    }, duration);
  }

  removeNotice (id: number) {
    const index = this.noticeList.findIndex((it) => it.id === id);
    const noticeItem = this.noticeList[index];

    if (!noticeItem || !noticeItem.dom || !noticeItem.duration) return;

    this.noticeList.splice(index, 1);
    this.root.removeChild(noticeItem.dom);
    this.refactor();
  }

  info (title = '', duration = 1500) {
    this.init({ title, duration });
  }

  success (title = '', duration = 1500) {
    this.init({ title, duration, type: 'success' });
  }

  error (title = '', duration = 1500) {
    this.init({ title, duration, type: 'error' });
  }
}

const notice = new Notice();
export { notice };