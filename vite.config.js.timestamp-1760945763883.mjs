// vite.config.js
import path from "path";
import { sveltekit } from "file:///D:/Project/NodeJS/Wish%20Simulator/Genshin-Impact-Wish-Simulator/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { VitePWA } from "file:///D:/Project/NodeJS/Wish%20Simulator/Genshin-Impact-Wish-Simulator/node_modules/vite-plugin-pwa/dist/index.mjs";
import { imagetools } from "file:///D:/Project/NodeJS/Wish%20Simulator/Genshin-Impact-Wish-Simulator/node_modules/vite-imagetools/dist/index.js";
import { plugin as MdPlugin } from "file:///D:/Project/NodeJS/Wish%20Simulator/Genshin-Impact-Wish-Simulator/node_modules/vite-plugin-markdown/dist/index.js";
import { config as envConfig } from "file:///D:/Project/NodeJS/Wish%20Simulator/Genshin-Impact-Wish-Simulator/node_modules/dotenv/lib/main.js";
var __vite_injected_original_dirname = "D:\\Project\\NodeJS\\Wish Simulator\\Genshin-Impact-Wish-Simulator";
envConfig();
var { VITE_APP_TITLE, VITE_DESCRIPTION, VITE_HOST } = process.env;
var iconSize = [16, 32, 72, 96, 128, 144, 152, 192, 256, 384, 512];
var icons = iconSize.map((size) => {
  const iconObj = {
    src: `./icons/icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png"
  };
  if (size === 192)
    iconObj.purpose = "maskable";
  if (size === 384)
    iconObj.purpose = "any";
  return iconObj;
});
var screenshots = [
  {
    sizes: "591x1280",
    src: "https://user-images.githubusercontent.com/13815468/200561929-52a32a57-bd2c-473c-b25d-dcd8877ce253.jpg",
    label: "Section 1",
    type: "image/jpg"
  },
  {
    sizes: "591x1280",
    src: "https://user-images.githubusercontent.com/13815468/200561938-c8429695-d7fe-4cf2-8391-d3e78daa789c.jpg",
    label: "Section 2",
    type: "image/jpg"
  },
  {
    sizes: "591x1280",
    src: "https://user-images.githubusercontent.com/13815468/200561909-2f965a06-6cdb-45a3-92c9-646546d514f8.jpg",
    label: "Section 3",
    type: "image/jpg"
  },
  {
    sizes: "591x1280",
    src: "https://user-images.githubusercontent.com/13815468/200561919-b76b11e2-dbda-4534-845e-48714f60fc40.jpg",
    label: "Section 4",
    type: "image/jpg"
  }
];
var manifest = {
  orientation: "landscape",
  name: VITE_APP_TITLE,
  description: VITE_DESCRIPTION,
  id: "wishsimulator.app",
  short_name: "WishSimulator.App",
  theme_color: "#ffffff",
  background_color: "#ffffff",
  display: "fullscreen",
  display_override: [
    "fullscreen",
    "window-controls-overlay",
    "standalone",
    "minimal-ui",
    "browser"
  ],
  scope: "/",
  scope_extensions: [{ origin: "wishsimulator.app" }, { origin: "wishsimulator.pages.dev" }],
  start_url: "/?pwasc=homescreen",
  categories: ["games", "utilities"],
  dir: "auto",
  icons,
  screenshots,
  handle_links: "preferred",
  prefer_related_applications: true,
  launch_handler: {
    client_mode: ["focus-existing", "auto"]
  },
  related_applications: [
    {
      platform: "webapp",
      url: `${VITE_HOST}/appmanifest.json`
    },
    {
      platform: "play",
      url: "https://play.google.com/store/apps/details?id=twa.wishsimulator.app",
      id: "twa.wishsimulator.app"
    }
  ],
  edge_side_panel: {
    preferred_width: 412
  }
};
var config = {
  plugins: [
    imagetools(),
    sveltekit(),
    MdPlugin({ mode: "html" }),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      outDir: ".vercel/output/static",
      filename: "sw.js",
      registerType: "prompt",
      manifestFilename: "appmanifest.json",
      manifest
    })
  ],
  resolve: {
    alias: {
      $post: path.resolve(__vite_injected_original_dirname, "./src/post"),
      "@images": path.resolve(__vite_injected_original_dirname, "./src/images")
    }
  },
  build: {
    chunkSizeWarningLimit: 350,
    target: ["es2020"]
  }
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0XFxcXE5vZGVKU1xcXFxXaXNoIFNpbXVsYXRvclxcXFxHZW5zaGluLUltcGFjdC1XaXNoLVNpbXVsYXRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdFxcXFxOb2RlSlNcXFxcV2lzaCBTaW11bGF0b3JcXFxcR2Vuc2hpbi1JbXBhY3QtV2lzaC1TaW11bGF0b3JcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3QvTm9kZUpTL1dpc2glMjBTaW11bGF0b3IvR2Vuc2hpbi1JbXBhY3QtV2lzaC1TaW11bGF0b3Ivdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJztcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XHJcbmltcG9ydCB7IGltYWdldG9vbHMgfSBmcm9tICd2aXRlLWltYWdldG9vbHMnO1xyXG5pbXBvcnQgeyBwbHVnaW4gYXMgTWRQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1tYXJrZG93bic7XHJcbmltcG9ydCB7IGNvbmZpZyBhcyBlbnZDb25maWcgfSBmcm9tICdkb3RlbnYnO1xyXG5cclxuZW52Q29uZmlnKCk7XHJcbmNvbnN0IHsgVklURV9BUFBfVElUTEUsIFZJVEVfREVTQ1JJUFRJT04sIFZJVEVfSE9TVCB9ID0gcHJvY2Vzcy5lbnY7XHJcbmNvbnN0IGljb25TaXplID0gWzE2LCAzMiwgNzIsIDk2LCAxMjgsIDE0NCwgMTUyLCAxOTIsIDI1NiwgMzg0LCA1MTJdO1xyXG5jb25zdCBpY29ucyA9IGljb25TaXplLm1hcCgoc2l6ZSkgPT4ge1xyXG5cdGNvbnN0IGljb25PYmogPSB7XHJcblx0XHRzcmM6IGAuL2ljb25zL2ljb24tJHtzaXplfXgke3NpemV9LnBuZ2AsXHJcblx0XHRzaXplczogYCR7c2l6ZX14JHtzaXplfWAsXHJcblx0XHR0eXBlOiAnaW1hZ2UvcG5nJ1xyXG5cdH07XHJcblx0aWYgKHNpemUgPT09IDE5MikgaWNvbk9iai5wdXJwb3NlID0gJ21hc2thYmxlJztcclxuXHRpZiAoc2l6ZSA9PT0gMzg0KSBpY29uT2JqLnB1cnBvc2UgPSAnYW55JztcclxuXHRyZXR1cm4gaWNvbk9iajtcclxufSk7XHJcblxyXG5jb25zdCBzY3JlZW5zaG90cyA9IFtcclxuXHR7XHJcblx0XHRzaXplczogJzU5MXgxMjgwJyxcclxuXHRcdHNyYzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEzODE1NDY4LzIwMDU2MTkyOS01MmEzMmE1Ny1iZDJjLTQ3M2MtYjI1ZC1kY2Q4ODc3Y2UyNTMuanBnJyxcclxuXHRcdGxhYmVsOiAnU2VjdGlvbiAxJyxcclxuXHRcdHR5cGU6ICdpbWFnZS9qcGcnXHJcblx0fSxcclxuXHR7XHJcblx0XHRzaXplczogJzU5MXgxMjgwJyxcclxuXHRcdHNyYzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEzODE1NDY4LzIwMDU2MTkzOC1jODQyOTY5NS1kN2ZlLTRjZjItODM5MS1kM2U3OGRhYTc4OWMuanBnJyxcclxuXHRcdGxhYmVsOiAnU2VjdGlvbiAyJyxcclxuXHRcdHR5cGU6ICdpbWFnZS9qcGcnXHJcblx0fSxcclxuXHR7XHJcblx0XHRzaXplczogJzU5MXgxMjgwJyxcclxuXHRcdHNyYzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEzODE1NDY4LzIwMDU2MTkwOS0yZjk2NWEwNi02Y2RiLTQ1YTMtOTJjOS02NDY1NDZkNTE0ZjguanBnJyxcclxuXHRcdGxhYmVsOiAnU2VjdGlvbiAzJyxcclxuXHRcdHR5cGU6ICdpbWFnZS9qcGcnXHJcblx0fSxcclxuXHR7XHJcblx0XHRzaXplczogJzU5MXgxMjgwJyxcclxuXHRcdHNyYzogJ2h0dHBzOi8vdXNlci1pbWFnZXMuZ2l0aHVidXNlcmNvbnRlbnQuY29tLzEzODE1NDY4LzIwMDU2MTkxOS1iNzZiMTFlMi1kYmRhLTQ1MzQtODQ1ZS00ODcxNGY2MGZjNDAuanBnJyxcclxuXHRcdGxhYmVsOiAnU2VjdGlvbiA0JyxcclxuXHRcdHR5cGU6ICdpbWFnZS9qcGcnXHJcblx0fVxyXG5dO1xyXG5cclxuY29uc3QgbWFuaWZlc3QgPSB7XHJcblx0b3JpZW50YXRpb246ICdsYW5kc2NhcGUnLFxyXG5cdG5hbWU6IFZJVEVfQVBQX1RJVExFLFxyXG5cdGRlc2NyaXB0aW9uOiBWSVRFX0RFU0NSSVBUSU9OLFxyXG5cdGlkOiAnd2lzaHNpbXVsYXRvci5hcHAnLFxyXG5cdHNob3J0X25hbWU6ICdXaXNoU2ltdWxhdG9yLkFwcCcsXHJcblx0dGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcclxuXHRiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXHJcblx0ZGlzcGxheTogJ2Z1bGxzY3JlZW4nLFxyXG5cdGRpc3BsYXlfb3ZlcnJpZGU6IFtcclxuXHRcdCdmdWxsc2NyZWVuJyxcclxuXHRcdCd3aW5kb3ctY29udHJvbHMtb3ZlcmxheScsXHJcblx0XHQnc3RhbmRhbG9uZScsXHJcblx0XHQnbWluaW1hbC11aScsXHJcblx0XHQnYnJvd3NlcidcclxuXHRdLFxyXG5cdHNjb3BlOiAnLycsXHJcblx0c2NvcGVfZXh0ZW5zaW9uczogW3sgb3JpZ2luOiAnd2lzaHNpbXVsYXRvci5hcHAnIH0sIHsgb3JpZ2luOiAnd2lzaHNpbXVsYXRvci5wYWdlcy5kZXYnIH1dLFxyXG5cdHN0YXJ0X3VybDogJy8/cHdhc2M9aG9tZXNjcmVlbicsXHJcblx0Y2F0ZWdvcmllczogWydnYW1lcycsICd1dGlsaXRpZXMnXSxcclxuXHRkaXI6ICdhdXRvJyxcclxuXHRpY29ucyxcclxuXHRzY3JlZW5zaG90cyxcclxuXHRoYW5kbGVfbGlua3M6ICdwcmVmZXJyZWQnLFxyXG5cdHByZWZlcl9yZWxhdGVkX2FwcGxpY2F0aW9uczogdHJ1ZSxcclxuXHRsYXVuY2hfaGFuZGxlcjoge1xyXG5cdFx0Y2xpZW50X21vZGU6IFsnZm9jdXMtZXhpc3RpbmcnLCAnYXV0byddXHJcblx0fSxcclxuXHRyZWxhdGVkX2FwcGxpY2F0aW9uczogW1xyXG5cdFx0e1xyXG5cdFx0XHRwbGF0Zm9ybTogJ3dlYmFwcCcsXHJcblx0XHRcdHVybDogYCR7VklURV9IT1NUfS9hcHBtYW5pZmVzdC5qc29uYFxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0cGxhdGZvcm06ICdwbGF5JyxcclxuXHRcdFx0dXJsOiAnaHR0cHM6Ly9wbGF5Lmdvb2dsZS5jb20vc3RvcmUvYXBwcy9kZXRhaWxzP2lkPXR3YS53aXNoc2ltdWxhdG9yLmFwcCcsXHJcblx0XHRcdGlkOiAndHdhLndpc2hzaW11bGF0b3IuYXBwJ1xyXG5cdFx0fVxyXG5cdF0sXHJcblx0ZWRnZV9zaWRlX3BhbmVsOiB7XHJcblx0XHRwcmVmZXJyZWRfd2lkdGg6IDQxMlxyXG5cdH1cclxufTtcclxuXHJcbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ30gKi9cclxuY29uc3QgY29uZmlnID0ge1xyXG5cdHBsdWdpbnM6IFtcclxuXHRcdGltYWdldG9vbHMoKSxcclxuXHRcdHN2ZWx0ZWtpdCgpLFxyXG5cdFx0TWRQbHVnaW4oeyBtb2RlOiAnaHRtbCcgfSksXHJcblx0XHRWaXRlUFdBKHtcclxuXHRcdFx0c3RyYXRlZ2llczogJ2luamVjdE1hbmlmZXN0JyxcclxuXHRcdFx0c3JjRGlyOiAnc3JjJyxcclxuXHRcdFx0b3V0RGlyOiAnLnZlcmNlbC9vdXRwdXQvc3RhdGljJyxcclxuXHRcdFx0ZmlsZW5hbWU6ICdzdy5qcycsXHJcblx0XHRcdHJlZ2lzdGVyVHlwZTogJ3Byb21wdCcsXHJcblx0XHRcdG1hbmlmZXN0RmlsZW5hbWU6ICdhcHBtYW5pZmVzdC5qc29uJyxcclxuXHRcdFx0bWFuaWZlc3RcclxuXHRcdH0pXHJcblx0XSxcclxuXHRyZXNvbHZlOiB7XHJcblx0XHRhbGlhczoge1xyXG5cdFx0XHQkcG9zdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3Bvc3QnKSxcclxuXHRcdFx0J0BpbWFnZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaW1hZ2VzJylcclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRjaHVua1NpemVXYXJuaW5nTGltaXQ6IDM1MCxcclxuXHRcdHRhcmdldDogWydlczIwMjAnXVxyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3WCxPQUFPLFVBQVU7QUFDelksU0FBUyxpQkFBaUI7QUFDMUIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsVUFBVSxnQkFBZ0I7QUFDbkMsU0FBUyxVQUFVLGlCQUFpQjtBQUxwQyxJQUFNLG1DQUFtQztBQU96QyxVQUFVO0FBQ1YsSUFBTSxFQUFFLGdCQUFnQixrQkFBa0IsVUFBVSxJQUFJLFFBQVE7QUFDaEUsSUFBTSxXQUFXLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxHQUFHO0FBQ25FLElBQU0sUUFBUSxTQUFTLElBQUksQ0FBQyxTQUFTO0FBQ3BDLFFBQU0sVUFBVTtBQUFBLElBQ2YsS0FBSyxnQkFBZ0IsUUFBUTtBQUFBLElBQzdCLE9BQU8sR0FBRyxRQUFRO0FBQUEsSUFDbEIsTUFBTTtBQUFBLEVBQ1A7QUFDQSxNQUFJLFNBQVM7QUFBSyxZQUFRLFVBQVU7QUFDcEMsTUFBSSxTQUFTO0FBQUssWUFBUSxVQUFVO0FBQ3BDLFNBQU87QUFDUixDQUFDO0FBRUQsSUFBTSxjQUFjO0FBQUEsRUFDbkI7QUFBQSxJQUNDLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNQO0FBQUEsRUFDQTtBQUFBLElBQ0MsT0FBTztBQUFBLElBQ1AsS0FBSztBQUFBLElBQ0wsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUNBO0FBQUEsSUFDQyxPQUFPO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUDtBQUFBLEVBQ0E7QUFBQSxJQUNDLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNQO0FBQ0Q7QUFFQSxJQUFNLFdBQVc7QUFBQSxFQUNoQixhQUFhO0FBQUEsRUFDYixNQUFNO0FBQUEsRUFDTixhQUFhO0FBQUEsRUFDYixJQUFJO0FBQUEsRUFDSixZQUFZO0FBQUEsRUFDWixhQUFhO0FBQUEsRUFDYixrQkFBa0I7QUFBQSxFQUNsQixTQUFTO0FBQUEsRUFDVCxrQkFBa0I7QUFBQSxJQUNqQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDQSxPQUFPO0FBQUEsRUFDUCxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsb0JBQW9CLEdBQUcsRUFBRSxRQUFRLDBCQUEwQixDQUFDO0FBQUEsRUFDekYsV0FBVztBQUFBLEVBQ1gsWUFBWSxDQUFDLFNBQVMsV0FBVztBQUFBLEVBQ2pDLEtBQUs7QUFBQSxFQUNMO0FBQUEsRUFDQTtBQUFBLEVBQ0EsY0FBYztBQUFBLEVBQ2QsNkJBQTZCO0FBQUEsRUFDN0IsZ0JBQWdCO0FBQUEsSUFDZixhQUFhLENBQUMsa0JBQWtCLE1BQU07QUFBQSxFQUN2QztBQUFBLEVBQ0Esc0JBQXNCO0FBQUEsSUFDckI7QUFBQSxNQUNDLFVBQVU7QUFBQSxNQUNWLEtBQUssR0FBRztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsTUFDQyxVQUFVO0FBQUEsTUFDVixLQUFLO0FBQUEsTUFDTCxJQUFJO0FBQUEsSUFDTDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLGlCQUFpQjtBQUFBLElBQ2hCLGlCQUFpQjtBQUFBLEVBQ2xCO0FBQ0Q7QUFHQSxJQUFNLFNBQVM7QUFBQSxFQUNkLFNBQVM7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLFNBQVMsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUFBLElBQ3pCLFFBQVE7QUFBQSxNQUNQLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLGNBQWM7QUFBQSxNQUNkLGtCQUFrQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRCxDQUFDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sT0FBTyxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQzNDLFdBQVcsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxJQUNsRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNOLHVCQUF1QjtBQUFBLElBQ3ZCLFFBQVEsQ0FBQyxRQUFRO0FBQUEsRUFDbEI7QUFDRDtBQUVBLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
