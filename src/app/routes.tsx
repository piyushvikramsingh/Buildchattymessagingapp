import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Chats from "./pages/Chats";
import Status from "./pages/Status";
import Calls from "./pages/Calls";
import Communities from "./pages/Communities";
import Settings from "./pages/Settings";
import ChatView from "./pages/ChatView";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Chats },
      { path: "chats", Component: Chats },
      { path: "chat/:chatId", Component: ChatView },
      { path: "status", Component: Status },
      { path: "calls", Component: Calls },
      { path: "communities", Component: Communities },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
