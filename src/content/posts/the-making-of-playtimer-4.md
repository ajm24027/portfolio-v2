---
title: 'The Making of Playtimer (Part 4)'
publishedAt: 2023-11-08
description: 'Sprinting to MVP and Beyond.'
slug: 'the-making-of-playtimer-4.md'
isPublish: true
---

![Finished Screenshot of the Playtimer App](https://playtimer-images.s3.us-east-2.amazonaws.com/finished_product.png 'Finished Screenshot of the Playtimer App')

This week the making of Playtimer - I execute on the design changes from last week and add some finishing touches that can really make this thing a useable app for The Booster Box.

---

Check out the repository - [here](https://github.com/ajm24027/playtimer)

Check out the completed project - [here](https://playtimer.anthonyjmedina.com/)

---

### Where were we?

_If you want to check them out, read up on the progress I've made in [The Making of Playtimer (Part 1)](https://anthonyjmedina.com/posts/the-making-of-playtimer-1.md/), and [The Making of Playtimer (Part 2)](https://anthonyjmedina.com/posts/the-making-of-playtimer-2.md/), and [The Making of Playtimer (Part 3)](https://anthonyjmedina.com/posts/the-making-of-playtimer-3.md/)._

Last week I stood toe to toe with blockers that stood between me and bringing this project to it's initial conclusion (apps can always be improving) - mainly, providing feedback for my users to know when a timer is active and inactive and or expired, without using a Progress Bar Component. In the end, I decided to plan and create variant states (as one does in Figma) of the timers to render when various conditions were met.

![Active & Inactive States example](https://playtimer-images.s3.us-east-2.amazonaws.com/active_inactive_states.png 'Active & Inactive States example')

### Where are we going?

Now that I have a plan to execute on, this week I need to complete a few things to bring the app to MVP:

- I need to upload and bring in all of the images for the timer backgrounds via AWS S3.

- I need to create the logic to decide what kind of styling a timer should take on as a result of the game that the user chose.

- I need to recreate the timer component to render the new design.

- I need to add some final features to make the app more useable (close button in the timer, and back button to update the phases in the case that a user needs to change something in the past).

- I need to make sure Typescript is happy with my code (else I can't launch the app).

### #1 - Getting the Images Hosted on AWS S3

Recently I started getting into AWS (again), but since graduating bootcamp, AWS Certified Developer Associate is looking very tempting 👀 for the next certificate I get. In the spirit of that, I decided to mess around with and create an S3 bucket with a basic policy to give the public permission to access objects in my 'playtimer-images' bucket:

```yaml
{
  'Version': '2012-10-17',
  'Statement':
    [
      {
        'Sid': 'PublicReadGetObject',
        'Effect': 'Allow',
        'Principal': '*',
        'Action': 's3:GetObject',
        'Resource': 'arn:aws:s3:::playtimer-images/*'
      }
    ]
}
```

After I gave my bucket the above policy, I uploaded all those card images that I made last week into my S3 bucket (See below for a reminder).

![Frame of most all Playtimer Variants jpg](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/Timer.png 'Frame of most all Playtimer Variants jpg')

After uploading here is a glimpse as to what the bucket looked like (see below). Now that my card images were hosted off of S3, they would all have an endpoint to access the object - `https://playtimer-images.s3.us-east-2.amazonaws.com/active_inactive_states.png`

![Image showcasing my S3 Bucket and the objects within](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/playtimer-bucket.png 'Image showcasing my S3 Bucket and the objects within')

The reason that I did this was for future-proofing. Maybe when I learn about it, or if I actually end up needing it, I'd want to have a bucket set up already that can eventually be connected to Amazon's CDN, AWS Cloudfront, reducing the overall TTL of the site and it's resources.

### #2 - Creating the Timer's Styling Logic

One of the main selling points of the app, is the dynamism that each timer has. To make it easier for users to tell which timer they should be looking at, not only would there be the title of the Event that their attending, but their timer, the one they should focus on, would also be styled according to the game that they were playing at said event.

For example, the tournament host, would create a timer for a Pokemon tournament, on selecting Pokemon as the kind of game that the tournament is for, that timer would have unique styling mapped to the pokemon game, hence the individual card (timer) images that are now hosted off of S3.

![Image showcasing user input form for games](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/game-user-selection.png 'Image showcasing user input form for games')

I initially wanted to employ a switch case, that would watch the incoming game prop from the timer object in the parent. The logic would've looked something like this:

- In the case that the game is Disney's Lorcana:

- Is the `isExpired` state triggered to true? Return an expired timer component.

- `isExpired` isn't true? Go ahead and return the timer component.

And, it would've worked, but the code immedietly became cumbersome to code. And having to do this for 8+ games, would've rendered the code incredibly difficult to read and write. I instead created a singular timer component, and leveraged a lookup table, Object Literal Notation, and the power of JSX.

First I created the lookup table - that has objects within it, that have particular key-value pairs within them. The keys in this case are named after the particular CSS attributes I want to give the component, the value is the _*literal*_ value that will be passed into the CSS attribute:

```javascript
  const gamesBackgroundsAndBorderObj = {
    lorcana: {
      backgroundImage:
        "url('https://playtimer-images.s3.us-east-2.amazonaws.com/Lorcana.png')",
      borderColor: '#ff9900',
      boxShadow: 'rgba(255,153,0,0.63)'
    },
    mtg: {
      backgroundImage:
        "url('https://playtimer-images.s3.us-east-2.amazonaws.com/mtg.png')",
      borderColor: '#FF6666',
      boxShadow: 'rgba(255,102,102,0.63)'
    },
    bss: {
      backgroundImage:
        "url('https://playtimer-images.s3.us-east-2.amazonaws.com/bss.png')",
      borderColor: '#00FFBF',
      boxShadow: 'rgba(0,255,191,0.63)'
    },
    ...
  }
```

In the case that the game is Lorcana: lorcana.backgroundImage = `url('https://playtimer-images.s3.us-east-2.amazonaws.com/Lorcana.png')` and lorcana.borderColor = `'#ff9900'`, and so on. The function used to render the timer is massive, but I'll show how I used Object Literal Notation to place and use key value pairs to dynamically render the timers.

```javascript
const renderTimer = (game: keyof typeof gamesBackgroundsAndBorderObj) => {
    const gameData = gamesBackgroundsAndBorderObj[game]
    const { backgroundImage, borderColor, boxShadow } = gameData
    return (
      <Box
        h="100%"
        backgroundImage={`${backgroundImage}`}
        backgroundSize="cover"
        backgroundPosition="center"
        borderRadius="16px"
        boxShadow={isExpired ? 'none' : `6px 6px 32px 11px ${boxShadow}`}
        border={isExpired ? '4px solid #787878' : `4px solid ${borderColor}`}
```

First, I created a variable to store the values that would be used. The renderTimer function takes the parameter of game, and I use bracket notation to access the object by the name of the incoming game within the gamesBackgroundsAndBorderObj.

Then, I use destructuring to "pull" the values out of the gameData object for later use.

I then use the destructured values inside of the code - boxShadow={isExpired ? 'none' : `6px 6px 32px 11px ${boxShadow}`}.

### JSX Realizations

This isn't the first time that I used JSX, but this is the first time that I realized the power of JSX, and the fact that you can just place Javascript conditionals inside of your return statements. Where before I was ready to create an entire "expired" variant of my timer component. the boxShadow CSS attribute using JSX checks to see if the condition of the ternary operator is met. If it is, render nothing for boxShadow, if it isn't return a boxShadow built with the Object Literal `${boxShadow}`.

### #3 Adding Final Features for Usability

The last features that I needed to add were a means of deleting a timer from from the Timers object int the parent component, and I needed a way for users to navigate the Timer Creation Modal.

I did this by utilizing the anonomoys function passed as a prop technique I learned about back in [The Making of Playtimer (Part 2)](https://anthonyjmedina.com/posts/the-making-of-playtimer-2.md/).

```javascript
const removeTimerFromState = (timerIndex: number) => {
  const newTimers = timers.filter((_timer, index) => index !== timerIndex)
  setTimers(newTimers)
}
```

For this particular function, I use the filter method to create a new array of timers that doesn't include the index of the timer that is triggering this function, and setting this new array to state. And finally, I passed this down to the timer component, so it can trigger it `onClick` or `terminateTimer`:

```javascript
{
  timers.map((timer, i) => (
    <TimerComp
      key={i}
      name={timer.title}
      initialTime={timer.initialTime}
      game={timer.game}
      terminateTimer={() => removeTimerFromState(i)}
    />
  ))
}
```

### Fixing up the Types for Deployment

I really was sprinting this time. And in the hopes things would just run, I went to [netlify.com](netlify.com) and attempted to just build the app 😅. Here's a little bit of the log:

```bash
4:21:56 PM: Failed during stage "building site": Build script returned non-zero exit code: 2
4:21:56 PM: src/App.tsx(5,1): error TS6133: "Timer" is declared but its value is never read.
4:21:56 PM: src/components/ModalSteps/GamingPhase.tsx(12,24): error TS7031: Binding element "onClickNext" implicitly has an "any" type.
4:21:56 PM: src/components/ModalSteps/GamingPhase.tsx(12,37): error TS7031: Binding element "onClickBack" implicitly has an "any" type.
4:21:56 PM: src/components/ModalSteps/NamingPhase.tsx(11,24): error TS7031: Binding element "onClickNext" implicitly has an "any" type.
4:21:56 PM: src/components/ModalSteps/TimingPhase.tsx(16,24): error TS7031: Binding element "onClickNext" implicitly has an "any" type.
4:21:56 PM: src/components/NewTimerModal.tsx(25,26): error TS7031: Binding element "onModalComplete" implicitly has an "any" type.
```

My beautiful callback functions were triggering Typescript to complain. I made an interface to pass over to the props in my different phases, making onClickBack optional because the first phase doesn't have a onClickBack and then added those to the Component Functions:

```javascript
// from /types/app-types.ts

export interface PhaseNavProps {
  onClickNext: (game: string) => void
  onClickBack?: () => void
}

// example in /components/ModalSteps/GamingPhase.tsx
const GamingPhase: React.FC<PhaseNavProps> = ({ onClickNext, onClickBack }) => {
  ...
```

### The End Result

The end result is a functional timer app made just for gamers (and The Booster Box). Users can easily setup timers for their favorite games and tournaments using the guided Modal, and enjoy visually stunning timers that let them know how much time they have to beat their oppononent.

![Image showcasing the Final Product of Playtimer](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/playtimer_final.png 'Image showcasing the Final Product of Playtimer')

![Image showcasing user input form for games](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/game-user-selection.png 'Image showcasing user input form for games')

![Finished Screenshot of the Playtimer App](https://playtimer-images.s3.us-east-2.amazonaws.com/finished_product.png 'Finished Screenshot of the Playtimer App')

My hope is that it is used by The Booster Box in every tournament, and more importantly, I hope it helps all the wonderful people that spend their weekends and evenings there playing their favorite games.

---

Thanks so much for sticking around and reading about my journey through creating a utility timer app and all of the struggles and victories that I've experienced, if you have any thoughts on the app, or my process, or just want to chat, feel free to reach out to me at my email - anthony.john.medina@gmail.com.
