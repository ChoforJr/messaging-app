import App from "./App Components/App";
import HomePage from "./HomePage Components/HomePage";
import { PeopleChats, GroupChats } from "./Chats Components/Chats";
import { ExplorePeople, ExploreGroups } from "./Explore Components/Explore";
import Account from "./Account Components/Account";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    // This is a catch-all for errors that occur within the <App /> component or its children.
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: "chats/people", element: <PeopleChats /> },
      { path: "chats/groups", element: <GroupChats /> },
      { path: "explore/people", element: <ExplorePeople /> },
      { path: "explore/groups", element: <ExploreGroups /> },
      { path: "account", element: <Account /> },
    ],
  },
];

export default routes;
