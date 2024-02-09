---
title: 'Grinding In The New Year'
publishedAt: 2024-02-04
description: 'And further adventures in Typescript.'
slug: 'grinding-in-the-new-year.md'
isPublish: true
---

![A peek at my GitHub Contributions](https://nypost.com/wp-content/uploads/sites/2/2024/01/2024-new-york-city-around-74293862.jpg?quality=80&strip=all&w=878 'A peek at my GitHub Contributions')

I'm hella late on the New Year, but I'm here to report that I'm still in the game.

Despite the 100+ job rejections and ghostings in the year 2023, having to pivot to a new full time job that is nowhere near the coding space, attempting to juggle being a student afterhours, being a healthy individual, making time for my family, just trying to clean my office - through it all, I'm still making time to show up for myself, and put in some time to code, and on the occassion, write another blog post.

### A New Partner In Crime

![A peek at my GitHub Contributions](https://images.squarespace-cdn.com/content/v1/552f130be4b07f0b3923049d/1541548228511-HZT8JRRYPU9V1JB2VDEU/The+Other+Guys.gif 'A peek at my GitHub Contributions')

Over the holiday season, I had the pleasure of meeting a new friend who is a Software Engineer, who by day is crafting complex enterprise level code, mentoring juniors, and overall having a good time while he does it. By night, he's slinging code like some guerrilla hacker, imparting secrets of the deep magics of Typescript onto younglings like myself.

As you all know from my previous posts, I do enjoy gaming, or designing for gaming. My projects in bootcamp were mostly based on gaming, after graduating I had the opportunity to work with my brother doing Frontend Development for his [Local Game Store (LGS)](https://theboosterbox.com/), and naturally, as two gamers, my new friend and I are working on a new project together that revolves arounds gaming and bringing people together, and I'm just recording all of the nifty things I'm learning along the way about Typescript, HTML, JS, & React.

### 1. Practice, Practice, Practice.

![GreatFrontEnd Marketing Image](https://www.greatfrontend.com/img/seo/og.jpg 'GreatFrontEnd Marketing Image')

The first lesson that I'm learning is to keep practicing. There was a time where I was solely studying for the AWS Certified Cloud Developer, which meant a lot of time spent on A Cloud Guru.

Not sponsored, but I just like the service so much - checkout the platform [here](https://www.pluralsight.com/cloud-guru).

During this time, I essentially stopped coding, my commits where mostly for notes about AWS services. Rather than spending my days learning about and writing new code, I spent my days learning about Payroll Taxes and Processing, for my new Full Time Job. And before long, the old addage, "If you don't use it, you lose it", took on a whole new meaning for me.

After months of not coding, I could barely remember the syntax to write an arrow function.

`const aStubbedUpArrowFunctionToProveICanDoIt = () => {}`

The value of platforms like greatfrontend.com and frontendmentor.com shot up like crazy for me. I may not have 8 free hours a day to code anymore, or work on my own projects, but maybe I have 30 minutes to work through a problem on either of those platforms to keep my skill sharp.

### 2. IntelliSense is Your Friend.

![IntelliSense Feature Page Screenshot](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/grinding-in-the-new-year/intellisense_srnsht.png 'IntelliSense Feature Page Screenshot')

I've worked with TypeScript before, but never not in a vacuum. So seeing someone who "knows what they're doing" as they write in TypeScript has been a bittersweet treat. Because I'm watching code get written with forethought and attention, and on the other I'm seeing just how complex some of these typed objects, components, and functions can be.

> Companies like developers who know how to use IntelliSense.

This is what my new friend tells me as I'm watching him use IntelliSense to deftly target various methods and variables that he's written into his custom WebHook. He uses IntelliSense often to help him navigate some the large, complex, and often deeply nested objects and functions.

Then I start to drive the code session and I find myself writing at snail's pace, revisiting nested component files, or having to reference interface and type files to piece together the variables and methods I need to be targeting.

---

The whole situations reminds me of the [meme of the Designer and the Developer working on the same project side by side](https://youtu.be/5qHHm7ooavo?si=RU2Wi07gf26qLpIy) - based on the lessons I'm learning here, I'm sure you can guess who is who.

---

**So what is IntelliSense**

Here's a snippet from Microsoft describing IntelliSense:

> A language service provides intelligent code completions based on language semantics and an analysis of your source code. If a language service knows possible completions, the IntelliSense suggestions will pop up as you type. If you continue typing characters, the list of members (variables, methods, etc.) is filtered to only include members containing your typed characters.

![A gif illustrating IntelliSense sensing methods](https://code.visualstudio.com/assets/docs/editor/intellisense/intellisense_docs.gif 'A gif illustrating IntelliSense sensing methods')

For me, IntelliSense has been useful to check if I’m passing a DTO or data transfer object, properly to a function, if I just type in the dto that I’m attempting to pass as a prop and use dot notation to access some of the variables and methods that should be there, and nothing shows up, there's a layer of abstraction that is missing and I should work that out before attempting to manipulate the prop in the component file. And lastly, it is helpful for learning more about HTML in general, with React and JSX IntrinsicElements, I’m seeing just how many methods and properties come along with each individual HTML element out of the box.

### 3. Utility Types are the s#@$!

The same reason that IntelliSense has been useful in this project is the same reason that Utility Types are the next thing on the list to mention. The typed objects that we're messing around with on this project are sophisticated and complex with a large number of properties assigned to each one.

Here is one of the data transfer object types we've been messing around with recently:

```typescript
export type LeagueDto = {
  changesetOptions: {
    canRemove: boolean
    durationDays: number
    schedule: string
  }
  closeDate?: string
  description: string
  format: FormatType
  id: string
  openDate: string
  players: PlayerDto[]
  ruleset: { id: string; type: RulesetType }
  schedule: string
  scores: LeagueScoreDto[]
  title: string
}
```

The biggest lesson I'm taking along with me, and I'm hoping just becomes second nature after a time using Utility Types, is that utility types are easy ways to manipulate types that we don't want to mess with. The types are fine the way they are, don't touch them - but we still need to use them, but we don't always want to use all of their properties.

For example, a function that I was working on to determine the "status" of a league, only needs two properties of that larger type above - openDate & closeDate.

While writing this function, I need to destructure the properties that are going to eventually be passed as arguments of this function, but I don't need to pass all of the properties of the LeagueDto Type Object. Thus enters `Pick`.

```javascript
const getLeagueStatus = ({
  openDate,
  closeDate
}: Pick<LeagueDto, 'openDate' | 'closeDate'>): LeagueStatus => {
  const start = moment(openDate)
  const end = moment(closeDate)
  const now = moment()

  if (now.isBefore(start)) {
    return 'upcoming'
  }

  if (now.isAfter(end)) {
    return 'completed'
  }

  return 'active'
}
```

With the Pick Utility Type, I can take the LeagueDto Type, and simply "pick" the properties of that type that I need to fire the function.

Pick is just one of many Utility Types that are out there that make it easier to work with types and interfaces, there are others like Omit which take in a type, and allow you to select properties to omit, in the case of our code we'd select everything but "openDate" and "closeDate" - and the code might look like:

```typescript
const getLeagueStatus = ({
  openDate,
  closeDate
}: Omit<LeagueDto, 'changeSetOptions' | 'title' | 'description' | 'format' | 'etc'>): LeagueStatus => {
```

Check the [full list of Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) that I've been reference for the past few days.

### 4. CSS Nesting is in Vanilla now?

A few months ago while I was applying for Frontend Engineer jobs, I noticed that a number of companies would list in their Nice-To-Have's section, "X years of experience working with Sass, Less, or other css processors". And in the time that I was practicing with those techs I was blown away by the organization, the conciseness of the code, and how easy it was to bypass issues caused by class name conflicts in other parts of the code.

Recently I've been getting more and more practice with this tech, and I'm so stoked that it's just included in vanilla CSS. Here's an example of the CSS Nesting in action:

I recently came across the "X years of experience with Sass/Less" requirement in many frontend job descriptions. While practicing with these preprocessors, I was impressed by their organization, compactness, and ability to prevent class name conflicts. Now, I'm thrilled to find out that similar functionality is just built directly into vanilla CSS.

Here's how I might have written CSS in the past:

```css
.stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stack-center {
  align-items: center;
}

.stack-left {
  align-items: flex-start;
}
```

With CSS Nesting the code would look like:

```css
.stack {
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.center {
    align-items: center;
  }

  &.left {
    align-items: flex-start;
  }
}
```

The code should render the same, however, with Nested CSS the code is more readable, as the relationship between parent and child elements are clarified by the position of the child element inside of the parent - it sort of mirrors the structure of your JSX or HTML components. Lastly, because children are linked to their parents, there's less of a chance for class names to clash.

### All In All

I know that not all of these findings might be groundbreaking, however, they are exciting to me at this time of my coding journey, and I'm just getting started this year. I'm learning a ton working with my friend and have more blog posts on the way with more learnings. And I hope whoever is reading this is just as excited to learn Frontend Development as I am.

![Just getting started gif](https://media2.giphy.com/media/1KOvn4d2G0ZhtGxisz/giphy.gif?cid=82a1493b331yr0cfwgoy46xhpc44mb7x31ujb8p7j9kkrlq7&ep=v1_videos_related&rid=giphy.gif&ct=v 'Just getting started gif')

---

Thanks so much for sticking around and following me along through my coding journey. If you have any thoughts what I should look into learning about, or just have cool ideas to share, or you just want to chat, feel free to reach out to me at my email - anthony.john.medina@gmail.com.
