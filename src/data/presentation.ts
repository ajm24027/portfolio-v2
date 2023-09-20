type Social = {
  label: string;
  link: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
  profile?: string;
};

const presentation: Presentation = {
  mail: "anthony.john.medina@gmail.com",
  title: "Hi, I’m Anthony 👋🏻",
  // profile: "/profile.webp",
  description:
    "I’m passionate about building captivating products that leave a lasting impact. *I bring a curious and can do attitude to teams I work with*. And I'm bridging the gap between developers and designers by merging *empathy with technical expertise* in end-to-end application technologies.",
  socials: [
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/anthonyjmedina/",
    },
    {
      label: "Bento",
      link: "https://bento.me/anthony-medina",
    },
    {
      label: "Github",
      link: "https://github.com/ajm24027",
    },
  ],
};

export default presentation;
