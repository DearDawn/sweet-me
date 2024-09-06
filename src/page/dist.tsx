import * as Dist from '../../dist/index.esm';
import * as Src from '../../src';

const Target: typeof Src = process.env.NODE_ENV === 'development' ? Src : Dist;

export const {
  notice,
  toast,
  Storage,
  loading,
  Button,
  Title,
  Header,
  Icon,
  Page,
  Input,
  InputImage,
  InputFile,

  Textarea,
  Modal,
  showModal,
  Form,
  Select,
  Slider,
  Radio,
  Space,
  Image,
  MdViewer,
  showMdViewer,
  Tag
} = Target;
