import * as Dist from '../../dist/index.esm';
import * as Src from '../../src';

const Target: typeof Src = process.env.NODE_ENV === 'development' ? Src : Dist;

export const {
  notice,
  toast,
  dodoStorage,
  loading,
  Button,
  Title,
  Header,
  Icon,
  Page,
  Input,
  Textarea,
  Modal,
  Form,
  Select,
  Space
} = Target;
