---
title: 'Creating a Calendar App for the family business'
publishedAt: 2023-10-05
description: 'and how AWS saved the day.'
slug: 'creating-a-calendar-app-for-the-family-business.md'
isPublish: true
---

![A picture of The Booster Box and all of it's glory](https://pbs.twimg.com/media/F7EYqlQXkAAMqZ7?format=jpg&name=large)

In February, my brother and his friends opened a local game store called The Booster Box. They wanted to be the area's premier tournament center, holding more events than any other store.
To promote their events, they took to social media. But with the sheer number of events, it was impossible for their customers to keep up. There was confusion. There needed to be a better way.

This is where the idea of the calendar came into play. It would be easy to maintain, as the events would be tracked and managed by Google Calendar. The app would just display the information easily and within the current design parameters of the main site.

---

Check out the finished app - [here](https://theboosterbox.com/calendar)

---

### The Plan

![The Initial Whiteboard Session](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/Creating_A_Calendar/initial_whiteboard_session.png 'Initial Whiteboard Session')

After an whiteboard session (pictured above), my brother and I came up with a plan:

- Find a [customizable calendar](https://github.com/wojtekmaj/react-calendar) online that we could use as a jumping off point.

- Store environment variables onto the server.

- Use [Axios](https://axios-http.com/) to put together an API call to Google Calendar.

- Send a POST request to Google Calendar API using Axios to retrieve events in a certain range of dates.

- Set the response to state.

![Famous Underpants Gnomes "???, Profit" meme from South Park](https://i.kym-cdn.com/entries/icons/facebook/000/000/248/profit.jpg 'Famous Underpants Gnomes "???, Profit" meme from South Park')

### Day 1-5:

The documentation on using the Google Calendar API with JavaScript to make a simple CRUD app is pretty thorough and fairly simple. However, the documentation on using the Google Calendar API to make calls that don't require users to authenticate is sparse. After all, this would be a public facing calendar.
After a week of research, I finally came across a video guide that seemed to be pretty thorough on how to create Google Service Accounts, give those accounts permission to access your API, and use CRUD operations to carry out various tasks with Google API.

The trick was to [create a Google Service Account](https://cloud.google.com/iam/docs/service-accounts-create) > [Give it the correct permissions to access the intended calendar](https://support.google.com/calendar/answer/37082?hl=en#zippy=) > create an API Key and download the JSON version of said key > later on in the code, pass that JSON object over to Google Calendar API, and perform the necessary CRUD actions.

If you're doing the same thing and are in need of some guidance, I recommend [this](https://www.youtube.com/watch?v=dFaV95gS_0M) video guide as a good jumping off point.

As a node application, everything that I did, in that video was working so far. I was finally able to boot up a test app, make calls to Google Calendar API, and retrieve some test events, exactly like Raj does in his video above.

![Google Calendar Test Event](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/Creating_A_Calendar/calendar_test_example.png 'Google Calendar Test Event')

### Day 6-12:

Everything was looking up until it wasn't. There was a couple of days where I was bumbling through Shopify documentation, trying to access environment variables from the Shopify App, for security reasons, I didn't just want to put the Calendar's Access JSON Object inside of the React Component. After a period of trying and failing, talking to Shopify support, and successfully accessing environment variables, the methods that I was using to parse the JSON object used to access the Calendar API (for reasons still beyond me) weren't working correctly.

> **I wasn't going to be able to make the code work. . .**

!["We Got A Situation" .gif from tenor.com](https://media.tenor.com/D7AcSgVAAxEAAAAC/we-got-a-problem-what-the-hell.gif '"We Got A Situation" .gif from tenor.com')

The whole project was on a timer, and for the sake of navigating the project to success, I talked with my brother about another route that he had mentioned at the start of the project. He recommended using AWS API Gateway and a Lambda function (initially for security purposes) but the benefits - I eventually learned that the benefits were multitudenous.

### Enter AWS API Gateway and Lambda Functions.

![Drake Meme - say "no" to API based on Express.js server, say "yes" to API's created using AWS Lambda](https://cdn.brocoders.com/Untitled-1_1b066f3826.png 'AWS Lambda ExpressJS Meme')

When I think of APIs and CRUD actions, I immediately think of Express servers. To use Express servers, you need to configure the server, configure the middleware of the server, write routes, and write controller functions that execute when a route is hit. This isn't a big deal, but then you need to find a place to host the server and maintain it.

AWS API Gateway and Lambda functions eliminate this need. To use them, you simply need to take the logic of the controller function that you would have written (and the dependencies needed to make that controller function run) and put it in a Lambda function. A Lambda function is simply a function that executes in response to an event. In this case, the event is a client (theboosterbox.com/calendar) calling out to a specific endpoint of our API Gateway endpoint with a POST request.

- Ingress traffic hits the API Gateway Endpoint.

- The Lambda Function with logic that specifies the date range and events we want on the calendar triggers and returns a response object.

- AWS API Gateway sends the response back to the origin of the initial request (theboosterbox.com/calendar).

![AWS Lambda Function & API Gateway Resource Flow](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/Creating_A_Calendar/api-gateway_lambda_flow.png 'AWS Lambda Function & API Gateway Resource Flow')

### Day 7-15

I had never worked with AWS API Gateway before.

There were some obstacles in the road for me that, unfortunately I still don't know exactly what happened or why for the most part. For a few days, I was getting those pesky CORS Header errors. I had tried everything. I had tried different fetch methods from Axios, to Ky, just to basic fetch, and attempted to pass in headers. I attempted my best at [enabling CORS support on the API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors-console.html). The Lambda function had already had Access-Allow-Origin, Access-Allow-Headers, and Access-Allow-Method setup inside of it. Anxiety was building up. Doubts about my ability and whether or not I'd be able to pull of this project with this technology started to creep up.

Finally, I reached out to a local development Slack channel where some helpful people were able to find some logs that indicated the source of the issue was the API Gateway. The request was hitting the endpoint successfully, but once it got there, there was a 500 error. In a last ditch effort, I nuked the API Gateway and created a brand new one, following again AWS's documentation on doing so with CORS Support. As I said earlier, I'm still not sure why, but success! The fetch POST request in the app was making its way to the API Gateway, it passed its pre-flight check, and the Lambda Function fired off, returning test events from the The Booster Box's Google Calendar.

### Day 16 - 20

Days before I had gone out to a sea of incomprehensible errors and foreign technologies. But the winds brought me back to familiar waters in React. A few weeks before, I had studied the React Component that I'd be building the app off of and created a Figma Prototype of the Calendar inside the original Booster Box Sites Figma design that I had created a year prior that combined both entities.

![Figma Prototype](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/Creating_A_Calendar/prototype.png)

[React Calendar](https://github.com/wojtekmaj/react-calendar/blob/main/packages/react-calendar/README.md) is a free open source React Component that comes packaged with a ton of Props ready to handle all sorts of data and functions. For our purposes, I used the following props:

#### `Value`

The value prop is used to store and set a date object equal to the day that the app mounts on. It is used in various helper, setter, and getter functions, and most notably, it is passed into the fetch request that returns the events of the month that is inside the `value`` object at the time of creation.

In other words, the value prop is used to keep track of the currently selected date and to fetch the events for that date.

#### `onActiveStartDateChange`

The onActiveStartDateChange prop is used to handle changes to the activeStartDate state variable. The activeStartDate state variable represents the beginning of the month that is currently being displayed in the calendar.

When a user clicks on the next or previous month buttons, the activeStartDate state variable is updated. This triggered the call to Google Calendar but with the updated activeStartDate instead of whatever the current value was thus retrieving the new months events.

#### `onClickDay`

The onClickDay prop is used to handle clicks on calendar days. When a user clicks on a day, the onClickDay callback function is called with the date of the clicked day as an argument. In this case, I used this prop to update the value that is in state that is filtering the array of events for the month that are on a particular date - the one that the user last clicked on.

### `tileContent`

The tileContent prop is used to render the content of each calendar tile. A function can be passed to the tileContent prop that will be called for each tile. In my case, I called a function that would return a `p` tag on every tile whose date corresponded with the date that existed in the eventsForThisMonth array or null if it didn't.

### `showNeighboringMonth`, `next2label`, & `prev2label`

The showNeighboringMonth prop is used to control whether or not dates from neighboring months are displayed in the calendar. If the showNeighboringMonth prop is set to true, then dates from neighboring months will be displayed in the first and last weeks of the current month.

The next2Label and prev2Label props are used to set the labels for the next and previous month buttons, respectively.

To prevent users from accidentally breaking the app's logic, I passed a false value to each of these props. This is a temporary measure, as I didn't have enough time to consider all of the possible ways that the app could be affected if users were allowed to use the props out of the box.

### The Result

![End Result](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/Creating_A_Calendar/finished_product.png)

Unfortunately, I submitted the component for review a few days late. But during the review, all of the features and use cases that The Booster Box required were present, and I had implemented guards to ensure that the app would run smoothly. Additionally, the app looked exactly how I had designed it, which was something I didn't think was possible a few months ago.

After the owners reviewed the component, they praised the design, and were grateful that the product was delivered. There was immediate feedback, that wasn't addressed when I submitted the prototype was reviewed, but such is the life of a designer.

All in all, I'm incredibly grateful for the experience, I felt like I've grown a ton in my own personal resillience having to modify my plans, adapt to new technologies, and continually put negative thought spirals out of mind to be able to stay level headed enough to get the work done and delivered. I'm excited to see what's next, and how I can continue to grow as a Software Developer.

Thanks so much for sticking around and reading the entirety of this post, if you have any thoughts on the app, or my process, or just want to chat, feel free to reach out to me at my email - anthony.john.medina@gmail.com.
