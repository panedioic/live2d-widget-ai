/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from './lappdelegate';
import * as LAppDefine from './lappdefine';
import { LAppGlManager } from './lappglmanager';
import { LAppLive2DManager } from './lapplive2dmanager';

/**
 * ブラウザロード後の処理
 */
window.addEventListener(
  'load',
  (): void => {
    // 参数初始化
    const defineConfig = new LAppDefine.DefineConfig('../../Resources/', [
      'Wanko'
    ]);
    LAppDefine.initDefine(defineConfig);
    // Initialize WebGL and create the application instance
    if (
      !LAppGlManager.getInstance() ||
      !LAppDelegate.getInstance().initialize()
    ) {
      return;
    }

    LAppDelegate.getInstance().run();
  },
  { passive: true }
);

/**
 * 終了時の処理
 */
window.addEventListener(
  'beforeunload',
  (): void => LAppDelegate.releaseInstance(),
  { passive: true }
);

/**
 * Process when changing screen size.
 */
window.addEventListener(
  'resize',
  () => {
    if (LAppDefine.CanvasSize === 'auto') {
      LAppDelegate.getInstance().onResize();
    }
  },
  { passive: true }
);

const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  console.log(4566);
  LAppLive2DManager.getInstance().loadModel('Rice');
});

// declare global {
//   interface Window {
//     live2dv4: any;
//     downloadCap: any;
//     webpReady: any;
//   }
// }
// window.addEventListener('load', () => {
//   fetch(
//     'https://cdn.jsdelivr.net/gh/letere-gzj/hugo-static-resource@main/live2d/model_list.json'
//   ).then(data => {
//     console.log(data.json());
//   });
// });
// window.live2dv4 = window.live2dv4 || {};
// window.live2dv4.init = (cdnPath: string): void => {
//
// };
