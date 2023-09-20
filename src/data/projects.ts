export type Project = {
  title: string;
  techs: string[];
  link: string;
  isComingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "AI Chatbot | ChemChat",
    techs: ["ReactJS", "Material UI", "JSON Web Token"],
    link: "https://chemchat.surge.sh/",
  },
  {
    title: "Discussion Forum | Zephyr",
    techs: ["Python", "Django", "PostgreSQL"],
    link: "https://zephyr1.fly.dev/",
  },
  {
    title: "Event Management | GameNight - v2",
    techs: ["ReactJS", "TypeScript", "UX Design"],
    link: "/",
    isComingSoon: true,
  },
];

export default projects;
