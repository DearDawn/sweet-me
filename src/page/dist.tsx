import * as Dist from '../../dist/index.esm'
import * as Src from '../../src'

const Target: typeof Dist = process.env.NODE_ENV === 'development' ? Src : Dist;

console.log('[dodo] ', 'process.env.NODE_ENV', process.env.NODE_ENV);
export const { notice, toast, Button, ...rest } = Target;
