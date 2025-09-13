import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trại Phước Hội 2" },
    { name: "description", content: "Welcome to Trại Phước Hội 2" },
  ];
}

export default function Home() {
  return <Welcome />;
}
