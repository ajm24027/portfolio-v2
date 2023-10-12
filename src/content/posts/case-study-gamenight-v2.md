---
title: 'Case Study: GameNight - v2'
publishedAt: 2023-10-13
description: 'and the lessons I learned along the way.'
slug: 'case-study-gamenight-v2.md'
isPublish: true
---

![GameNight in it's first iteration](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/gamenighthead.png)

In April when I joined my Software Engineering Immersive at General Assembly, we gained access to a student dashboard where we kept track of various school related tasks. The bottom of the dashboard immedietly caught my attention on day one. There was a section labeled "Capstone Modules". The words "UX Engineering" especially caught my attention. The whole reason I joined the SWE Bootcamp was to synthesize my UX Design skills with Software Engineering Skills. Since then, I had been eyeing that project. And when I finally found time this month to get around to it, it did not disappoint.

### The Objective

> "Design and conduct usability tests on both your original application (a project I created in class) and your clickable prototype with at least three participants. Synthesize your findings in either a rainbow sheet method or a formal test report, and compare the performance of both versions."

I chose to rework my second Immersive project, a full-stack event management app called GameNight. During the Immersive, I was working with EJS and had to deliver the project in a week, so I felt that this app, which I genuinely love, didn't get the attention it deserved. This time around, I wanted to give it the red carpet treatment.

Without further adieu, I'd like to present to you my Case Study. . .

### The Problem(s)

GameNight was originally planned to be a native mobile app, developed in Swift or React Native. The whole idea of the app was to encourage users to travel to new places and find interesting games to play with new people. But I wondered what kind of experience I could really deliver if users had an optimal experience on their desktop instead.

So I started the project by identifying areas and features that wouldn't serve potential users who were in the mood to travel, as well as features and flows that took away from the main objective of the app: finding new and interesting games for users to sign up for:

**Resposiveness**

- There's a limitation to the technical execution of the app at play here. Currently, I do not know how to code native mobile apps yet. However, I can emulate the native mobile app experience by leveraging Component Libraries like Chakra-UI or MaterialUI, as they come pre-packaged with components and containers that are easy to use with Flex Grid & Flex Grow, which would allow me to create a unified experience for mobile and desktop, something that the current app (the chaos of which is seen below) sorely lacks.

![GameNight - v1's Chaotic Responsiveness](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/gamenight_responsive_chaos.png)

**Friction-filled Experiences**

- As someone who had just learned JavaScript, EJS, and REST APIs (and didn't even truly know what an API was a week prior), building the app was a feat in itself. At the time, I didn't realize that a function could contain multiple functions within it. This led to a two-step process for creating an event with an address, coordinates, and a Mapbox reference, which got really messy when rendered in EJS (see the usability test results later).

- Now that I know better, I realize that creating an event, calling an API to retrieve coordinates from a user-input address, and adding those coordinates to the event (which eventually renders the Mapbox map) can all be done in a single function, removing one more (chaotic) step from the event creation process and making it easier overall.

![GameNight - v1's More chaotic Responsiveness](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/more_responsive_chaos.png)

**Distracting User Flows**

- Chat - In its current form (seen above), chat is a nice idea, but it doesn't make sense on an event page. I think it might distract users from the main goal of an event page, which is to scan the information and details of an event, decide whether or not to join the GameNight, and click or press "Join GameNight."

- Search - The app is a school project, so it only has a few events at a time. But in production, there might be many GameNights per month, and the explore page could get cluttered with information and events. This would make it difficult for users to find the event they want. One way to solve this problem is to implement a search function where users can search GameNights by host name, name of the GameNight, game type, or location. This would allow users to find only the events they're interested in.

### Research

![GameNight's Latest Sitemap](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/Sitemap.png)

![GameNight Clickable Prototype](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/clickable_prototype.png)

I created a prototype of version 2 of the app, where the redesigned features were implemented. I then created a Google Forms survey with questions in the following format:

- A request to complete a specific task.
- An open-ended question on the user's satisfaction, difficulty, or ability to complete the task.

The survey itself had two parts:

- Part 1: A link to the original app, instructions on how to complete the survey, and 7 questions each involving a different task.
- Part 2: Identical to Part 1, except that users were linked to and asked to complete the tasks outlined in the survey questions in the revised app prototype.

![GameNight Usability Survey](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/usability_survey.png)

I then reached out to my LinkedIn Network and a local slack community for Designers and found 3 users who were willing to take the survey. After a day, they had all completed the survey, afterwhich I placed all of the survey results into a spreadsheet, comparing each user's answers and tallying them up to create a performance score. Finally, I compared the two overall performance scores of each variant of the app to justify my design choices.

![GameNight Usability Test Results](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/usability_test_results.png)

### Results

The second iteration of the app, the prototype, outperformed the original design. Based on the usability test results, I drew the following conclusions about the app's design:

- The redesigned homepage, with its less cluttered layout and more efficient rendering of GameNights, helped users to better understand the app.
- Improved location handling made the app significantly easier to use, according to all users.
- Overall, users found it easier to locate and sign up for GameNights.

With similar results across the other tests, the revised version outperformed the original design by 13% in terms of overall performance (ease of use, satisfaction, friction).

### Learnings

![Various Frames of the Redesign Prototype](https://anthonyjmedina-portfolio-images.s3.us-east-2.amazonaws.com/case_study_gamenight_v2/other_frames.png)

My test users were incredibly helpful and provided me with some valuable feedback. One common request was for a section in the survey for general comments and feedback. Some users also reported that the test felt binary (which it was), even though they didn't have any specific feedback at the time. Others did have specific feedback for the app, such as the navigation being difficult to find in the header, but they didn't have anywhere to put it.

I also recognize that the credibility of the test is slightly muddled by the fact that the two variants are unequal in their literal performance. Navigating through the prototype may have been perceived as easier because, as the designer, I only sought to emulate the feeling of going through the app and "helped" users complete the tasks. For example, when users attempted to create a game night in the prototype, I filled in the literal information that they might have put in. This makes me think that at least one of the answers may be skewed.

If I had more time, I would have developed a variant 2 of the app so that the two experiences would have been as close to each other as possible. This would have made the test more credible and the results more reliable.

### In summation

I set out to redesign my GameNight Event Management App, and make it easier and more satisfying for potential users to use.

The three areas that I identified could be improved were, responsiveness, friction, and the scope of the app. I addressed the responsiveness problem by taking into consideration of various Component Libraries that would or could be used in development. I planned to reduce friction by streamlining the event creation process. And Lastly, I shrunk the scope of the app's abilities in an effort to focus users on their primary goals.

I planned a redesigned version, planning the information architecture, creating a sitemap, and a clickable prototype. This clickable prototype was used alongside the main app in a usability test to evaluate the redesign. The results showed that users found the app to be easier to use and more satisfying overall. Two of the specific changes, adding a search feature and improving the address/location handling in the event creation process, were particularly well-received.

Lastly, I learned that users can provide valuable feedback outside of the confines of a usability survey. My mind wonders what sorts of feedback would I have gotten if my users had a place to fully and freely speak their own minds?

---

### Thank you!

For taking the time to go through this case study. If you have any thoughts on the case study, or have any learning resources on UX Research I’d love to hear from you! You can send me an email at - anthony.john.medina@gmail.com
