import * as Dist from '../../dist/index.esm';
import * as Src from '../../src';

const Target: typeof Src = process.env.NODE_ENV === 'development' ? Src : Dist;

export const {
  notice,
  toast,
  storage,
  loading,
  Button,
  Title,
  Header,
  Icon,
  Page,
  Input,
  InputFile,
  Textarea,
  Modal,
  Form,
  Select,
  Space
} = Target;
