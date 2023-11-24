import type { Currency } from '../../sdk';
import type { V3Pool } from '../../../vo';
import type { BaseRoute } from '../types';
export declare function computeAllRoutes(input: Currency, output: Currency, candidatePools: V3Pool[], maxHops?: number): BaseRoute[];
