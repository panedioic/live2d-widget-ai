# <center>Live2d-Widget-ai 

---

## 1 介绍

在网页中添加萌萌的 Live2D 看板娘。支持 Moc3 格式，支持基于 API 的对话功能。

项目基于 Typescript 构建，支持响应来自大模型的指令（还没做）。项目对应后端见【[panedioic/live2d-widget-ai-backend](https://github.com/panedioic/live2d-widget-ai-backend)】。

> [!NOTE]
> + （1）此项目是基于【[letere-gzj/live2d-widget-v3](https://github.com/letere-gzj/live2d-widget-v3)】项目的二次开发
> + （2）也就是基于【[stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget)】项目的三次开发
> + （3）原本live2d-widget只能渲染moc模型，无法渲染moc3模型，于是此项目在原版的架构上，对接了新版的Cubism SDK for Web(sdk当前版本v5)，来渲染moc3模型
> + （4）因为是基于live2d-widget项目的二次开发，使用体验上与原版的live2d-widget相差不大，基本的功能都有所保留

> [!TIP]
>  + 由于项目加入了大模型对话功能，需要对应的后端来保存 APIKey，并且为了针对大模型给出的指令在前端的执行，因此本项目经过高度的定制化，并不能直接迁移至其他博客使用后。
>  + 需要迁移或使用其他 API 供应商可以自行修改源码。
>  + 本项目的配套后端为 【[panedioic/live2d-widget-ai-backend](https://github.com/panedioic/live2d-widget-ai-backend)】

> [!WARNING]
>  + 项目内有两个 Live2D 模型文件：
>  + Seina 为作者本人所用虚拟形象，版权归本人所属。未经许可禁止挪作他用。
>  + Mao 为 Live2D 官方示例模型，版权归属 Live2D Inc. 会在项目 bug 修复后移出仓库。


## 2 推荐项目
+ 如果你需要moc模型与moc3模型都能适配的技术，个人推荐使用以下项目
+ [oh-my-live2d/oh-my-live2d](https://github.com/oh-my-live2d/oh-my-live2d)
+ [Konata09/Live2dOnWeb](https://github.com/Konata09/Live2dOnWeb)

---

## 3 参考文献
+ [笔记：live2d4.0 sdk 博客园网页动画](https://blog.csdn.net/weixin_44128558/article/details/104792345)
+ [live2d（Web SDK 4.x）Web看板娘进阶](https://blog.csdn.net/qq_37735413/article/details/119413744)
+ [live2d web笔记之一：官方SDK尝试](https://blog.csdn.net/weixin_42578046/article/details/123509508)
