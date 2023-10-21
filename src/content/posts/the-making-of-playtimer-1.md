---
title: 'The Making of Playtimer (Part 1)'
publishedAt: 2023-10-14
description: 'Messing with Time.'
slug: 'the-making-of-playtimer-1.md'
isPublish: true
---

![Time Travel Image from Space.com](https://cdn.mos.cms.futurecdn.net/VgGxJABA8DcfAMpPPwdv6a.jpg 'Time Travel IMage from Space.com')

Remember The Booster Box? The client from [from earlier in the month?](https://anthonyjmedina.com/posts/creating-a-calendar-app-for-the-family-business.md) During the time that I was working on the Calendar App for them, they had in passing mentioned writing a custom timer app when running their tournaments. And I thought that was such a fun idea, an app that can display and manage multiple timers that are unique in look. So, this is the start of my journey to design and develop the PlayTimer App - 'The timer for tournaments & games'.

---

Check out the repository - [here](https://github.com/ajm24027/playtimer)

---

I had already prototyped what the timers may look like while on the 27-inch monitors The Booster Box has mounted on the ceiling in the center of the play space. I'll discuss my design choices in a later post, but I'll show what the timers may look like so that I can discuss the following logic and lessons learned.

![Lo-fi App Homepage](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/playtimer-lofi.png 'Lo-fi App Homepage')

### My First Attempt

I initially set out to work on the hardest part of the app. Messing around with a timer. In my excitement, I made a crucial mistake out of the gate. I went directly to VSCode and started coding out the app. Checkout my rambling pseudocode below thinking that I was doing something:

```markdown
#### Timer

The timer function will consume the time object, and set hours to state, minutes to state, and seconds to state. A setInterval inside the timer function will be called every 1 seconds(1000ms). When 1 second elapses:

- Decrement seconds state by 1.
  - If (seconds == 0 && minutes != 0) {setSeconds(59) and setMinutes(decrementedMinutes)} In this case, decrementedMinutes = minutes -= 1, because if I remember correctly minutes - 1 will always be the last iteration of the state at time of render - 1, not the last iteration of the state - 1.
  - If (minutes == 0 && hours != 0) {setMinutes(59) and setHours(decrementedHours)} else minutes == 0.
  - Lastly, in the case that seconds == 0 && minutes == 0, setIsExpired(true). - hours by this point hopefully should be set to 0 already.

My hope is that this particular function can handle the rendering of the time, and that when seconds and minutes and hours are 0, an elapsed state can render in place of the timer, that maybe has a button that starts a new timer based on the initial time given (a restart timer button) and or a cancel/close timer button.
```

I think that on a superficial level, the above pseudocode makes sense. You have some numbers set to state. Use a setInterval to decrement 1 from the seconds every seconds. If seconds == 0 and minutes > 0, then update the seconds decrement the minutes and so on.

I put the code in, watched the console, and the DOM, and wouldn't you know it, it didn't work.

I'm still honestly not sure what to make of the situation, but I put some questions into chatGPT (I know. . .), and what I'm understanding the possible reason that the DOM didn't update was that the states were being updated too quickly for the conditions to be recognized as met. A part of me always felt that this way was too trivial to work out. Dejected, but proud that I put the work in to discover, I took to the internet to find out how others online do the thing that I'm attempting to create.

### My Second Attempt

After 3 seconds of Googling I came across a very cool article on [Geeks For Geeks](https://www.geeksforgeeks.org/how-to-create-a-countdown-timer-using-reactjs/). Someone, somewhere, at sometime, made the beginnings of the app that I want to build. And taking it apart, and adapting it to my needs, I feel that I learned a lot about Time Intervals in Javascript.

![A gif from Geeks For Geeks of a simple timer app.](https://media.geeksforgeeks.org/wp-content/uploads/20210625185346/Reactcountdown.gif 'A gif from Geeks For Geeks of a simple timer app.')

I found the approach that this person took to be so smart, or at the very least, I felt embarrased a little for not thinking of the way that they approached the problem.

> This is what learning is all about.

Rather than setting numbers to state, and decrementing from it every second, and using a number of conditionals to update the states respectively, the code they wrote makes a comparison to when the timer was started to the time that it is now, and reports the difference, that difference is set to state and that's what's shown in the DOM. Here's how they explain the code:

- getTimeRemaining: This will compute the difference between the target timer and the current time we have. This function will check the time left from the target timer by doing calculations and return a total number of hours, minutes, and seconds.
- StartTimer: This function will start timing down from getting a total number of hours, minutes, and seconds from the getTimeRemaining function.
- ClearTimer: This function is used to reset the timer, which means If you restart the timer it clears the time remaining from the previous countdown, otherwise it starts parallel two-timing down or it may collapse each other.
- getDeadTimer: This function provides the deadline of the timer means it gives time from where you want to start the countdown. In this, you have to add time if you want to extend. We have used this in two scenarios first when the page is loaded and second when someone clicks the reset button.

### Something was missing

Okay, this was a great place to start. But if you remember the prototype, there are somethings that are missing that I need to add.

![Lo-fi App Homepage](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/playtimer-lofi.png 'Lo-fi App Homepage')

To help myself understand how I would need to make adjustments, I created a test object, one that would be similar to the props that this component might recieve in the future.

```javascript
const boosterBox = {
  title: 'Super Awesome Spoils Tournament',
  game: 'The Spoils',
  initialTime: '00:00:05',
  timeAtPause: ''
}
```

After I created the object I began writing some simple buttons and some functions to accompany them, `onClickPause` and `onClickResume`:

```javascript
const onClickPause = () => {
  boosterBox.timeAtPause = timer
  clearInterval(Ref.current)
  setIsPaused(!isPaused)
}
```

`onClickPause` - This code would work by ingesting the time at pause, as the variable is aptly named. This is the string that is set to state at the moment that the function is triggered. Once the time was recorded, the interval of the timer would be cleared (no more countdown because the code wouldn't fire off every 1000ms). Finally, the state of the `isPaused` variable is toggled for rendering purposes.

```javascript
const onClickResume = () => {
  clearTimer(getDeadTime(boosterBox.timeAtPause))
  setIsPaused(!isPaused)
}
```

`onClickResume` - This code works by recalling the function that sets the timer state, and starts the interval, this time instead of a new date object going through the getDeadTime function, the timeAtPause time string would get passed. To the developer, a whole new timer has started. To the user, they just paused their timer and resumed it.

And after an hour of messing around with clearInterval and setInterval and skulking around Mozilla Dev References, the only reason that my glazed over brain was able to do the above, was because of this realization:

> `clearInterval != clearId` - For one reason or another, I was looking for a round about way of pausing my timer because I didn't realize that the interval was not the id of the timer. The interval is the time until execution, and id is the identifier that is returned by the respective method. This meant that when the first interval method is used, it returns an id that I can target elsewhere with other interval methods.

Here is the updated and clearTimer and getDeadTime functions after working with the test object:

```javascript
const clearTimer = (deadline) => {
  if (!boosterBox.timeAtPause || timer == '00:00:00') {
    setTimer(boosterBox.initialTime)
  } else {
    setTimer(boosterBox.timeAtPause)
  }

  if (Ref.current) clearInterval(Ref.current)
  const id = setInterval(() => {
    startTimer(deadline)
  }, 1000)
  Ref.current = id
}

const getDeadTime = (timeString: string) => {
  let deadline = new Date()
  // console.log('This is the deadline before modification > ', deadline)

  // console.log('This is the incoming timeString > ', timeString)
  const arrayFromTimeString = timeString.split(':')
  // console.log(
  //   'This is the outgoing arrayFromTimeString > ',
  //   arrayFromTimeString
  // )
  const hours = parseInt(arrayFromTimeString[0])
  // console.log('This is hours ', hours)
  const minutes = parseInt(arrayFromTimeString[1])
  // console.log('This is minutes ', minutes)
  const seconds = parseInt(arrayFromTimeString[2])
  // console.log('This is seconds ', seconds)

  deadline.setSeconds(deadline.getSeconds() + seconds)
  deadline.setMinutes(deadline.getMinutes() + minutes)
  deadline.setHours(deadline.getHours() + hours)
  // console.log('This is the deadline > ', deadline)
  return deadline
}
```

The major changes I made were:

- I had to add a conditional in the clearTimer function, where if timeAtPause is falsy, an empty string in other words, or the timeString is `'00:00:00'` to set the timer state to the initial time of the object that the user would have set. These were to catch the cases where the user had never paused the timer, or the timer was up.
- Because the initialTime and timeAtPause are being passed as strings, I turned the timeString variable that's passed to deadTime, create an array seperating each index by the values between ":". For example, a time string of '01:53:29' would turn into the array `[01, 53, 29]`
- From there I used the `parseInt()` method to grab the actual numbers from the strings and create the hours, minutes, and seconds variables from them. Those variables then are used to create the reference date object that is used to calculate the countdown.

### Progress Made

This was a major milestone for the app. The timer is the meat and potatoes, and I was able to code the major features of this major piece of the timer component:

- Pass in a string from an object (that will later come from a form submission).
- Format the string to be used in the timer's reference creation and state managment.
- Create a means for users to pause the timer once it's been created.
- Create the means to resume the timer after it's been paused.
- It already came with a reset function, but this is necessary for when the timer expires, and the next round of the tournament starts.

And I learned a little something about time interval methods along the way.

![Delorean GIF - from tenor.com](https://media.tenor.com/qn_L3oU5rbIAAAAd/delorean-time-travel.gif 'Delorean GIF - from tenor.com')

---

Thanks so much for sticking around and reading about my journey through time. . . methods, if you have any thoughts on the app, or my process, or just want to chat, feel free to reach out to me at my email - anthony.john.medina@gmail.com.
