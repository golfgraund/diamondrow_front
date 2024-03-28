import { createEvent, createStore, forward } from 'effector';

export enum StepTypes {
  Waiting,
  Preview,
  Generate,
}

export const $stepTypeStore = createStore<StepTypes>(StepTypes.Waiting);
export const $setStepType = createEvent<StepTypes>();

forward({
  from: $setStepType,
  to: $stepTypeStore,
});
