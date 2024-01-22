import * as Dist from '../../dist/index.esm';
import * as Src from '../../src';

const Target: typeof Dist = process.env.NODE_ENV === 'development' ? Src : Dist;

export const { notice, toast, Button, Title, Header, Icon, Page, Input, ...rest } = Target;
