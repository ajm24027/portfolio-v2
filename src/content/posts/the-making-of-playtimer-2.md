---
title: 'The Making of Playtimer (Part 2)'
publishedAt: 2023-10-21
description: 'Healthy relationships between children and parents.'
slug: 'the-making-of-playtimer-2.md'
isPublish: true
---

![Pompeo Girolamo Batoni, Thetis takes Achilles from the Centaur Chiron, 1768](https://www.dailyartmagazine.com/wp-content/uploads/2021/04/achilles-and-centaur-1024x762.jpeg 'Pompeo Girolamo Batoni, Thetis takes Achilles from the Centaur Chiron, 1768')

This week on my journey to making a Utility Timer Application, I've learned a valuable and touching lesson on the mechanics of a healthy relationship between parents and their children. More on that in a second.

### Where were we?

As a recap to last weeks blog post, I was successfully able to create a React Component that could take in an object like the one below, and render a functioning Timer with a pause button that clears the timers interval and captures the state of the current timer, and a resume button that initiates the timer, except this time using the updated and captured time from when the pause button was clicked.

```javascript
const boosterBox = {
  title: 'Super Awesome Spoils Tournament',
  game: 'The Spoils',
  initialTime: '00:00:05',
  timeAtPause: ''
}
```

The result was something similar to below, except the reset button is flanked by the new pause button.

![A gif from Geeks For Geeks of a simple timer app.](https://media.geeksforgeeks.org/wp-content/uploads/20210625185346/Reactcountdown.gif 'A gif from Geeks For Geeks of a simple timer app.')

---

Check out the repository - [here](https://github.com/ajm24027/playtimer)

---

### Where are we going

This week I decided to create the means for the app to capture user input to eventually create an object that will be passed into a state array and rendered on screen. To do so, I decided to break down the user journey into what will be a stepper flow. I'm not sure if this is wholly necessary, and we'll get feedback from users once we go to production. But for me, the stepper flow is the most organized way to collect information.

```typescript
const renderModalByPhase = () => {
  switch (phase) {
    case Phase.SetName:
      return (
        <NamingPhase
          onClickNext={(title: string) => {
            setNewTimerParams({ ...newTimerParams, title })
            setPhase(Phase.SetGameType)
          }}
        />
      )
    case Phase.SetGameType:
      return (
        <GamingPhase
          onClickNext={(game: string) => {
            setNewTimerParams({ ...newTimerParams, game })
            setPhase(Phase.SetCountdown)
          }}
        />
      )
    case Phase.SetCountdown:
      return (
        <TimingPhase
          onClickNext={(initialTime: string) => {
            setNewTimerParams({ ...newTimerParams, initialTime })
            setPhase(Phase.SetName)
            onClose()
          }}
        />
      )
  }
}
```

**The Switch Case works like this:**

**First** - There's an enumerated object called `Phase` that has different values within it. And a state that tracks the current value of a variable called `currentPhase`.

```Typescript
enum Phase {
  SetName,
  SetGameType,
  SetCountdown
}
```

**Then** - The Switch Case watches the `currentPhase` state, and depending on the current value of the currentPhase ("SetName", "SetGameType", "SetCountdown"), it will render a child component respective of the "current phase" that the Modal component is in (Naming Phase, Gaming Phase, Timing Phase).

```javascript
  switch (currentPhase) {
    case Phase.SetName:
      return ...
    case Phase.SetGameType:
      return ...
    case Phase.SetCountdown:
      return ...
```

### phase == Phase.SetName

![A gif from Geeks For Geeks of a simple timer app.](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/SetNamePhase.png 'A gif from Geeks For Geeks of a simple timer app.')

### phase == Phase.SetGame

![A gif from Geeks For Geeks of a simple timer app.](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/SetGamePhase.png 'A gif from Geeks For Geeks of a simple timer app.')

### phase == Phase.SetCountdown

![A gif from Geeks For Geeks of a simple timer app.](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/SetCountdownPhase.png 'A gif from Geeks For Geeks of a simple timer app.')

This switch case is what will walk the user step by step into creating a properly formatted object that is ready for consumption by the Timer Component I created in my [last blog post](https://anthonyjmedina.com/posts/the-making-of-playtimer-1.md)

![A gif from Geeks For Geeks of a simple timer app.](https://media2.giphy.com/media/1n92hYPiFQ0efcCtrF/giphy.gif 'A gif from Geeks For Geeks of a simple timer app.')

### Healthy Relationships with Parents and Children... Components.

![Pompeo Girolamo Batoni, Thetis takes Achilles from the Centaur Chiron, 1768](https://www.dailyartmagazine.com/wp-content/uploads/2021/04/achilles-and-centaur-1024x762.jpeg 'Pompeo Girolamo Batoni, Thetis takes Achilles from the Centaur Chiron, 1768')

If we rewind the clock a couple months back, we'll find some parent components of my [ChemChat App](https://github.com/ajm24027/ChEM) like Thetis to Achilles, forcefully passing down her states as props to her demi-god Son so he can update them for her, thus cementing his legacy in greek mythology (see below).

![Screenshot of Little Drawer Component Code - ChemChat](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/littleDrawer.png 'Screenshot of Little Drawer Component Code - ChemChat')

At the time, this made sense to me, "Oh, I need to update a state in a parent component, but the child component is doing all of the work? Let me pass all of the states as props to the child and force it to work for the parent component".

And while on the client layer, this works, and the user can complete the task as needed.

**Isn't there a better way?**

There is. After some time of Googling, I came across a [blog post](https://blog.devgenius.io/how-to-pass-data-from-child-to-parent-in-react-33ed99a90f43) by Yusuf Abdur Rahman at Dev Genius. In their blog post they post the following code and explanation:

```javascript
const Parent = () => {
  const [message, setMessage] = React.useState('Hello World')
  const chooseMessage = (message) => {
    setMessage(message)
  }
  return (
    <div>
      <h1>{message}</h1>
      <Child chooseMessage={chooseMessage} />
    </div>
  )
}
const Child = ({ chooseMessage }) => {
  let msg = 'Goodbye'
  return (
    <div>
      <button onClick={() => chooseMessage(msg)}>Change Message</button>
    </div>
  )
}
```

> The initial state of the message variable in the Parent component is set to 'Hello World' and it is displayed within the h1 tags in the Parent component as shown. We write a chooseMessage function in the Parent component and pass this function as a prop to the Child component.

> This function takes an argument message. But data for this message argument is passed from within Child component as shown.

> So on click of the Change Message button, msg = 'Goodbye' will now be passed to the chooseMessage handler function in the Parent component and the new value of message in the Parent component will now be 'Goodbye'.

> This way, data from the child component (data in the variable msg in Child component) is passed to the parent component.

### Why does this matter?

I used this idea of passing callback functions as props from the Parent component (who already has access to all the states that they need to update), to gather, package, and send data from all of the children components that live within the Parent Modal component to the Parent component itself, which will end the end, package up all the data it's received and set it to state for the timer component (like I said at the beginning of the blog 😊)

```javascript
    case Phase.SetName:
      return (
        <NamingPhase
          onClickNext={(title: string) => {
            setNewTimerParams({ ...newTimerParams, title })
            setPhase(Phase.SetGameType)
          }}
        />
      )
```

### Progress Made

While the phase components themselves aren't impressive, they are just Chakra-UI components with that collect the user input and then returns the data they recieve by accessing the onClickNext() function passed down from the parent Modal component, the important part of this weeks work on PlayTimer was learning how to give child components the means to work with data and send it back to parent components.

To recap, rather than passing down all of the states and such that need to be updated in the parent down to the child, pass down a singular call back function from the parent (who already has access to the states and values that need to be updated), for the child to then use to pass the information back to the parent.

Now that we can work with and create an object (see below), the next steps are:

- Create a function or means to set the object created by NewTimerModal to the Apps state (probably a call back function).

- Refactor the Timer component to accept the object as a prop.

- Test to see if multiple Timer components can render and run with the new props created by users.

![Data in state of NewTimerModal Component](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/the_making_of_playtimer/dataInState.png 'Data in state of NewTimerModal Component')

---

Thanks so much for sticking around and reading about my journey through learning how to use Callback functions to let Children components pass information to their Parent components, if you have any thoughts on the app, or my process, or just want to chat, feel free to reach out to me at my email - anthony.john.medina@gmail.com.
