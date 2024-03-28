// import { FilterManager } from '@/mosaic/FilterManager';
//
// export const GenerateWorker = new Worker('./GenerateWorker.ts', { type: 'module' });
//
// export enum WorkerMessage {
//   Generate,
// }
//
// onmessage = (m) => {
//   const type = m.data.type as WorkerMessage;
//   const { value } = m.data;
//
//   console.debug(m);
//
//   switch (type) {
//     case WorkerMessage.Generate:
//       FilterManager.generatePreviewImages();
//       break;
//   }
// };
//
// // generateWorker.postMessage({ type: 'f' });
