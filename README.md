# 潘子恺个人网站

React + Vite 中英双语个人履历网站。

网站地址：https://panzikai9-creator.github.io/zikai-pan-website/

## 本地开发

使用 Node.js 24 和项目指定的 pnpm 11.25.0：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## 检查和构建

```sh
pnpm typecheck
pnpm build
```

## 发布

推送到 `main` 分支后，GitHub Actions 会执行类型检查、构建并部署 `dist/` 到 GitHub Pages。也可以在 Actions 页面手动运行 `Deploy GitHub Pages`。

仓库的 Settings → Pages → Source 应设为 GitHub Actions。
