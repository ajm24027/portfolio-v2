---
title: "The Making of Playtimer (Part 3)"
publishedAt: 2023-10-30
description: "Rolling with the punches, and making progress."
slug: "the-making-of-playtimer-3.md"
isPublish: true
---

![Slip and Roll - Mayweather & Marquez Fight](https://cdn.gloveworx.com/images/box_g_mayweather_marquez_b1_576.2e16d0ba.fill-1600x900.jpg "Slip and Roll - Mayweather & Marquez Fight")

This week in coding Playtimer - The pressure is on as I wrestle through unforseen challenges and plan to deal with new ones.

### Where were we?

_If you want to check it our, read up on the progress I've made in [The Making of Playtimer (Part 1)](https://anthonyjmedina.com/posts/the-making-of-playtimer-1.md/) and in [The Making of Playtimer (Part 2)](https://anthonyjmedina.com/posts/the-making-of-playtimer-2.md/)._

Last week I coded a Modal that intakes the users input in phases, constructs an object, and then sets that object to state. Additionally, I explored the relationship between Parent and Child Components, and how to pass up information from a Child Component to its parent using Callback functions.

```javascript
      case Phase.SetGameType:
        return (
          <GamingPhase
            onClickNext={(game: string) => {
              setNewTimerParams({ ...newTimerParams, game })
              setPhase(Phase.SetCountdown)
            }}
          />
        )
```

---

Check out the repository - [here](https://github.com/ajm24027/playtimer)

---

### Where are we going?

As a reminder from last week, the timer in it's current form looks like so:

![A gif from Geeks For Geeks of a simple timer app.](https://media.geeksforgeeks.org/wp-content/uploads/20210625185346/Reactcountdown.gif "A gif from Geeks For Geeks of a simple timer app.")

You'll notice that currently the time being passed from the user and the modal component is in the format `"00:00:00"`. If you're like me, you enjoy this kind of format and the precision that it can bring. I'm the kind of person that has the seconds showing my Apple Watch and in my Menu Bar.

### Problem #1

![27-Inch Monitor on desk setup](https://assets.entrepreneur.com/content/3x2/2000/1629478920-Hero.jpg "27-Inch Monitor on desk setup")

The first problem that I've faced this week is that the format of the timer doesn't play well with the space alloted to the viewport (web). One of my main goals was to maximize the amount of space that the timer's time had so that it could be easier to see from farther away, as the monitors that the app will be primarily casted on are 27" monitors that the owners got on sale (see above for reference). This is why in the initial prototype, I opted for a `hours:minutes` format to render vs. `hours:minutes:seconds` to render, as it utilizes the horizontal space more efficiently than the latter (see below).

![Lo-fi App Homepage](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/playtimer-lofi.png "Lo-fi App Homepage")

The first thing that I needed to do, was refactor the last phase of the newTimerModal so that it would only intake Hours and Minutes, and I updated a helper function that formatted the input hours and minutes. This was the easy part, and was literally a matter of commenting out the numInput component for the seconds value. But for the sake of the documentation I'll add the code below.

```javascript
  return (
    <>
      {renderNumInputs()}
      <Button
        type="submit"
        onClick={() => {
          const formattedCountdown = () => {
            const { hours, minutes } = countdown;
            return (
              (hours > 9 ? hours : "0" + hours) +
              ":" +
              (minutes > 9 ? minutes : "0" + minutes)
            );
          };
          onClickNext(formattedCountdown());
        }}
      >
        Create Timer
      </Button>
    </>
```

_I do want to note that, even though I've removed the ability for users to input or update seconds, I still want this for later, as the Timer will render a nice countdown from 59 seconds to 0 once the total time left in the timer is less than 60,000 milliseconds._

## ... Later

```javascript
const startTimer = (e) => {
  let { total, hours, minutes, seconds } = getTimeRemaining(e);

  if (total <= 0) {
    clearInterval(Ref.current);
    setTimer("X");
    setIsExpired(true);
  } else if (total < 60000) {
    setTimer(seconds > 9 ? seconds : "0" + seconds);
  } else {
    setTimer(
      (hours > 9 ? hours : "0" + hours) +
        ":" +
        (minutes > 9 ? minutes : "0" + minutes)
    );
  }
};
```

The above code comes after a Saturday Evening of testing different ways to update the states without the If-Else If-Else statements. I'm not fully sure why it works now, versus why my [initial idea didn't work](https://anthonyjmedina.com/posts/the-making-of-playtimer-1.md/) >

> I'm understanding the possible reason that the DOM didn't update was that the states were being updated too quickly for the conditions to be recognized as met.

The reason that I think everything is working now, is because rather than using a chain of conditionals to update 3 different states every second, only one is being accessed and updated every second. In any case, I'm happy that I finally got it to work as intended, and that was one problem that was knocked out.

![Creed 3 Daminan Punch gif](https://media4.giphy.com/media/ix8rZoVYcFVw4aCp5O/source.gif "Creed 3 Daminan Punch gif")

### Problem #2

The next problem that I needed to handle was the fact that the idea that I had in my head wasn't working out as I intended, as what happens to most plans.

My initial idea was to use the [Chakra-UI Progress Bar component](https://chakra-ui.com/docs/components/progress/usage), which has various props to control its animations, sizing, etc., and make it the size and height of the timer card that would eventually have the game background, title, and timer on it. Every second, the value of the Progress Bar would be decremented by 1 until the Progress Bar (which would essentially be a border to the timer card) would be empty denoting that time is up.

This was all fine and well until I actually started to use the VStack and Center Components of Chackra-UI and attempted to pass a few z-index props to the Progress Bar, and to the Timer card.

I unfortunately don't have the code or the images to show what it was like. You have to imagine me, on a warm, clear, October Saturday Afternoon, spending my time fiddling with what was supposed to be the "easy part" of the build. I was frustrated and simply searching for answers and did not save the code that wasn't working.

The end result at the time however was that the Progress Bar and the Card Component, no matter what code that I used ended either sitting on top of one another vertically (not on the z-axis) or beside one another.

The second issue was that the Timer Logic is in an interval, and creates it's `(total, hours, minutes, seconds)` variables every second. That meant that when value was supposed to be 1 second less than the total every second. But at the same time, Total was already decremented by 1 second. It's hard to explain without a screenshot of the code, but essentially, the proportion of time between MaxValue and Value never changed on render because they were always an equal proportion of time away from eachother every single second.

![Ivan-Drago-Rocky-Balboa gif](https://media.tenor.com/GBEc3vMHn9IAAAAC/ivan-drago-rocky-balboa.gif "Ivan-Drago-Rocky-Balboa gif")

### Problem #2 - The Solution

There's a world out there where I was able to get the timer to work exactly as I intended. This is not that world. I abandoned the path that I was on. I knew I had to go back to the design, my mind was to used to variables, and states, loops and maps. I needed to clear my head so I jumped back into Figma and started the higher-fidelity prototypes for the Timer's themselves that would be rendered on screen. Take a look at the progress that I made:

![Frame of most all Playtimer Variants jpg](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/Timer.png "Frame of most all Playtimer Variants jpg")

This is when a few ideas came to mind - that I might end up writing about in the next entry of this series. The whole reason I wanted the progress bar in the first place was that I wanted to provide feedback to the user to let them know that a timer is active and that a timer has expired. While designing these out in Figma and playing around with their variants tool, the idea came to mind to create 2 variants of the timer component.

Timer - Active - Here we can use a pulse effect on the timers border color [like so](https://www.florin-pop.com/blog/2019/03/css-pulse-effect/). Maybe [filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow) there can be an alternative to the dropshadow CSS if for some reason it doesn't work. This will hopefully give the appearence that the timer is powered up or energized and thus active.

Timer - Expired/Paused - and if the timer is paused or expired, we can make the border color a darker hue of it's own color, and then also use [filter to turn down the brightness of the background image](https://stackoverflow.com/questions/11535392/how-to-decrease-image-brightness-in-css). This will make the timer appear to be out of power or inactive.

I've yet to employ them, so I don't know if everything will workout, but I'm encouraged and even energized by the progress that I've made and the next steps and designs for next steps that I've come up with.

![Rocky-Balboa-Running gif](https://i.pinimg.com/originals/a5/29/6e/a5296e3531a9fdffd7e2844ce53a48ba.gif "Rocky-Balboa-Running gif")

---

Thanks so much for sticking around and reading about my journey as I learn from mistakes, share my designs, and rubber duck off of you my reader, if you have any thoughts on the app, or my process, or just want to chat, feel free to reach out to me at my email - anthony.john.medina@gmail.com.
